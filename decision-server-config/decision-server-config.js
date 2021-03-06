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
module.exports = function(RED) {
  function DecisionServerConfigNode(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.protocolHost = config.protocolHost;
    this.baseEndpointURL = config.baseEndpointURL;
    this.port = config.port;
    this.useBasicAuthentication = config.useBasicAuthentication;
  }

  RED.nodes.registerType("decision-server-config", DecisionServerConfigNode, {
    defaults: {
      name: {},
      protocolHost: {},
      baseEndpointURL: {},
      port: {},
      useBasicAuthentication: {}
    },
    credentials: {
      authUser: {
        type: "text"
      },
      authPassword: {
        type: "password"
      }
    }
  });
};
