/*
Copyright 2013 OCAD University
Copyright 2014 OCAD University

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
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        selectors: {
            srcLabel: ".flc-resourceInput-srcLabel",
            src: ".flc-resourceInput-src",
            languagesLabel: ".flc-resourceInput-languagesLabel",
            languages: ".flc-resourceInput-languages"
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
            "onCreate.init": "fluid.metadata.resourceInput.init"
        },
        resources: {
            template: {
                url: "../html/resourceInput-template.html",
                forceCache: true
            }
        }
    });

    fluid.metadata.resourceInput.init = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.refreshView();
        });
    };

    /************************************
     * conditionAny transformation spec *
     ************************************/

    fluid.defaults("fluid.transforms.conditionAny", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ]
    });

    fluid.transforms.conditionAny = function (inputs, transformSpec, transform) {

        var conditions = transformSpec.conditionPath ? fluid.get(transform.source, transformSpec.conditionPath) : transformSpec.condition;
        var innerPath = transformSpec.innerPath || "";
        for (var i=0; i <= conditions.length; i++) {
            var condition = conditions[i];
            if (fluid.get(condition, innerPath)) {
                return transformSpec["true"];
            }
        }

        return transformSpec["false"];
    };

    /************************
     * Resource input panel *
     ************************/

    fluid.defaults("fluid.metadata.baseResourceInputPanel", {
        gradeNames: ["fluid.metadata.panel", "autoInit"],
        selectors: {
            primaryResource: ".flc-resourceInputPanel-primary",
            secondaryResource: ".flc-resourceInputPanel-secondary",
        },
        strings: {
            tooltip: {},
            resources: {}
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
        components: {
            //TODO: use dynamic components instead of hard coding two resources
            primaryResource: {
                type: "fluid.metadata.resourceInput",
                container: "{that}.dom.primaryResource",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: "{baseResourceInputPanel}.options.strings.resources",
                    model: {
                        expander: {
                            funcName: "fluid.copy",
                            args: "{baseResourceInputPanel}.model.resources.0"
                        }
                    },
                    modelListeners: {
                        "*": {
                            func: "{baseResourceInputPanel}.updateModel",
                            args: ["{change}.value", "{change}.path", 0]
                        }
                    },
                    listeners: {
                        afterRender: "{baseResourceInputPanel}.events.afterRenderPrimaryCaption"
                    }
                }
            },
            secondaryResource: {
                type: "fluid.metadata.resourceInput",
                container: "{that}.dom.secondaryResource",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: "{baseResourceInputPanel}.options.strings.resources",
                    model: {
                        expander: {
                            funcName: "fluid.copy",
                            args: "{baseResourceInputPanel}.model.resources.1"
                        }
                    },
                    modelListeners: {
                        "*": {
                            func: "{baseResourceInputPanel}.updateModel",
                            args: ["{change}.value", "{change}.path", 1]
                        }
                    },
                    listeners: {
                        afterRender: "{baseResourceInputPanel}.events.afterRenderSecondaryCaption"
                    }
                }
            },
            indicator: {
                createOnEvent: "afterMarkupReady",
                options: {
                    tooltipContent: "{baseResourceInputPanel}.options.strings.tooltip"
                }
            }
        },
        events: {
            afterMarkupReady: null,
            afterRenderPrimaryCaption: null,
            afterRenderSecondaryCaption: null,
            onReady: {
                events: {
                    onCreate: "onCreate",
                    afterMarkupReady: "afterMarkupReady",
                    afterRenderPrimaryCaption: "afterRenderPrimaryCaption",
                    afterRenderSecondaryCaption: "afterRenderSecondaryCaption",
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
            }
        },
        invokers: {
            updateModel: {
                funcName: "fluid.metadata.baseResourceInputPanel.updateModel",
                args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "resources"],
                dynamic: true
            }
        },
        indicatorModelRules: {
            value: {
                transform: {
                    type: "fluid.transforms.conditionAny",
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
            target: "{that > primaryResource}.options.resources.template.url"
        }, {
            source: "{that}.options.resources.resourceInput.url",
            target: "{that > secondaryResource}.options.resources.template.url"
        }]
    });

    fluid.metadata.baseResourceInputPanel.updateModel = function (that, value, path, index, root) {
        var changePath = [root, index, path].join(".");
        that.applier.requestChange(changePath, value);
    };

    fluid.metadata.baseResourceInputPanel.fetchTemplate = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(resourceSpec.template.resourceText);
            that.events.afterMarkupReady.fire(that);
        });
    };

    fluid.defaults("fluid.metadata.resourceInputPanel", {
        gradeNames: ["fluid.metadata.baseResourceInputPanel", "autoInit"],
        selectors: {
            description: ".flc-resourceInputPanel-description"
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
