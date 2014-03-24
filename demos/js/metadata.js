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
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        selectors: {
            simpleEditor: ".flc-simpleEditor",
            metadataPanel: ".flc-metadataPanelContainer"
        },
        events: {
            onCreateMetadataPanel: null,
            onReset: null
        },
        listeners: {
            "onReset.destroyMetadataPanel": "{that}.doDestroy"
        },
        invokers: {
            "doDestroy": {
                funcName: "demo.metadata.doDestroy",
                args: "{that}"
            }
        },
        modelListeners: {
            "url": {
                listener: "demo.metadata.checkUrl",
                args: ["{that}", "{change}.value"]
            }
        },
        components: {
            simpleEditor: {
                type: "fluid.simpleEditor",
                container: "{that}.dom.simpleEditor",
                options: {
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
                    savedModel: {
                        expander: {
                            func: "demo.metadata.getMetadataPanelSavedModel",
                            args: ["{metadata}.model.url", "{dataSource}"]
                        }
                    },
                    listeners: {
                        "{metadata}.events.onReset": "{that}.events.onReset.fire"
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
                        handleModel: {
                            funcName: "demo.metadata.handleModel",
                            args: ["{metadata}", "{that}", "{arguments}.0"]
                        }
                    },
                    listeners: {
                        "onCreate.fetchMarkup": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{simpleEditor}.setContent"]
                        },
                        "onCreate.fetchMetadata": {
                            listener: "{that}.get",
                            args: [{id: "videoMetadata"}, "{that}.handleModel"]
                        },
                        "{metadata}.events.onReset": {
                            listener: "demo.metadata.resetDataSource",
                            args: ["{that}", {id: "markup"}, {id: "videoMetadata"}]
                        }
                    }
                }
            }
        },
        distributeOptions: [{
            source: "{that}.options.videoPanelTemplate",
            target: "{that > metadataPanel}.options.videoPanelTemplate"
        }, {
            source: "{that}.options.audioPanelTemplate",
            target: "{that > metadataPanel}.options.audioPanelTemplate"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            target: "{that > metadataPanel}.options.audioAttributesTemplate"
        }, {
            source: "{that}.options.captionsPanelTemplate",
            target: "{that > metadataPanel}.options.captionsPanelTemplate"
        }, {
            source: "{that}.options.captionsInputTemplate",
            target: "{that > metadataPanel}.options.captionsInputTemplate"
        }]
    });

    demo.metadata.checkUrl = function (that, url) {
        if (!url) {
            return;
        } else if (url.trim() !== "") {
            that.doDestroy();
            that.events.onCreateMetadataPanel.fire();
        }
    };

    demo.metadata.handleModel = function (metadata, that, model) {
        if (!model || !model.url) {
            return;
        }

        that.savedModel = model;
        // Trigger the creation of metadataPanel
        metadata.applier.requestChange("url", model.url);
    };

    demo.metadata.getMetadataPanelSavedModel = function (url, dataSource, setModelFunc) {
        var savedModel = dataSource.savedModel;
        console.log("savedModel: ", savedModel, $.extend(true, {url: url}, savedModel));
        var model = $.extend(true, {url: url}, savedModel);
        return model;
        // setModelFunc($.extend(true, {url: url}, savedModel));
    };

    demo.metadata.resetDataSource = function (dataSource, markupID, videoMetadataID) {
        dataSource.savedModel = null;
        dataSource.delete(markupID);
        dataSource.delete(videoMetadataID);
    };

    demo.metadata.doDestroy = function (that) {
        if (that.metadataPanel) {
            var metadataPanel = that.metadataPanel;
            metadataPanel.audioPanel.container.html("");
            metadataPanel.videoPanel.container.html("");
            metadataPanel.captionsPanel.container.html("");
            metadataPanel.destroy();
        }
    };

    fluid.defaults("fluid.metadata.saveVideoMetadata", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        modelListeners: {
            "": {
                func: "{dataSource}.set",
                args: [{id: "videoMetadata", model: "{that}.model"}]
            }
        }
    });

})(jQuery, fluid);
