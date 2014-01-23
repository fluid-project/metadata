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

    fluid.defaults("fluid.metadata", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            simpleEditor: ".flc-simpleEditor",
            metadataPanel: ".flc-metadataPanelContainer"
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
                        "{metadata}.events.onReset": "{that}.reset",
                    }
                }
            },
            metadataPanel: {
                type: "fluid.metadata.metadataPanel",
                container: "{that}.dom.metadataPanel",
                options: {
                    gradeNames: ["fluid.prefs.modelRelay"],
                    sourceApplier: "{metadata}.applier",
                    rules: {
                        url: "url"
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
            target: "{that > metadataPanel > videoPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.audioPanelTemplate",
            target: "{that > metadataPanel > audioPanel}.options.audioTemplate"
        }, {
            source: "{that}.options.audioAttributesTemplate",
            target: "{that > metadataPanel > audioPanel}.options.audioAttributesTemplate"
        }, {
            source: "{that}.options.captionsPanelTemplate",
            target: "{that > metadataPanel > captionsPanel}.options.resources.template.url"
        }, {
            source: "{that}.options.captionsInputTemplate",
            target: "{that > metadataPanel > captionsPanel}.options.captionsInputTemplate"
        }]
    });

})(jQuery, fluid);
