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
var chai = require("chai");
var MakeDecisionUtils = require("../make-decision/make-decision-utils.js");
var makeDecisionUtils = new MakeDecisionUtils();

describe("test the building of the decision service URL", function() {
  it("should build a basic decision service URL", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      rulesetName: "MyRuleSet",
      protocolHost: "http://myhost",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost/MyEndPoint/MyRuleApp/MyRuleSet");
  });

  it("should build a decision service URL with a port", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      rulesetName: "MyRuleSet",
      protocolHost: "http://myhost",
      port: "9080",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost:9080/MyEndPoint/MyRuleApp/MyRuleSet");
  });

  it("should build a decision service URL with a rule app version only", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      ruleappVersion: "1.0",
      rulesetName: "MyRuleSet",
      protocolHost: "http://myhost",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost/MyEndPoint/MyRuleApp/1.0/MyRuleSet");
  });

  it("should build a decision service URL with a rule set version only", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      rulesetName: "MyRuleSet",
      rulesetVersion: "1.0",
      protocolHost: "http://myhost",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost/MyEndPoint/MyRuleApp/MyRuleSet/1.0");
  });

  it("should build a decision service URL with a rule app and rule set version", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      ruleappVersion: "1.0",
      rulesetName: "MyRuleSet",
      rulesetVersion: "2.0",
      protocolHost: "http://myhost",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost/MyEndPoint/MyRuleApp/1.0/MyRuleSet/2.0");
  });

  it("should build a decision service URL with all the configuration options", function() {
    var mockConfig = {
      ruleappName: "MyRuleApp",
      ruleappVersion: "1.0",
      rulesetName: "MyRuleSet",
      rulesetVersion: "2.0",
      protocolHost: "http://myhost",
      port: "9080",
      baseEndpointURL: "MyEndPoint"
    };

    var actualDSUrl = makeDecisionUtils.buildDecisionServiceURL(mockConfig);
    chai.expect(actualDSUrl).to.equal("http://myhost:9080/MyEndPoint/MyRuleApp/1.0/MyRuleSet/2.0");
  });
});

describe("test the building of the decision service configuration object", function() {
  // This is mocking the configuration nodes and data
  var mockNodeConfig = {
    ruleapp: {
      name: "TestRuleAppConfig",
      ruleappName: "MyRuleAppConfig",
      ruleappVersion: "1.0",
      rulesetName: "MyRuleSetConfig",
      rulesetVersion: "2.0",
      includeTrace: true
    },
    server: {
      name: "TestServerConfig",
      protocolHost: "http://myhost",
      port: "9080",
      baseEndpointURL: "MyEndPointConfig",
      useBasicAuthentication: true,
      credentials: {
        authUser: "Test Config User",
        authPassword: "Test Config Password"
      }
    }
  };

  // This is mocking the Node-RED objects that is passed into the node at runtime
  // where we can access the configuration nodes from
  var mockRED = {
    nodes: {
      getNode: function(nodeConfig) {
        return nodeConfig;
      }
    }
  };

  // Base expected config that will be changed for each test
  var baseExpectedConfig = {
    ruleappName: "MyRuleAppConfig",
    ruleappVersion: "1.0",
    rulesetName: "MyRuleSetConfig",
    rulesetVersion: "2.0",
    includeTrace: true,
    protocolHost: "http://myhost",
    port: "9080",
    baseEndpointURL: "MyEndPointConfig",
    useBasicAuthentication: true,
    authUser: "Test Config User",
    authPassword: "Test Config Password"
  };

  it("should override the rule app name with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          ruleappName: "MyRuleAppMsg"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.ruleappName = mockMsg.odm.config.ruleappName;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the rule app version with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          ruleappVersion: "2.0"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.ruleappVersion = mockMsg.odm.config.ruleappVersion;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the rule set name with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          rulesetName: "MyRuleSetMsg"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.rulesetName = mockMsg.odm.config.rulesetName;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the rule set version with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          rulesetVersion: "3.0"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.rulesetVersion = mockMsg.odm.config.rulesetVersion;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the include trace flag with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          includeTrace: false
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.includeTrace = mockMsg.odm.config.includeTrace;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the protocal and host with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          protocolHost: "http://localhostmsg"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.protocolHost = mockMsg.odm.config.protocolHost;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the port with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          port: "9090"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.port = mockMsg.odm.config.port;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the base URL the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          baseEndpointURL: "MyEndPointMsg"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.baseEndpointURL = mockMsg.odm.config.baseEndpointURL;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the use basic authentication flag with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          useBasicAuthentication: false
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.useBasicAuthentication = mockMsg.odm.config.useBasicAuthentication;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the authentication user with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          authUser: "Test Msg User"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.authUser = mockMsg.odm.config.authUser;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });

  it("should override the authentication password with the value in the message object", function() {
    var mockMsg = {
      odm: {
        config: {
          authPassword: "Test Msg Password"
        }
      }
    };

    // Clone the base expected config and alter the data we are overriding
    var expectedConfig = JSON.parse(JSON.stringify(baseExpectedConfig));
    expectedConfig.authPassword = mockMsg.odm.config.authPassword;

    var actualConfig = makeDecisionUtils.combineConfig(mockRED, mockNodeConfig, mockMsg);

    chai.expect(actualConfig).to.eql(expectedConfig);
  });
});
