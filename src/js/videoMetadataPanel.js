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

    /****************************************************************
     * The grade component that renders all panels for defining
     * metadata for video element.
     ****************************************************************/

    fluid.defaults("fluid.metadata.videoMetadataPanel", {
        gradeNames: ["fluid.metadata.metadataPanel", "fluid.metadata.defaultVideoModel", "autoInit"],
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
                type: "fluid.metadata.videoPanel",
                container: "{videoMetadataPanel}.dom.videoPanel",
                options: {
                    model: {
                        highContrast: "{videoMetadataPanel}.model.modelInTransit.highContrast",
                        signLanguage: "{videoMetadataPanel}.model.modelInTransit.signLanguage"
                    },
                    modelRelay: [{
                        source: "{videoMetadataPanel}.model.modelInTransit",
                        target: "{that}.model",
                        backward: "liveOnly",
                        singleTransform: {
                            type: "fluid.metadata.transforms.condition",
                            conditionPath: "flashing",
                            "true": {
                                transform: {
                                    type: "fluid.metadata.transforms.condition",
                                    conditionPath: "noFlashing",
                                    "false": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "flashing",
                                            outputPath: "flashing"
                                        }
                                    }
                                }
                            },
                            "false": {
                                transform: {
                                    type: "fluid.metadata.transforms.condition",
                                    conditionPath: "noFlashing",
                                    "true": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "noFlashing",
                                            outputPath: "flashing"
                                        }
                                    },
                                    "false": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "unknown",
                                            outputPath: "flashing"
                                        }
                                    }
                                }
                            }
                        }
                    }],
                    listeners: {
                        afterRender: "{videoMetadataPanel}.events.videoPanelRendered.fire"
                    }
                }
            },
            audioPanel: {
                type: "fluid.metadata.audioPanel",
                container: "{videoMetadataPanel}.dom.audioPanel",
                options: {
                    model: {
                        keywords: "{videoMetadataPanel}.model.metadata.keywords"
                    },
                    modelRelay: [{
                        source: "{videoMetadataPanel}.model.modelInTransit",
                        target: "{that}.model",
                        backward: "liveOnly",
                        singleTransform: {
                            type: "fluid.metadata.transforms.condition",
                            conditionPath: "audio",
                            "true": {
                                transform: {
                                    type: "fluid.transforms.literalValue",
                                    value: "available",
                                    outputPath: "audio"
                                }
                            },
                            "false": {
                                transform: {
                                    type: "fluid.transforms.literalValue",
                                    value: "unavailable",
                                    outputPath: "audio"
                                }
                            }
                        }
                    }],
                    listeners: {
                        afterRender: "{videoMetadataPanel}.events.audioPanelRendered.fire"
                    }
                }
            },
            captionsPanel: {
                type: "fluid.metadata.captionsPanel",
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

    fluid.defaults("fluid.metadata.defaultVideoModel", {
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
