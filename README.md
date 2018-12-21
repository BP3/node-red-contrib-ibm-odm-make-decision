# Introduction
This Node-RED node allows IBM ODM decision services to be configured and executed from within a single node without having to resort to configuring a series nodes within a flow.

The purpose is to hide away the complexities of calling decision services and extracting the various parts of the response such as execution trace information, whilst providing easy to use configuration options that deal with the specifics of ODM.

# Usage
The Make Decision node can be found in the IBM ODM palette. Simply drag onto the canvas to start configuring and using it. It can be found in the IBM ODM section of the node palette as shown below.

![](https://raw.githubusercontent.com/BP3/node-red-contrib-ibm-odm-make-decision/master/images/make-decision-palette.png)

When the decision service is called, the status of the service is displayed on the flow, as shown below.

![](https://raw.githubusercontent.com/BP3/node-red-contrib-ibm-odm-make-decision/master/images/test-flow-service-status.png)

The configuration of the node is split into two parts using configuration nodes. The first is the target decision server configuration including the host and authentication details, and the second is the configuration of the rule app and rule set path. This allows a mixture of configurations per node, for example if you want to call the same rule app/rule set but on different target decision servers. Examples can be seen below.

![](https://raw.githubusercontent.com/BP3/node-red-contrib-ibm-odm-make-decision/master/images/server-details-config.png)

![](https://raw.githubusercontent.com/BP3/node-red-contrib-ibm-odm-make-decision/master/images/ruleapp-details-config.png)

You can also set the decision service configuration dynamically by setting properties on the `msg` object, which can be mixed and matched with the defined configuration nodes. An example can be seen below.

![](https://raw.githubusercontent.com/BP3/node-red-contrib-ibm-odm-make-decision/master/images/dynamic-config.png)

There is full documentation on how to configure the node within the node help info. There is also an example flow which can be imported from the file `make-decision/make-decision-test-flow.json`.

# Limitations
The component currently only works with JSON/REST services. This decision was made due to the fact that JSON/REST is the most popular method of communicating with ODM decision services, and that natively Node-RED works with JSON and Javascript Objects. If there is a demand for SOAP or XML/REST, then we will look to build it into the component.

The execution trace currently only returns the following information. Again of more trace data is required then we will look into building it into the component:
- Decision Id
- Requested ruleset path
- Executed ruleset path
- Execution date
- Execution duration
- List of the rules fired

# Testing
This component has been tested with the following ODM versions:
- ODM 8.9.2
- ODM On Cloud (version based on ODM 8.9 at the time of testing)

However given the stable nature of the HTDS functionality in ODM, this should work OK with past versions of ODM that support JSON over REST.
