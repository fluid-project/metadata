/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata");

    fluid.defaults("fluid.metadata.videoMetadataPanel", {
        gradeNames: ["fluid.rendererComponent", "fluid.metadata.defaultVideoModel", "autoInit"],
        selectors: {
            videoPanel: ".flc-videoPanel",
            audioPanel: ".flc-audioPanel",
            captionsPanel: ".flc-captionsPanel"
        },
        renderOnInit: true,
        // These sub components are managed through the renderer
        // to work around issues of creation/destruction.
        // When using these as subcomponents directly,
        // the components would be recreated with old model
        // values after being destroyed.
        protoTree: {
            expander: {
                type: "fluid.renderer.condition",
                condition: "${url}",
                trueTree: {
                    videoPanel: {
                        decorators: {
                            type: "fluid",
                            func: "fluid.metadata.videoPanel",
                            options: {
                                gradeNames: ["fluid.prefs.modelRelay"],
                                sourceApplier: "{metadataPanel}.applier",
                                model: {
                                    highContrast: "{metadataPanel}.model.highContrast",
                                    signLanguage: "{metadataPanel}.model.signLanguage",
                                    flashing: "{metadataPanel}.model.flashing"
                                },
                                rules: {
                                    highContrast: "highContrast",
                                    signLanguage: "signLanguage",
                                    flashing: "flashing"
                                }
                            }
                        }
                    },
                    audioPanel: {
                        decorators: {
                            type: "fluid",
                            func: "fluid.metadata.audioPanel",
                            options: {
                                gradeNames: ["fluid.prefs.modelRelay"],
                                sourceApplier: "{metadataPanel}.applier",
                                model: {
                                    audio: "{metadataPanel}.model.audio",
                                    keywords: "{metadataPanel}.model.audioKeywords"
                                },
                                rules: {
                                    audio: "audio",
                                    audioKeywords: "keywords"
                                }
                            }
                        }
                    },
                    captionsPanel: {
                        decorators: {
                            type: "fluid",
                            func: "fluid.metadata.captionsPanel",
                            options: {
                                gradeNames: ["fluid.prefs.modelRelay"],
                                sourceApplier: "{metadataPanel}.applier",
                                model: {
                                    captions: "{metadataPanel}.model.captions"
                                },
                                rules: {
                                    captions: "captions"
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.metadata.saveMetadata", {
        gradeNames: ["fluid.modelComponent", "autoInit"],
        modelListeners: {
            "*": {
                func: "{dataSource}.set",
                args: [{id: "videoMetadata", model: "{that}.model"}]
            }
        },
    });

    fluid.defaults("fluid.metadata.defaultVideoModel", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        members: {
            defaultModel: {
                url: "",
                highContrast: false,
                signLanguage: false,
                flashing: "unknown",
                audio: "available",
                keywords: [],
                captions: []
            }
        }
    });

    fluid.defaults("fluid.metadata.metadataPanel", {
        gradeNames: ["fluid.metadata.videoMetadataPanel", "fluid.metadata.saveMetadata", "autoInit"],
        events: {
            onReset: null
        },
        listeners: {
            "onCreate.setDefaultModel": {
                listener: "{that}.setModel",
                args: "{that}.defaultModel"
            },
            "onReset.setDefaultModel": {
                listener: "{that}.setModel",
                args: "{that}.defaultModel"
            }
        },
        modelListeners: {
            "url": "{that}.refreshView",
        },
        invokers: {
            setModel: {
                funcName: "fluid.metadata.metadataPanel.setModel",
                args: ["{that}", "{arguments}.0"]
            }
        }
    });

    fluid.metadata.metadataPanel.setModel = function (that, model) {
        that.applier.requestChange("", model);
    };

})(jQuery, fluid);
