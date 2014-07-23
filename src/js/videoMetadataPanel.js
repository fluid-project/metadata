/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.metadata");

    /****************************************************************
     * The grade component that renders all panels for defining
     * metadata for video element.
     ****************************************************************/

    fluid.defaults("fluid.metadata.videoMetadataPanel", {
        gradeNames: ["fluid.rendererComponent", "fluid.metadata.defaultVideoModel", "autoInit"],
        selectors: {
            videoPanel: ".gpiic-videoPanel",
            audioPanel: ".gpiic-audioPanel",
            captionsPanel: ".gpiic-captionsPanel"
        },
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
                                sourceApplier: "{videoMetadataPanel}.applier",
                                model: {
                                    highContrast: "{videoMetadataPanel}.model.highContrast",
                                    signLanguage: "{videoMetadataPanel}.model.signLanguage",
                                    flashing: "{videoMetadataPanel}.model.flashing"
                                },
                                rules: {
                                    highContrast: "highContrast",
                                    signLanguage: "signLanguage",
                                    flashing: "flashing"
                                },
                                listeners: {
                                    afterRender: "{videoMetadataPanel}.events.videoPanelRendered.fire"
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
                                sourceApplier: "{videoMetadataPanel}.applier",
                                model: {
                                    audio: "{videoMetadataPanel}.model.audio",
                                    keywords: "{videoMetadataPanel}.model.keywords"
                                },
                                rules: {
                                    audio: "audio",
                                    keywords: "keywords"
                                },
                                listeners: {
                                    afterRender: "{videoMetadataPanel}.events.audioPanelRendered.fire"
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
                                sourceApplier: "{videoMetadataPanel}.applier",
                                model: {
                                    resources: "{videoMetadataPanel}.model.captions"
                                },
                                rules: {
                                    captions: "resources"
                                },
                                listeners: {
                                    afterMarkupReady: "{videoMetadataPanel}.events.captionsPanelRendered.fire"
                                }
                            }
                        }
                    }
                }
            }
        },
        events: {
            videoPanelRendered: null,
            audioPanelRendered: null,
            captionsPanelRendered: null,
            afterSubpanelsRendered: {
                events: {
                    videoPanelRendered: "videoPanelRendered",
                    audioPanelRendered: "audioPanelRendered",
                    captionsPanelRendered: "captionsPanelRendered"
                },
                args: "{that}"
            }
        },
        distributeOptions: [{
            source: "{that}.options.videoPanelTemplate",
            removeSource: true,
            target: "{that > videoPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.audioPanelTemplate",
            removeSource: true,
            target: "{that > audioPanel}.options.audioTemplate"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            removeSource: true,
            target: "{that > audioPanel}.options.audioAttributesTemplate"
        }, {
            source: "{that}.options.captionsPanelTemplate",
            removeSource: true,
            target: "{that > captionsPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.captionsInputTemplate",
            removeSource: true,
            target: "{that > captionsPanel}.options.resources.resourceInput.url"
        }]
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

})(jQuery, fluid);
