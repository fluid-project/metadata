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
            simpleEditor: ".gpiic-metadata-resourceEditor",
            metadataPanel: ".gpiic-metadata-resourceEditor-metadataPanel"
        },
        events: {
            onReset: null
        },
        components: {
            simpleEditor: {
                type: "fluid.simpleEditor",
                container: "{that}.dom.simpleEditor",
                options: {
                    model: "{metadata}.model",
                    applier: "{metadata}.applier",
                    listeners: {
                        "{metadata}.events.onReset": "{that}.reset"
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
                        "{metadata}.events.onReset": "{that}.events.onReset.fire",
                        "onCreate": "console.log"
                    }
                }
            },
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "{metadata}.databaseName",
                    listeners: {
                        "onCreate.fetchMarkup": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{simpleEditor}.setContent"]
                        },
                        "onCreate.fetchMetadata": {
                            listener: "{that}.get",
                            args: [{id: "videoMetadata"}, "{metadataPanel}.setModel"]
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
