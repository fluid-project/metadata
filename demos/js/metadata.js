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
        members: {
            databaseName: {
                expander: {
                    funcName: "demo.metadata.getDbName",
                    args: "{that}.options.defaultDbName"
                }
            }
        },
        defaultDbName: "new",
        selectors: {
            simpleEditor: ".gpiic-metadataDemo-resourceEditor",
            metadataPanel: ".gpiic-metadataDemo-resourceEditor-metadataPanel",
            markupViewer: ".gpiic-metadataDemo-outputHTML",
            preview: ".gpiic-metadataDemo-previewContent"
        },
        events: {
            onReset: null,
            onMarkupFetched: null,
            onMetadataModelFetched: null
        },
        listeners: {
            onMarkupFetched: ["{simpleEditor}.setContent", "{markupViewer}.updateModelMarkup", "{preview}.updateModelMarkup"],
            onMetadataModelFetched: ["{metadataPanel}.setModel", "{markupViewer}.updateModelMetadata", "{preview}.updateModelMetadata"]
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
                        "{metadata}.events.onReset": "{that}.reset"
                    },
                    modelListeners: {
                        "markup": [{
                            listener: "{markupViewer}.updateModelMarkup",
                            args: "{change}.value"
                        }, {
                            listener: "{preview}.updateModelMarkup",
                            args: "{change}.value"
                        }]
                    }
                }
            },
            metadataPanel: {
                type: "fluid.metadata.metadataPanel",
                container: "{that}.dom.metadataPanel",
                options: {
                    gradeNames: ["fluid.prefs.modelRelay", "fluid.metadata.videoMetadataPanel", "fluid.metadata.saveVideoMetadata"],
                    sourceApplier: "{metadata}.applier",
                    rules: {
                        url: "url"
                    },
                    listeners: {
                        "{metadata}.events.onReset": "{that}.events.onReset.fire"
                    },
                    modelListeners: {
                        "*": [{
                            listener: "{markupViewer}.updateModelMetadata",
                            args: "{that}.model"
                        }, {
                            listener: "{preview}.updateModelMetadata",
                            args: "{that}.model"
                        }]
                    }
                }
            },
            tabs: {
                type: "fluid.tabs",
                container: "{that}.container"
            },
            markupViewer: {
                type: "fluid.markupViewer",
                container: "{that}.dom.markupViewer"
            },
            preview: {
                type: "fluid.viewer",
                container: "{that}.dom.preview"
            },
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "{metadata}.databaseName",
                    listeners: {
                        "onCreate.fetchMarkup": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{metadata}.events.onMarkupFetched.fire"]
                        },
                        "onCreate.fetchMetadata": {
                            listener: "{that}.get",
                            args: [{id: "videoMetadata"}, "{metadata}.events.onMetadataModelFetched.fire"]
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

    demo.metadata.getDbName = function (defaultDbName) {
        var lookfor = "name";
        var decodedName = decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(lookfor).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return decodedName ? decodedName : defaultDbName;
    };

    fluid.defaults("fluid.metadata.saveVideoMetadata", {
        gradeNames: ["fluid.modelComponent", "autoInit"],
        modelListeners: {
            "": {
                func: "{dataSource}.set",
                args: [{id: "videoMetadata", model: "{that}.model"}]
            }
        }
    });

})(jQuery, fluid);
