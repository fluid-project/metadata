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

    fluid.registerNamespace("gpii.metadata");

    /*******************************************************************************
     * The panel to define audio related metadata
     *******************************************************************************/

    fluid.defaults("gpii.metadata.audioPanel", {
        gradeNames: ["fluid.rendererRelayComponent", "gpii.metadata.panel", "autoInit"],
        components: {
            indicator: {
                createOnEvent: "afterRender",
                options: {
                    strings: {
                        tooltipContent: {
                            "available": "${{that}.options.strings.audioAvailable}",
                            "unavailable": "${{that}.options.strings.audioUnavailable}"
                        }
                    },
                    modelRelay: {
                        source: "{audioPanel}.model.audio",
                        target: "{that}.model.value",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            },
            attributes: {
                type: "gpii.metadata.audioPanel.attributes",
                createOnEvent: "afterRender",
                container: {
                    expander: {
                        funcName: "{that}.getContainerForAttributes"
                    }
                },
                options: {
                    model: {
                        audio: "{audioPanel}.model.audio",
                        keywords: "{audioPanel}.model.keywords"
                    },
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
        strings: {
            title: "Audio",
            audio: ["Yes, this video has an audio track.", "No, this video has no audio track or I am not sure."],
            audioAvailable: "Audio Attribute is available.",
            audioUnavailable: "Audio Attribute is unavailable."
        },
        controlValues: ["available", "unavailable"],
        selectors: {
            title: ".gpiic-audio-title",
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
            "onCreate.init": "gpii.metadata.audioPanel.init"
        },
        invokers: {
            getContainerForAttributes: {
                funcName: "gpii.metadata.audioPanel.getContainerForAttributes",
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

    gpii.metadata.audioPanel.init = function (that) {
        fluid.fetchResources(that.options.resources, function () {
            that.refreshView();
        });
    };

    gpii.metadata.audioPanel.getContainerForAttributes = function (container, attributesSelector) {
        return container.find(attributesSelector + ":first");
    };

    /*******************************************************************************
     * The subpanel of gpii.metadata.audioPanel. Used to populate audio attributes
     *******************************************************************************/

    fluid.defaults("gpii.metadata.audioPanel.attributes", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
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
                    "funcName": "gpii.metadata.audioPanel.attributes.enableAttributes",
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
                listener: "gpii.metadata.audioPanel.attributes.addAria",
                args: "{that}.container"
            }
        },
        renderOnInit: true
    });

    gpii.metadata.audioPanel.attributes.enableAttributes = function (audioValue) {
        return audioValue === "available";
    };

    gpii.metadata.audioPanel.attributes.addAria = function (container) {
        container.attr("role", "region");
        container.attr("aria-live", "polite");
        container.attr("aria-relevant", "additions removals");
    };

})(jQuery, fluid);
