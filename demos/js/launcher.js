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

    fluid.registerNamespace("demo.metadata");

    fluid.defaults("demo.metadata.setDb", {
        gradeNames: ["fluid.pouchdb.dataSource", "autoInit"],
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

    demo.metadata.redirectURL = function (url) {
        window.location = url;
    };

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
        dbName: "new",
        components: {
            setDB: {
                type: "demo.metadata.setDb",
                options: {
                    databaseName: "{launcher}.options.dbName",
                    content: "{launcher}.options.content",
                    listeners: {
                        "afterSet": "{launcher}.events.afterSet"
                    }
                }
            }
        },
        events: {
            onSet: null,
            afterSet: null,
            onRedirect: null,
            onDbError: null
        },
        invokers: {
            launch: {
                funcName: "demo.metadata.launcher.launch",
                args: "{that}"
            }
        }
    });

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
