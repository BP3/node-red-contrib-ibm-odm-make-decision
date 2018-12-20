/*===========================================================================
 =
 = Copyright (c) BP3 Global Inc. 2018. All Rights Reserved.
 =
 = Permission is hereby granted, free of charge, to any person obtaining
 = a copy of this software and associated documentation files (the
 = "Software"), to deal in the Software without restriction, including
 = without limitation the rights to use, copy, modify, merge, publish,
 = distribute, sublicense, and/or sell copies of the Software, and to
 = permit persons to whom the Software is furnished to do so, subject to
 = the following conditions:
 =
 = The above copyright notice and this permission notice shall be
 = included in all copies or substantial portions of the Software.
 =
 ============================================================================*/
var jsonpath = require("jsonpath");
var request = require("request");
var MakeDecisionUtils = require("./make-decision-utils.js");

module.exports = function(RED) {
  function MakeDecision(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {

      console.log("Make decision input called");
      console.log("MakeDecision msg: " + JSON.stringify(msg, true));

      var makeDecisionUtils = new MakeDecisionUtils();

      // If all or some of the service configuration has been passed through in the message
      // rather than via the nodes config then use them over the configuration
      var localConfig = makeDecisionUtils.combineConfig(RED, config, msg);

      // Build the full decision endpoint URL
      var dsUrl = makeDecisionUtils.buildDecisionServiceURL(localConfig);

      // If we want trace information then set the trace filters
      if (localConfig.includeTrace) {
        msg.payload.__TraceFilter__ = {
          infoExecutionDuration: true,
          infoExecutionDate: true,
          infoRulesFired: true
        };
      }

      // Start building up an ODM response object
      msg.odm = {
        requestedUrl: dsUrl,
        requestBody: msg.payload
      };

      // Set up the POST request options
      var postOptions = {
        url: dsUrl,
        body: msg.payload,
        json: true,
        headers: {
          "Content-Type": "application/json",
        }
      };

      // If basic authentication is selected then add the credentials to the options
      if (localConfig.useBasicAuthentication) {
        postOptions.auth = {
          user: localConfig.authUser,
          pass: localConfig.authPassword,
          sendImmediately: true
        };

        console.log("Using basic authentication for this request");
      }

      // Sent the request and handle the response
      request.post(postOptions, function(error, response, body) {
        // By default the service has not errored unless proven otherwise
        msg.odm.hasErrored = false;

        // If we have a response and a status code then store that
        if (response && response.statusCode) {
          msg.odm.serviceStatusCode = response.statusCode;
        }

        // If everything went OK and we got back a response
        if (!error && response.statusCode === 200) {
          msg.payload = body;
          msg.odm.decisionId = body.__DecisionID__;

          // If we have asked for decision trace information then extract the values
          if (localConfig.includeTrace) {
            msg.odm.requestedRulesetPath = jsonpath.query(msg.payload, "$..requestedRulesetPath")[0];
            msg.odm.executedRulesetPath = jsonpath.query(msg.payload, "$..executedRulesetPath")[0];
            msg.odm.executionDate = jsonpath.query(msg.payload, "$..executionDate")[0];
            msg.odm.executionDuration = jsonpath.query(msg.payload, "$..executionDuration")[0];
            msg.odm.rulesFired = jsonpath.query(msg.payload, "$..rulesFired.ruleInformation[*].businessName");
          }

          node.status({
            fill: "green",
            shape: "dot",
            text: "Success"
          });

          // else if we didnt get an error but we didnt get back a 200 so
          // treat as an error return the whole response
        } else if (!error && response.statusCode !== 200) {
          msg.payload = response;
          msg.odm.hasErrored = true;
          node.status({
            fill: "red",
            shape: "dot",
            text: "Response code " + response.statusCode
          });
          // else of we got an error so return the error
        } else if (error) {
          msg.payload = error;
          msg.odm.hasErrored = true;
          node.status({
            fill: "red",
            shape: "dot",
            text: "Error"
          });
        }

        node.send(msg);
      });
    });
  }

  RED.nodes.registerType("make-decision", MakeDecision);
};
