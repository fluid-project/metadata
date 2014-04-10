/*
Copyright 2013 OCAD University

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

    /*******************************************************************************
     * The panel to define audio related metadata
     *******************************************************************************/

    fluid.defaults("fluid.metadata.audioPanel", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        components: {
            attributes: {
                type: "fluid.metadata.audioPanel.attributes",
                createOnEvent: "afterRender",
                container: {
                    expander: {
                        funcName: "fluid.metadata.audioPanel.getContainerForAttributes",
                        args: ["{audioPanel}.container", "{audioPanel}.options.selectors.attributes"]
                    }
                },
                options: {
                    applier: "{audioPanel}.applier",
                    model: "{audioPanel}.model",
                    resources: {
                        template: "{audioPanel}.options.resources.attributesTemplate"
                    },
                    events: {
                        afterRender: "{audioPanel}.events.afterAttributesRendered"
                    }
                }
            }
        },
        model: {
            audio: "available"
        },
        strings: {
            title: "Audio",
            instruction: "Choose all that apply",
            audio: ["Yes, this video has an audio track.", "No, this video has no audio track.", "I am not sure if this video has an audio track."],
            audioAvailable: "Audio Attribute is available.",
            audioUnavailable: "Audio Attribute is unavailable."
        },
        controlValues: ["available", "unavailable", "unknown"],
        selectors: {
            title: ".gpiic-audio-title",
            instruction: ".gpiic-audio-instruction",
            icon: ".gpiic-audio-icon",
            audioRow: ".gpiic-audio-row",
            audioLabel: ".gpiic-audio-label",
            audioInput: ".gpiic-audio-input",
            attributes: ".gpiic-audio-attributes"
        },
        selectorsToIgnore: ["attributes"],
        repeatingSelectors: ["audioRow"],
        protoTree: {
            title: {messagekey: "title"},
            instruction: {messagekey: "instruction"},
            icon: {
                decorators: {
                    func: "fluid.metadata.indicator",
                    type: "fluid",
                    options: {
                        model: {
                            value: "${audio}"
                        },
                        tooltipContent: {
                            "available": "${{that}.options.strings.audioAvailable}",
                            "unavailable": "${{that}.options.strings.audioUnavailable}",
                            "unknown": "${{that}.options.strings.audioUnavailable}"
                        }
                    }
                }
            },
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "audioRow",
                labelID: "audioLabel",
                inputID: "audioInput",
                selectID: "audio-radio",
                tree: {
                    optionnames: "${{that}.options.strings.audio}",
                    optionlist: "${{that}.options.controlValues}",
                    selection: "${audio}"
                }
            }
        },
        resources: {
            template: {
                url: "../html/audio-template.html",
                forceCache: true
            },
            attributesTemplate: {
                url: "../html/audio-attributes-template.html",
                forceCache: true
            }
        },
        events: {
            afterAttributesRendered: null,
            onReady: {
                events: {
                    onCreate: "onCreate",
                    afterAttributesRendered: "afterAttributesRendered"
                },
                args: "{that}"
            }
        },
        listeners: {
            "onCreate.init": "fluid.metadata.audioPanel.init"
        },
        modelListeners: {
            "audio": "{that}.refreshView"
        },
        distributeOptions: [{
            source: "{that}.options.audioTemplate",
            target: "{that}.options.resources.template.url"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            target: "{that}.options.resources.attributesTemplate.url"
        }]
    });

    fluid.metadata.audioPanel.init = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.refreshView();
        });
    };

    fluid.metadata.audioPanel.getContainerForAttributes = function (container, attributesSelector) {
        return container.find(attributesSelector + ":first");
    };

    /*******************************************************************************
     * The subpanel of fluid.metadata.audioPanel. Used to populate audio attributes
     *******************************************************************************/

    fluid.defaults("fluid.metadata.audioPanel.attributes", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        strings: {
            keywords: ["Dialogue or narrative.", "Soundtrack.", "Sound effects."]
        },
        selectors: {
            keywordRow: ".gpiic-audio-keyword",
            keywordValue: ".gpiic-audio-keyword-value",
            keywordLabel: ".gpiic-audio-keyword-label"
        },
        controlValues: ["dialogue", "soundtrack", "sound effect"],
        repeatingSelectors: ["keywordRow"],
        protoTree: {
            expander: {
                "type": "fluid.renderer.condition",
                "condition": {
                    "funcName": "fluid.metadata.audioPanel.attributes.enableAttributes",
                    "args": "${audio}"
                },
                "trueTree": {
                    expander: {
                        type: "fluid.renderer.selection.inputs",
                        rowID: "keywordRow",
                        labelID: "keywordLabel",
                        inputID: "keywordValue",
                        selectID: "keyword",
                        tree: {
                            optionnames: "${{that}.options.strings.keywords}",
                            optionlist: "${{that}.options.controlValues}",
                            selection: "${keywords}"
                        }
                    }
                }
            }
        },
        model: {
            audio: "available"
        },
        renderOnInit: true
    });

    fluid.metadata.audioPanel.attributes.enableAttributes = function (audioValue) {
        return audioValue === "available";
    };

})(jQuery, fluid_1_5);
