/*
This software is provided under the MIT agreement.

Copyright 2018 BP3 Global, Incorporated.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
module.exports = function(RED) {
  function decisionServerConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.protocolHost = n.protocolHost;
    this.baseEndpointURL = n.baseEndpointURL;
    this.port = n.port;
    this.useBasicAuthentication = n.useBasicAuthentication;
  }

  RED.nodes.registerType("decision-server-config", decisionServerConfigNode, {
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
}
