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
        gradeNames: ["fluid.viewComponent", "fluid.metadata.defaultVideoModel", "autoInit"],
        selectors: {
            videoPanel: ".flc-videoPanel",
            audioPanel: ".flc-audioPanel",
            captionsPanel: ".flc-captionsPanel"
        },
        components: {
            videoPanel: {
                type: "fluid.metadata.videoPanel",
                container: "{videoMetadataPanel}.dom.videoPanel",
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
            },
            audioPanel: {
                type: "fluid.metadata.audioPanel",
                container: "{videoMetadataPanel}.dom.audioPanel",
                options: {
                    gradeNames: ["fluid.prefs.modelRelay"],
                    sourceApplier: "{videoMetadataPanel}.applier",
                    model: {
                        audio: "{videoMetadataPanel}.model.audio",
                        keywords: "{videoMetadataPanel}.model.audioKeywords"
                    },
                    rules: {
                        audio: "audio",
                        audioKeywords: "keywords"
                    },
                    listeners: {
                        afterRender: "{videoMetadataPanel}.events.audioPanelRendered.fire"
                    }
                }
            },
            captionsPanel: {
                type: "fluid.metadata.captionsPanel",
                container: "{videoMetadataPanel}.dom.captionsPanel",
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
