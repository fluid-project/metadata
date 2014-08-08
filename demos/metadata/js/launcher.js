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

    fluid.registerNamespace("demo.metadata");

    fluid.defaults("demo.metadata.setDb", {
        gradeNames: ["gpii.pouchdb.dataSource", "autoInit"],
        content: {
            markup: "",
            metadata: ""
        },
        events: {
            onMarkupEmptied: null,
            onMetadataEmptied: null,

            onSet: null,
            afterSet: {
                events: {
                    "onMarkupEmptied": "onMarkupEmptied",
                    "onMetadataEmptied": "onMetadataEmptied"
                }
            }
        },
        listeners: {
            "onSet": [{
                listener: "{that}.set",
                args: [{id: "markup", model: "{that}.options.content.markup"}, "{that}.events.onMarkupEmptied.fire"]
            }, {
                listener: "{that}.set",
                args: [{id: "videoMetadata", model: "{that}.options.content.metadata"}, "{that}.events.onMetadataEmptied.fire"]
            }]
        },
        invokers: {
            "setAll": "{that}.events.onSet.fire"
        }
    });

    fluid.defaults("demo.metadata.launcher", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        members: {
            url: {
                expander: {
                    funcName: "demo.metadata.launcher.getRedirectURL",
                    args: ["{that}.options.url", "{that}.options.dbName"]
                }
            }
        },
        dbName: "Create_new_resource",
        components: {
            setDB: {
                type: "demo.metadata.setDb",
                createOnEvent: "afterMarkupFetched",
                options: {
                    databaseName: "{launcher}.options.dbName",
                    content: {
                        markup: "{launcher}.options.resources.markup.resourceText",
                        metadata: "{launcher}.options.content.metadata"
                    },
                    listeners: {
                        "afterSet": "{launcher}.events.afterSet",
                        "onAttach": "{launcher}.launch"
                    }
                }
            }
        },
        events: {
            onSet: null,
            afterSet: null,
            onRedirect: null,
            onDbError: null,
            afterMarkupFetched: null
        },
        listeners: {
            "onCreate.fetchResources": {
                listener: "fluid.fetchResources",
                args: ["{that}.options.resources", "{that}.events.afterMarkupFetched.fire"]
            }
        },
        invokers: {
            launch: {
                funcName: "demo.metadata.launcher.launch",
                args: "{that}"
            }
        },
        resources: {
            markup: {
                forceCache: true,
                url: "{that}.options.content.markup"
            }
        }
    });

    demo.metadata.launcher.fetchResources = function (resources, callback) {
        fluid.fetchResources(resources, callback);
    };

    demo.metadata.launcher.launch = function (that) {
        var listenerNamespace = "redirectListener";
        that.events.afterSet.addListener(function (err, response) {
            if (!err) {
                demo.metadata.redirectURL(that.url);
            } else {
                that.events.onDbError.fire(err, response);
            }
            that.events.afterSet.removeListener(listenerNamespace);
        }, listenerNamespace);

        that.setDB.setAll();
    };

    demo.metadata.launcher.getRedirectURL = function (url, dbName) {
        return fluid.stringTemplate(url, {
            dbName: dbName
        });
    };

})(jQuery, fluid);
