/*

Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global PouchDB */

(function ($, fluid) {
    "use strict";

    fluid.defaults("fluid.pouchdb.dataSource", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        databaseName: "",
        events: {
            afterChange: null
        },
        listeners: {
            "onCreate.bindChange": {
                "this": "{that}.database",
                "method": "changes",
                "args": [{
                    since: 0,
                    continuous: true,
                    "onChange": "{that}.events.afterChange.fire"
                }]
            }
        },
        members: {
            database: {
                expander: {
                    funcName: "fluid.pouchdb.dataSource.create",
                    args: ["{that}.options.databaseName"]
                }
            }
        },
        invokers: {
            get: {
                funcName: "fluid.pouchdb.dataSource.get",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            },
            set: {
                funcName: "fluid.pouchdb.dataSource.set",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            },
            "delete": {
                funcName: "fluid.pouchdb.dataSource.delete",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            }
        }
    });

    fluid.pouchdb.dataSource.create = function (name) {
        return new PouchDB(name);
    };

    fluid.pouchdb.dataSource.get = function (database, directModel, callback) {
        database.get(directModel.id).then(function (doc) {
            if (callback) {
                callback(fluid.get(doc, "model"));
            }
        });
    };

    fluid.pouchdb.dataSource.set = function (database, directModel, callback) {
        var newDoc = {
            _id: directModel.id,
            model: directModel.model
        };
        database.get(directModel.id).then(function (otherDoc) {
            newDoc._rev = otherDoc._rev;
            database.put(newDoc).then(callback);
        }, function (error) {
            if (error.status === 404) {
                database.put(newDoc).then(callback);
            }
        });
    };

    fluid.pouchdb.dataSource["delete"] = function (database, directModel, callback) {
        database.get(directModel.id).then(function (doc) {
            database.remove(doc).then(callback);
        });
    };

})(jQuery, fluid);
