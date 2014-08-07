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

    fluid.registerNamespace("gpii.metadata");

    /****************************************************************
     * The grade component that renders all panels for defining
     * metadata for video element.
     ****************************************************************/

    fluid.defaults("gpii.metadata.videoMetadataPanel", {
        gradeNames: ["gpii.metadata.metadataPanel", "gpii.metadata.defaultVideoModel", "autoInit"],
        selectors: {
            videoPanel: ".gpiic-videoPanel",
            audioPanel: ".gpiic-audioPanel",
            captionsPanel: ".gpiic-captionsPanel"
        },
        modelRelay: [{
            source: "{videoMetadataPanel}.model.metadata.accessibilityFeature",
            target: "{videoMetadataPanel}.model.modelInTransit",
            backward: "liveOnly",
            singleTransform: {
                type: "fluid.transforms.arrayToSetMembership",
                options: {
                    "highContrast": "highContrast",
                    "signLanguage": "signLanguage"
                }
            }
        }, {
            source: "{videoMetadataPanel}.model.metadata.accessibilityHazard",
            target: "{videoMetadataPanel}.model.modelInTransit",
            backward: "liveOnly",
            singleTransform: {
                type: "fluid.transforms.arrayToSetMembership",
                options: {
                    "flashing": "flashing",
                    "noFlashing": "noFlashing",
                    "sound": "sound",
                    "nosoundHazard": "nosoundHazard"
                }
            }
        }, {
            source: "{videoMetadataPanel}.model.metadata.accessMode",
            target: "{videoMetadataPanel}.model.modelInTransit",
            backward: "liveOnly",
            singleTransform: {
                type: "fluid.transforms.arrayToSetMembership",
                options: {
                    "audio": "audio"
                }
            }
        }],
        components: {
            videoPanel: {
                type: "gpii.metadata.videoPanel",
                container: "{videoMetadataPanel}.dom.videoPanel",
                options: {
                    model: {
                        highContrast: "{videoMetadataPanel}.model.modelInTransit.highContrast",
                        signLanguage: "{videoMetadataPanel}.model.modelInTransit.signLanguage"
                    },
                    modelRelay: {
                        source: "{videoMetadataPanel}.model.modelInTransit",
                        target: "{that}.model.flashing",
                        backward: "liveOnly",
                        singleTransform: {
                            type: "fluid.transforms.valueMapper",
                            inputPath: "",
                            options: [{
                                inputValue: {
                                    "flashing": true,
                                    "noFlashing": false
                                },
                                outputValue: "flashing"
                            }, {
                                inputValue: {
                                    "flashing": false,
                                    "noFlashing": true
                                },
                                outputValue: "noFlashing"
                            }, {
                                inputValue: {
                                    "flashing": false,
                                    "noFlashing": false
                                },
                                outputValue: "unknown"
                            }]
                        }
                    },
                    listeners: {
                        afterRender: "{videoMetadataPanel}.events.videoPanelRendered.fire"
                    }
                }
            },
            audioPanel: {
                type: "gpii.metadata.audioPanel",
                container: "{videoMetadataPanel}.dom.audioPanel",
                options: {
                    model: {
                        keywords: "{videoMetadataPanel}.model.metadata.keywords"
                    },
                    modelRelay: {
                        source: "{videoMetadataPanel}.model.modelInTransit",
                        target: "{that}.model",
                        backward: "liveOnly",
                        singleTransform: {
                            type: "fluid.transforms.valueMapper",
                            inputPath: "audio",
                            options: [{
                                "inputValue": true,
                                "outputPath": "audio",
                                "outputValue": "available"
                            }, {
                                "inputValue": false,
                                "outputPath": "audio",
                                "outputValue": "unavailable"
                            }]
                        }
                    },
                    listeners: {
                        afterRender: "{videoMetadataPanel}.events.audioPanelRendered.fire"
                    }
                }
            },
            captionsPanel: {
                type: "gpii.metadata.captionsPanel",
                container: "{videoMetadataPanel}.dom.captionsPanel",
                options: {
                    model: {
                        resources: "{videoMetadataPanel}.model.captions"
                    },
                    listeners: {
                        onReady: "{videoMetadataPanel}.events.captionsPanelRendered.fire"
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
            target: "{that > videoPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.audioPanelTemplate",
            target: "{that > audioPanel}.options.audioTemplate"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            target: "{that > audioPanel}.options.audioAttributesTemplate"
        }, {
            source: "{that}.options.captionsPanelTemplate",
            target: "{that > captionsPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.captionsInputTemplate",
            target: "{that > captionsPanel}.options.resources.resourceInput.url"
        }]
    });

    fluid.defaults("gpii.metadata.defaultVideoModel", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        members: {
            defaultModel: {
                url: "",
                metadata: {
                    accessibilityFeature: [],
                    accessibilityHazard: [],
                    accessMode: ["audio"],
                    keywords: []
                },
                captions: []
            }
        }
    });

})(jQuery, fluid);
