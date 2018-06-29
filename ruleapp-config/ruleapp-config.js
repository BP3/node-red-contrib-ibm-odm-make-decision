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
  function RuleAppConfigNode(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.ruleappName = n.ruleappName;
    this.ruleappVersion = n.ruleappVersion;
    this.rulesetName = n.rulesetName;
    this.rulesetVersion = n.rulesetVersion;
    this.includeTrace = n.includeTrace;
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
