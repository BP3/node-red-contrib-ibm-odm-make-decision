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
module.exports = function() {
  this.buildDecisionServiceURL = function(config) {
    console.log("Building the decision service URL");

    // Build the server Url. We might not have a port, for example for serviceStatusCode
    // hosted on an ODM On Cloud instance
    var dsUrl = config.protocolHost;
    if (config.port) {
      dsUrl = dsUrl + ":" + config.port;
    }

    dsUrl = dsUrl + "/" + config.baseEndpointURL + "/" + config.ruleappName;
    if (config.ruleappVersion && config.ruleappVersion.length > 0) {
      dsUrl = dsUrl + "/" + config.ruleappVersion;
    }
    dsUrl = dsUrl + "/" + config.rulesetName;
    if (config.rulesetVersion && config.rulesetVersion.length > 0) {
      dsUrl = dsUrl + "/" + config.rulesetVersion;
    }

    console.log("Built the decision service URL " + dsUrl);

    return dsUrl;
  };

  //
  // Loads the config from either the node or the message (or a combination of both)
  //
  this.combineConfig = function(RED, nodeConfig, msg) {
    console.log("Loading configuration");

    // We may not have config passed in via the message, only from the
    // config nodes
    var msgConfig = {};
    if(msg.odm && msg.odm.config)
    {
      msgConfig = msg.odm.config;
    }

    // Load the rule app config node to get the rule app information
    // If there is no rule app config then create an empty object so we
    // don't get a NPE when checking further down
    var ruleappConfig = RED.nodes.getNode(nodeConfig.ruleapp);
    if(!ruleappConfig)
    {
      ruleappConfig = {};
    }

    var localConfig = {};
    localConfig.decisionId = msgConfig.decisionId || ruleappConfig.decisionId;
    localConfig.ruleappName = msgConfig.ruleappName || ruleappConfig.ruleappName;
    localConfig.ruleappVersion = msgConfig.ruleappVersion || ruleappConfig.ruleappVersion;
    localConfig.rulesetName = msgConfig.rulesetName || ruleappConfig.rulesetName;
    localConfig.rulesetVersion = msgConfig.rulesetVersion || ruleappConfig.rulesetVersion;
    localConfig.includeTrace = msgConfig.includeTrace !== undefined
        ? msgConfig.includeTrace : ruleappConfig.includeTrace;

    // Load the decision server config node to get the credentials and server information
    // If there is no decision server config then create an empty object so we
    // don't get a NPE when checking further down
    var decisionServerConfig = RED.nodes.getNode(nodeConfig.server);
    if(!decisionServerConfig)
    {
      decisionServerConfig = {};
    }

    localConfig.protocolHost = msgConfig.protocolHost || decisionServerConfig.protocolHost;
    localConfig.port = msgConfig.port || decisionServerConfig.port;
    localConfig.baseEndpointURL = msgConfig.baseEndpointURL || decisionServerConfig.baseEndpointURL;
    localConfig.useBasicAuthentication = msgConfig.useBasicAuthentication !== undefined
        ? msgConfig.useBasicAuthentication : decisionServerConfig.useBasicAuthentication;
    localConfig.authUser = msgConfig.authUser || decisionServerConfig.credentials.authUser;
    localConfig.authPassword = msgConfig.authPassword || decisionServerConfig.credentials.authPassword;

    // Create an obfuscated deep copy config object for logging purposes
    var configForLogging = JSON.parse(JSON.stringify(localConfig));
    configForLogging.authPassword = "******";
    console.log("Loaded configuration " + JSON.stringify(configForLogging));

    return localConfig;
  };
};
