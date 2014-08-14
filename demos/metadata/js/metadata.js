/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var demo = demo || {};

(function ($, fluid) {
    "use strict";

    fluid.defaults("demo.metadata", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        members: {
            databaseName: {
                expander: {
                    funcName: "demo.metadata.getDbName",
                    args: "{that}.options.defaultDbName"
                }
            },
            disableVideoInput: {
                expander: {
                    funcName: "demo.metadata.disallowVideoInput",
                    args: ["{that}.databaseName", "{that}.options.defaultDbName"]
                }
            },
            metadataPanelModel: null
        },
        defaultDbName: "Create_new_resource",
        disableVideoInput: "{that}.disableVideoInput",
        expandCss: "gpii-metadataDemo-expand",
        selectors: {
            demoBody: ".gpiic-metadataDemo-body",
            title: ".gpiic-metadataDemo-title",
            simpleEditor: ".gpiic-metadataDemo-resourceEditor",
            metadataPanel: ".gpiic-metadataDemo-resourceEditor-metadataPanel",
            markupViewer: ".gpiic-metadataDemo-outputHTML",
            preview: ".gpiic-metadataDemo-previewContent",
            restart: ".gpiic-metadataDemo-restart"
        },
        strings: {
            title: {
                expander: {
                    funcName: "demo.metadata.getTitle",
                    args: "{that}.databaseName"
                }
            }
        },
        events: {
            onReset: null,
            onCreateMetadataPanel: null,
            onMarkupFetched: null,
            onMetadataModelFetched: null,
            afterVideoInserted: null
        },
        listeners: {
            onMarkupFetched: ["{simpleEditor}.setContent", "{markupViewer}.updateModelMarkup", "{preview}.updateModelMarkup"],
            onMetadataModelFetched: ["{markupViewer}.updateModelMetadata", "{preview}.updateModelMetadata", "{that}.updateMetadataPanel",
            {
                listener: "{simpleEditor}.applier.change",
                args: ["url", "{arguments}.0.url"]
            }],
            "onCreate.setTitle": {
                "this": "{that}.dom.title",
                "method": "text",
                "args": "{that}.options.strings.title"
            },
            "onCreate.bindRestart": {
                "this": "{that}.dom.restart",
                "method": "click",
                "args": "{that}.events.onReset.fire"
            },
            "onMarkupFetched.setDemoBodyCss": {
                listener: "demo.metadata.setDemoBodyCss",
                args: ["{that}.dom.demoBody", "{that}.options.expandCss", "{that}.databaseName", "{that}.options.defaultDbName", "{arguments}.0"]
            },
            "afterVideoInserted.expandDemoBody": {
                "this": "{that}.dom.demoBody",
                "method": "addClass",
                "args": "{that}.options.expandCss"
            },
            "onReset.resetCookie": {
                listener: "{cookieStore}.resetCookie"
            },
            "onReset.destroyMetadataPanel": "{that}.doDestroy"
        },
        invokers: {
            "doDestroy": {
                funcName: "demo.metadata.doDestroy",
                args: "{that}"
            },
            "updateMetadataPanel": {
                funcName: "demo.metadata.updateMetadataPanel",
                args: ["{that}", "{arguments}.0"]
            }
        },
        components: {
            simpleEditor: {
                type: "gpii.simpleEditor",
                container: "{that}.dom.simpleEditor",
                options: {
                    modelListeners: {
                        "markup": [{
                            listener: "{markupViewer}.updateModelMarkup",
                            args: "{change}.value"
                        }, {
                            listener: "{preview}.updateModelMarkup",
                            args: "{change}.value"
                        }],
                        "url": {
                            listener: "{metadata}.updateMetadataPanel",
                            args: "{change}.value"
                        }
                    },
                    listeners: {
                        "afterVideoInserted.escalateEvent": "{metadata}.events.afterVideoInserted"
                    }
                }
            },
            metadataPanel: {
                type: "gpii.metadata.videoMetadataPanel",
                container: "{that}.dom.metadataPanel",
                createOnEvent: "onCreateMetadataPanel",
                options: {
                    gradeNames: ["gpii.metadata.saveVideoMetadata"],
                    inputModel: "{metadata}.metadataPanelModel",
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
                type: "gpii.markupViewer",
                container: "{that}.dom.markupViewer"
            },
            preview: {
                type: "gpii.viewer",
                container: "{that}.dom.preview"
            },
            cookieStore: {
                type: "demo.metadata.cookieStore"
            },
            launcher: {
                type: "demo.metadata.launcher",
                createOnEvent: "onReset",
                options: {
                    dbName: "{metadata}.databaseName",
                    url: "index.html"
                }
            },
            dataSource: {
                type: "gpii.pouchdb.dataSource",
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
        }, {
            source: "{that}.options.disableVideoInput",
            target: "{that insertVideo}.options.disableVideoInput"
        }]
    });

    // Create the metadataPanel if it hasn't been. Otherwise, update the metadataPanel model
    demo.metadata.updateMetadataPanel = function (that, metadataModel) {
        // The argument "metadataModel" could be in two forms:
        // 1. an object containing the entire metadata model including URL. This is triggered by the initial fetch from the database;
        // 2. a url string. This is triggered by the url change from the simple editor.
        var url = fluid.isPrimitive(metadataModel) ? metadataModel : metadataModel.url;
        var metadataPanelModel = fluid.isPrimitive(metadataModel) ? {"url": url} : metadataModel;

        if (that.metadataPanel) {
            that.metadataPanel.applier.change("url", url);
        } else if (url && url.trim() !== "") {
            that.doDestroy();
            that.metadataPanelModel = metadataPanelModel;
            that.events.onCreateMetadataPanel.fire();
        }
    };

    demo.metadata.doDestroy = function (that) {
        var metadataPanel = that.metadataPanel;
        if (metadataPanel) {
            metadataPanel.audioPanel.container.html("");
            metadataPanel.videoPanel.container.html("");
            metadataPanel.captionsPanel.container.html("");
            metadataPanel.destroy();
        }
    };
    demo.metadata.getDbName = function (defaultDbName) {
        var lookfor = "name";
        var decodedName = decodeURI(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI(lookfor).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
        return decodedName ? decodedName : defaultDbName;
    };

    demo.metadata.disallowVideoInput = function (databaseName, defaultDbName) {
        return (databaseName !== defaultDbName);
    };

    demo.metadata.setDemoBodyCss = function (bodyElm, expandCss, databaseName, defaultDbName, markup) {
        markup = $(markup);
        var videoPlaceHolders = markup.siblings("#videoPlaceHolder");
        if (databaseName === defaultDbName && videoPlaceHolders.length === 0) {
            bodyElm.removeClass(expandCss);
        }
    };

    demo.metadata.getTitle = function (databaseName) {
        return databaseName.replace(/_/g, " ");
    };

    fluid.defaults("gpii.metadata.saveVideoMetadata", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        modelListeners: {
            "": {
                func: "{dataSource}.set",
                args: [{id: "videoMetadata", model: "{that}.model"}]
            }
        }
    });

})(jQuery, fluid);
