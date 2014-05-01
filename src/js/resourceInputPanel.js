/*
Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};


(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata");

    /******************
     * Resource Input *
     ******************/

    fluid.defaults("fluid.metadata.resourceInput", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        selectors: {
            srcLabel: ".gpiic-resourceInput-srcLabel",
            src: ".gpiic-resourceInput-src",
            languagesLabel: ".gpiic-resourceInput-languagesLabel",
            languages: ".gpiic-resourceInput-languages"
        },
        strings: {
            srcLabel: "Enter web link to caption:",
            languagesLabel: "Select language:",
            srcPlaceholder: "www.example.com/movie.srt",
            languages: ["Arabic", "Chinese", "English", "French", "Hindi", "Spanish"]
        },
        model: {
            src: "",
            language: "en"
        },
        controlValues: ["ar", "zh", "en", "fr", "hi", "es"],
        protoTree: {
            srcLabel: {messagekey: "srcLabel"},
            src: {
                value: "${src}",
                decorators: {
                    type: "attrs",
                    attributes: {placeholder: "${{that}.options.strings.srcPlaceholder}"}
                }
            },
            languagesLabel: {messagekey: "languagesLabel"},
            languages: {
                "selection": "${language}",
                "optionlist": "${{that}.options.controlValues}",
                "optionnames": "${{that}.options.strings.languages}"
            }
        },
        listeners: {
            "onCreate.loadTemplate": "fluid.metadata.resourceInput.loadTemplate"
        },
        resources: {
            template: {
                url: "../html/resourceInput-template.html",
                forceCache: true
            }
        }
    });

    fluid.metadata.resourceInput.loadTemplate = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.refreshView();
        });
    };

    /************************************
     * find transformation spec *
     ************************************/

    /*
     * The find transform is similar to that of the standard condition transform found in Infusion.
     * However, it determines the condition state by testing a specified path in each object of an array of objects,
     * and returns true if any of the values are truthy. (conceptually it's like performing an || over the values of
     * the array). After the first truthy value is found, the transformation will be returned.
     *
     * transform spec:
     * ==============
     *
     * condition (optional) - an array of objects to test
     * conditionPath (optional) - a path to the array of objects to test (takes priority over condition)
     * innerPath - the path into an object to use for testing.
     *             A signle path can be specified, and is used for all objects specifed in the condition or condtionPath
     * true - the value to return if the 'true' condition is met
     * false - the value to return if the 'false' condition is met
     *
     * Example :
     * =========
     *
     *  var model = {
     *     resources: [{
     *          src: "",
     *          language: "en"
     *      }, {
     *          src: "www.example.com/video.mp4",
     *          language: "fr"
     *      }]
     *  };
     *
     *  var rules = {
     *      value: {
     *          transform: {
     *              type: "fluid.transforms.find",
     *              conditionPath: "resources",
     *              innerPath: "src",
     *              "true": "available",
     *              "false": "unavailable"
     *          }
     *      }
     *  };
     *
     *  var transformed = fluid.model.transform(model, rules);
     *
     *  transformed === {
     *      value: "available"
     *  };
     */

    fluid.defaults("fluid.transforms.find", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ]
    });

    fluid.transforms.find = function (inputs, transformSpec, transform) {

        var conditions = transformSpec.conditionPath ? fluid.get(transform.source, transformSpec.conditionPath) : transformSpec.condition;
        var innerPath = transformSpec.innerPath || "";
        var result = fluid.find(conditions, function (condition) {
            // ensures that if a falsey  value is found it treats it as undefined.
            return fluid.get(condition, innerPath) || undefined;
        });

        return transformSpec[result ? "true" : "false"];
    };

    /************************
     * Resource input panel *
     ************************/

    fluid.defaults("fluid.metadata.baseResourceInputPanel", {
        gradeNames: ["fluid.metadata.panel", "autoInit"],
        selectors: {
            inputs: ".gpiic-resourceInputPanel-inputs",
            input: ".gpiic-resourceInputPanel-input",
        },
        strings: {
            tooltip: {},
            resourceInput: {}
        },
        styles: {
            container: ""
        },
        model: {
            resources: [{
                src: "",
                language: "en"
            }, {
                src: "",
                language: "en"
            }]
        },
        members: {
            inputs: []
        },
        dynamicComponents: {
            input: {
                createOnEvent: "onCreateInput",
                type: "fluid.metadata.resourceInput",
                container: "{arguments}.0",
                options: {
                    source: "{arguments}",
                    strings: "{baseResourceInputPanel}.options.strings.resourceInput",
                    model: {
                        expander: {
                            funcName: "fluid.copy",
                            args: "{that}.options.source.1"
                        }
                    },
                    modelListeners: {
                        // could be changed to "" when updated to the new model relay system
                        "*": {
                            func: "{baseResourceInputPanel}.updateModel",
                            args: ["{change}.value", "{change}.path", "{that}.options.source.2"]
                        }
                    },
                    listeners: {
                        onCreate: {
                            "this": "{baseResourceInputPanel}.inputs",
                            "method": "push"
                        }
                    }
                }
            }
        },
        components: {
            indicator: {
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: {
                        tooltipContent: "{baseResourceInputPanel}.options.strings.tooltip"
                    },
                    listeners: {
                        onAttach: {
                            listener: "{baseResourceInputPanel}.events.afterIndicatorReady",
                            priority: "last"
                        }
                    }
                }
            }
        },
        events: {
            afterMarkupReady: null,
            afterRenderPrimaryCaption: null,
            afterRenderSecondaryCaption: null,
            onCreateInput: null,
            onRenderInputContainer: null,
            afterIndicatorReady: null,
            onReady: {
                events: {
                    onCreate: "onCreate",
                    afterMarkupReady: "afterMarkupReady",
                    afterIndicatorReady: "afterIndicatorReady"
                },
                args: "{that}"
            }
        },
        listeners: {
            "onCreate.fetchTemplate": "fluid.metadata.baseResourceInputPanel.fetchTemplate",
            "onCreate.applyContainerStyle": {
                "this": "{that}.container",
                "method": "addClass",
                "args": "{that}.options.styles.container"
            },
            "afterMarkupReady.setTitle": {
                "this": "{that}.dom.title",
                "method": "text",
                "args": ["{that}.options.strings.title"]
            },
            "afterMarkupReady.getInputContainer": {
                funcName: "fluid.metadata.baseResourceInputPanel.cloneInputContainer",
                args: ["{that}", "{that}.dom.input"],
                priority: "first"
            },
            "afterMarkupReady.initInputs": "{that}.initInputs",
            "onRenderInputContainer.renderInputContainer": "{that}.renderInputContainer"
        },
        invokers: {
            updateModel: {
                funcName: "fluid.metadata.baseResourceInputPanel.updateModel",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "resources"],
                dynamic: true
            },
            initInputs: {
                funcName: "fluid.each",
                args: ["{that}.model.resources", "{that}.events.onRenderInputContainer.fire"]
            },
            renderInputContainer: {
                funcName: "fluid.metadata.baseResourceInputPanel.renderInputContainer",
                args: ["{that}.dom.inputs", "{that}.inputTemplate", "{arguments}.0", "{arguments}.1", "{that}.events.onCreateInput.fire"]
            }
        },
        indicatorModelRules: {
            value: {
                transform: {
                    type: "fluid.transforms.find",
                    conditionPath: "resources",
                    innerPath: "src",
                    "true": "available",
                    "false": "unavailable"
                }
            }
        },
        resources: {
            template: {
                url: "../html/resourceInputPanel-base-template.html",
                forceCache: true
            },
            resourceInput: {
                url: "../html/resourceInput-template.html",
                forceCache: true
            }
        },
        distributeOptions: [{
            source: "{that}.options.resources.resourceInput.url",
            target: "{that > resourceInput}.options.resources.template.url"
        }]
    });

    fluid.metadata.baseResourceInputPanel.updateModel = function (that, value, path, index, root) {
        var changePath = [root, index, path].join(".");
        that.applier.change(changePath, value);
    };

    fluid.metadata.baseResourceInputPanel.fetchTemplate = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(resourceSpec.template.resourceText);
            that.events.afterMarkupReady.fire(that);
        });
    };

    fluid.metadata.baseResourceInputPanel.cloneInputContainer = function (that, elm) {
        that.inputTemplate = elm.remove();
    };

    fluid.metadata.baseResourceInputPanel.renderInputContainer = function (container, elm, model, idx, callback) {
        var input = elm.clone();
        container.append(input);
        callback(input, model, idx);
    };

    fluid.defaults("fluid.metadata.resourceInputPanel", {
        gradeNames: ["fluid.metadata.baseResourceInputPanel", "autoInit"],
        selectors: {
            description: ".gpiic-resourceInputPanel-description"
        },
        strings: {
            description: ""
        },
        listeners: {
            "afterMarkupReady.writeDescription": {
                "this": "{that}.dom.description",
                "method": "text",
                "args": "{that}.options.strings.description",
            }
        },
        resources: {
            template: {
                url: "../html/resourceInputPanel-template.html",
                forceCache: true
            }
        }
    });

})(jQuery, fluid_1_5);
