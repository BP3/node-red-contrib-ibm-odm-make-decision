/*
This software is provided under the MIT agreement.

Copyright 2018 BP3 Global, Incorporated.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

module.exports = function() {
  //
  // Build the decision service Url from the configured component parts
  //
  this.buildDecisionServiceURL = function(config) {

    console.log("Building the decision service URL");

    // Build the server Url. We might not have a port, for example for serviceStatusCode
    // hosted on an ODM On Cloud instance
    var dsUrl = config.protocolHost;
    if (config.port) {
      dsUrl = dsUrl + ":" + config.port;
    }

    dsUrl = dsUrl + "/" + config.baseEndpointURL + "/" + config.ruleappName;
    if (config.ruleappVersion != null && config.ruleappVersion.length > 0) {
      dsUrl = dsUrl + "/" + config.ruleappVersion;
    }
    dsUrl = dsUrl + "/" + config.rulesetName;
    if (config.rulesetVersion != null && config.rulesetVersion.length > 0) {
      dsUrl = dsUrl + "/" + config.rulesetVersion;
    }

    console.log("Built the decision service URL " + dsUrl);

    return dsUrl;
  };

  //
  // Loads the config from either the node or the message (or a combination of both)
  //
  this.loadConfig = function(RED, nodeConfig, msg) {
    localConfig = {};

    console.log("Loading configuration");

    // Load the rule app config node to get the rule app information
    var ruleappConfig = RED.nodes.getNode(nodeConfig.ruleapp);

    // Rule app name
    if (this.checkNested(msg, "odm", "config", "ruleappName")) {
      localConfig.ruleappName = msg.odm.config.ruleappName;
    } else {
      localConfig.ruleappName = ruleappConfig.ruleappName;
    }

    // Rule app version
    if (this.checkNested(msg, "odm", "config", "ruleappVersion")) {
      localConfig.ruleappVersion = msg.odm.config.ruleappVersion;
    } else {
      localConfig.ruleappVersion = ruleappConfig.ruleappVersion;
    }

    // Rule set name
    if (this.checkNested(msg, "odm", "config", "rulesetName")) {
      localConfig.rulesetName = msg.odm.config.rulesetName;
    } else {
      localConfig.rulesetName = ruleappConfig.rulesetName;
    }

    // Rule set version
    if (this.checkNested(msg, "odm", "config", "rulesetVersion")) {
      localConfig.rulesetVersion = msg.odm.config.rulesetVersion;
    } else {
      localConfig.rulesetVersion = ruleappConfig.rulesetVersion;
    }

    // Include trace
    if (this.checkNested(msg, "odm", "config", "includeTrace")) {
      localConfig.includeTrace = msg.odm.config.includeTrace;
    } else {
      localConfig.includeTrace = ruleappConfig.includeTrace;
    }

    // Load the decision server config node to get the credentials and server information
    var decisionServerConfig = RED.nodes.getNode(nodeConfig.server);

    // Host
    if (this.checkNested(msg, "odm", "config", "protocolHost")) {
      localConfig.protocolHost = msg.odm.config.protocolHost;
    } else {
      localConfig.protocolHost = decisionServerConfig.protocolHost;
    }

    // Port
    if (this.checkNested(msg, "odm", "config", "port")) {
      localConfig.port = msg.odm.config.port;
    } else {
      localConfig.port = decisionServerConfig.port;
    }

    // Base endpoint URL
    if (this.checkNested(msg, "odm", "config", "baseEndpointURL")) {
      localConfig.baseEndpointURL = msg.odm.config.baseEndpointURL;
    } else {
      localConfig.baseEndpointURL = decisionServerConfig.baseEndpointURL;
    }

    // Use basic authentication
    if (this.checkNested(msg, "odm", "config", "useBasicAuthentication")) {
      localConfig.useBasicAuthentication = msg.odm.config.useBasicAuthentication;
    } else {
      localConfig.useBasicAuthentication = decisionServerConfig.useBasicAuthentication;
    }

    // Auth user
    if (this.checkNested(msg, "odm", "config", "authUser")) {
      localConfig.authUser = msg.odm.config.authUser;
    } else {
      localConfig.authUser = decisionServerConfig.credentials.authUser;
    }

    // Auth password
    if (this.checkNested(msg, "odm", "config", "authPassword")) {
      localConfig.authPassword = msg.odm.config.authPassword;
    } else {
      localConfig.authPassword = decisionServerConfig.credentials.authPassword;
    }

    // Create an obfuscated deep copy config object for logging purposes
    var configForLogging = JSON.parse(JSON.stringify(localConfig))
    configForLogging.authPassword = "******";

    console.log("Loaded configuration " + JSON.stringify(configForLogging));

    return localConfig;
  };

  //
  // Utility method to allow the checking of nested objects
  // Taken from: https://stackoverflow.com/a/2631198/811108
  //
  this.checkNested = function(obj /*, level1, level2, ... levelN*/ ) {
    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0; i < args.length; i++) {
      if (!obj || !obj.hasOwnProperty(args[i])) {
        return false;
      }
      obj = obj[args[i]];
    }
    return true;
  };
}
