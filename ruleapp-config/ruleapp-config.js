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
  function RuleAppConfigNode(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    this.ruleappName = config.ruleappName;
    this.ruleappVersion = config.ruleappVersion;
    this.rulesetName = config.rulesetName;
    this.rulesetVersion = config.rulesetVersion;
    this.includeTrace = config.includeTrace;
  }

  RED.nodes.registerType("ruleapp-config", RuleAppConfigNode, {
    defaults: {
      decisionId: {},
      ruleappName: {},
      ruleappVersion: {},
      rulesetName: {},
      rulesetVersion: {},
      includeTrace: {}
    }
  });
};
