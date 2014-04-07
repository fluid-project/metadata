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

    fluid.defaults("demo.metadata.resetDb", {
        gradeNames: ["fluid.pouchdb.dataSource", "autoInit"],
        content: {
            markup: "",
            metadata: ""
        },
        events: {
            onMarkupEmptied: null,
            onMetadataEmptied: null,

            onReset: null,
            afterReset: {
                events: {
                    "onMarkupEmptied": "onMarkupEmptied",
                    "onMetadataEmptied": "onMetadataEmptied"
                }
            }
        },
        listeners: {
            "onReset": [{
                listener: "{that}.set",
                args: [{id: "markup", model: "{that}.options.content.markup"}, "{that}.events.onMarkupEmptied.fire"]
            }, {
                listener: "{that}.set",
                args: [{id: "videoMetadata", model: "{that}.options.content.metadata"}, "{that}.events.onMetadataEmptied.fire"]
            }]
        },
        invokers: {
            "reset": "{that}.events.onReset.fire"
        }
    });

    demo.metadata.redirectURL = function (url) {
        window.location = url;
    };

    fluid.defaults("demo.metadata.redirect", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        members: {
            redirectURL: {
                expander: {
                    funcName: "demo.metadata.redirect.getRedirectURL",
                    args: ["{that}.options.redirectURL", "{that}.options.dbName"]
                }
            }
        },
        dbName: "new",
        components: {
            resetDB: {
                type: "demo.metadata.resetDb",
                options: {
                    databaseName: "{redirect}.options.dbName",
                    content: "{redirect}.options.content",
                    listeners: {
                        "afterReset": "{redirect}.events.afterReset"
                    }
                }
            }
        },
        events: {
            onReset: null,
            afterReset: null,
            onRedirect: null,
            onDbError: null
        },
        invokers: {
            redirect: {
                funcName: "demo.metadata.redirect.redirect",
                args: "{that}"
            }
        }
    });

    demo.metadata.redirect.redirect = function (that) {
        that.events.afterReset.addListener(function (err, response) {
            if (!err) {
                demo.metadata.redirectURL(that.redirectURL);
            } else {
                that.events.onDbError.fire(err, response);
                console.log(response);
            }
            that.events.afterReset.removeListener("redirectListener");
        }, "redirectListener");

        that.resetDB.reset();
    };

    demo.metadata.redirect.getRedirectURL = function (redirectURL, dbName) {
        return fluid.stringTemplate(redirectURL, {
            dbName: dbName
        });
    };

})(jQuery, fluid);
