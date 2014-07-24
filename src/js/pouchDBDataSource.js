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
        database.get(directModel.id, function (err, result) {
            if (callback) {
                callback(fluid.get(result, "model"));
            }
        });
    };

    fluid.pouchdb.dataSource.set = function (database, directModel, callback) {
        database.get(directModel.id, function (err, result) {
            var doc = {
                _id: directModel.id,
                model: directModel.model
            };
            if (!err) {
                doc._rev = result._rev;
            }
            database.put(doc, callback);
        });
    };

    fluid.pouchdb.dataSource["delete"] = function (database, directModel, callback) {
        database.get(directModel.id, function (err, result) {
            if (!err) {
                database.remove(result, callback);
            }
        });
    };

})(jQuery, fluid);
