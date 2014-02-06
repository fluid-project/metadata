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

var demo = demo || {};

(function ($, fluid) {


    fluid.defaults("demo.metadata", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            simpleEditor: ".flc-simpleEditor",
            metadataPanel: ".flc-metadataPanelContainer"
        },
        events: {
            onCreateMetadataPanel: null,
            onReset: null
        },
        modelListeners: {
            "url": "demo.metadata.checkUrl({that}, {change}.value)"
        },
        components: {
            simpleEditor: {
                type: "fluid.simpleEditor",
                container: "{that}.dom.simpleEditor",
                options: {
                    members: {
                        applier: "{metadata}.applier"
                    },
                    model: "{metadata}.model",
                    listeners: {
                        "{metadata}.events.onReset": "{that}.reset",
                    }
                }
            },
            metadataPanel: {
                type: "fluid.metadata.metadataPanel",
                container: "{that}.dom.metadataPanel",
                createOnEvent: "onCreateMetadataPanel",
                options: {
                    gradeNames: ["fluid.metadata.videoMetadataPanel", "fluid.metadata.saveVideoMetadata"],
                    gradeNames: ["fluid.prefs.modelRelay", "fluid.metadata.videoMetadataPanel", "fluid.metadata.saveVideoMetadata"],
                    sourceApplier: "{metadata}.applier",
                    rules: {
                        url: "url"
                    },
                    listeners: {
                        "{metadata}.events.onReset": "{that}.events.onReset.fire",
                        "onCreate.setModel": {
                            listener: "{that}.setModel",
                            args: ["{dataSource}.savedModel"]
                        }
                    }
                }
            },
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "simpleEditor",
                    members: {
                        savedModel: null
                    },
                    invokers: {
                        saveModel: {
                            funcName: "demo.metadata.saveModel",
                            args: ["{metadata}", "{that}.savedModel", "{arguments}.0"]
                        }
                    },
                    listeners: {
                        "onCreate.fetchMarkup": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{simpleEditor}.setContent"]
                        },
                        "onCreate.fetchMetadata": {
                            listener: "{that}.get",
                            args: [{id: "videoMetadata"}, "{that}.saveModel"]
                        }
                    }
                }
            }
        },
        distributeOptions: [{
            source: "{that}.options.videoPanelTemplate",
            removeSource: true,
            target: "{that > metadataPanel}.options.videoPanelTemplate"
        }, {
            source: "{that}.options.audioPanelTemplate",
            removeSource: true,
            target: "{that > metadataPanel}.options.audioPanelTemplate"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            removeSource: true,
            target: "{that > metadataPanel}.options.audioAttributesTemplate"
        }, {
            source: "{that}.options.captionsPanelTemplate",
            removeSource: true,
            target: "{that > metadataPanel}.options.captionsPanelTemplate"
        }, {
            source: "{that}.options.captionsInputTemplate",
            removeSource: true,
            target: "{that > metadataPanel}.options.captionsInputTemplate"
        }]
    });

    demo.metadata.checkUrl = function (that, url) {
        if (!url) {
            return;
        } else if (url.trim() !== "") {
            that.events.onCreateMetadataPanel.fire();
        }
    };

    demo.metadata.saveModel = function (that, savedModel, model) {
        savedModel = model;
        that.applier.requestChange("url", model.url);
    };

    fluid.defaults("fluid.metadata.saveVideoMetadata", {
        gradeNames: ["fluid.modelComponent", "autoInit"],
        modelListeners: {
            "*": {
                func: "{dataSource}.set",
                args: [{id: "videoMetadata", model: "{that}.model"}]
            }
        }
    });

})(jQuery, fluid);
