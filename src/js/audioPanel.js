/*
Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.metadata");

    /*******************************************************************************
     * The panel to define audio related metadata
     *******************************************************************************/

    fluid.defaults("fluid.metadata.audioPanel", {
        gradeNames: ["fluid.rendererComponent", "fluid.metadata.panel", "autoInit"],
        components: {
            indicator: {
                createOnEvent: "afterRender",
                options: {
                    strings: {
                        tooltipContent: {
                            "available": "${{that}.options.strings.audioAvailable}",
                            "unavailable": "${{that}.options.strings.audioUnavailable}",
                            "unknown": "${{that}.options.strings.audioUnavailable}"
                        }
                    }
                }
            },
            attributes: {
                type: "fluid.metadata.audioPanel.attributes",
                createOnEvent: "afterRender",
                container: {
                    expander: {
                        funcName: "{that}.getContainerForAttributes"
                    }
                },
                options: {
                    members: {
                        applier: "{audioPanel}.applier"
                    },
                    model: "{audioPanel}.model",
                    resources: {
                        template: "{audioPanel}.options.resources.attributesTemplate"
                    },
                    events: {
                        afterRender: "{audioPanel}.events.afterAttributesRendered"
                    },
                    modelListeners: {
                        "audio": "{that}.refreshView"
                    }
                }
            }
        },
        model: {
            audio: "available"
        },
        indicatorModelRules: {
            value: "audio"
        },
        strings: {
            title: "Audio",
            audio: ["Yes, this video has an audio track.", "No, this video has no audio track.", "I am not sure if this video has an audio track."],
            audioAvailable: "Audio Attribute is available.",
            audioUnavailable: "Audio Attribute is unavailable."
        },
        controlValues: ["available", "unavailable", "unknown"],
        selectors: {
            title: ".gpiic-audio-title",
            instruction: ".gpiic-audio-instruction",
            indicator: ".gpiic-audio-icon",
            audioRow: ".gpiic-audio-row",
            audioLabel: ".gpiic-audio-label",
            audioInput: ".gpiic-audio-input",
            attributes: ".gpiic-audio-attributes"
        },
        selectorsToIgnore: ["indicator", "attributes"],
        repeatingSelectors: ["audioRow"],
        protoTree: {
            title: {messagekey: "title"},
            instruction: {messagekey: "instruction"},
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
        invokers: {
            getContainerForAttributes: {
                funcName: "fluid.metadata.audioPanel.getContainerForAttributes",
                args: ["{that}.container", "{that}.options.selectors.attributes"]
            }
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
        fluid.fetchResources(that.options.resources, function () {
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
            instruction: "Select all that apply",
            keywords: ["Dialogue or narrative.", "Soundtrack.", "Sound effects."]
        },
        selectors: {
            instruction: ".gpiic-audio-instruction",
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
                    instruction: {messagekey: "instruction"},
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
        listeners: {
            "onCreate.addAria": {
                listener: "fluid.metadata.audioPanel.attributes.addAria",
                args: "{that}.container"
            }
        },
        renderOnInit: true
    });

    fluid.metadata.audioPanel.attributes.enableAttributes = function (audioValue) {
        return audioValue === "available";
    };

    fluid.metadata.audioPanel.attributes.addAria = function (container) {
        container.attr("role", "region");
        container.attr("aria-live", "polite");
        container.attr("aria-relevant", "additions removals");
    };

})(jQuery, fluid);
