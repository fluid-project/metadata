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

    fluid.defaults("gpii.pouchdb.dataSource", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        databaseName: "",
        events: {
            afterChange: null
        },
        listeners: {
            "onCreate.bindChange": {
                listener: "gpii.pouchdb.dataSource.bindChange",
                args: ["{that}.database", {since: "now"}, "{that}.events.afterChange.fire"]
            }
        },
        members: {
            database: {
                expander: {
                    funcName: "gpii.pouchdb.dataSource.create",
                    args: ["{that}.options.databaseName"]
                }
            }
        },
        invokers: {
            get: {
                funcName: "gpii.pouchdb.dataSource.get",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            },
            set: {
                funcName: "gpii.pouchdb.dataSource.set",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            },
            "delete": {
                funcName: "gpii.pouchdb.dataSource.delete",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1"]
            },
            createView: {
                funcName: "gpii.pouchdb.dataSource.createView",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        }
    });

    gpii.pouchdb.dataSource.create = function (name) {
        return new PouchDB(name);
    };

    /**
     * In terms of pouchDB semantics this will handle both "get" and "query" methods.
     * To perform a query instead of a straight get, provide the name of a view to the id property
     * and add a query property that contains an object with the necessary query parameters. If the query does
     * not require any parameters, simply provide and empty object.
     */
    gpii.pouchdb.dataSource.get = function (database, directModel, callback) {
        var method = "get";
        var prop = "model";
        var opts = {};

        if (directModel.query) {
            method = "query";
            prop = "rows";
            opts = directModel.query;
        }

        database[method](directModel.id, opts).then(function (doc) {
            if (callback) {
                callback(fluid.get(doc, prop));
            }
        });
    };

    gpii.pouchdb.dataSource.postImpl = function (database, doc, callback) {
        database.post(doc).then(callback);
    };

    gpii.pouchdb.dataSource.putImpl = function (database, doc, callback) {
        database.get(doc._id).then(function (otherDoc) {
            doc._rev = otherDoc._rev;
            database.put(doc).then(callback);
        }, function (error) {
            if (error.status === 404) {
                database.put(doc).then(callback);
            }
        });
    };

    gpii.pouchdb.dataSource.set = function (database, directModel, callback) {
        var method = "postImpl";
        var newDoc = {
            model: directModel.model
        };

        if (directModel.id) {
            newDoc._id = directModel.id;
            method = "putImpl";
        }

        gpii.pouchdb.dataSource[method](database, newDoc, callback);
    };

    gpii.pouchdb.dataSource["delete"] = function (database, directModel, callback) {
        database.get(directModel.id).then(function (doc) {
            database.remove(doc).then(callback);
        });
    };

    gpii.pouchdb.dataSource.createView = function (database, name, map, reduce, callback) {
        var designDoc = {
            _id: "_design/" + name,
            views: {}
        };

        designDoc.views[name] = {
            map: map.toString()
        };

        if (reduce) {
            designDoc.views[name].reduce = reduce.toString();
        }

        gpii.pouchdb.dataSource.putImpl(database, designDoc, callback);
    };

    gpii.pouchdb.dataSource.bindChange = function (database, options, callback) {
        database.changes(options).on("complete", callback);
    };

})(jQuery, fluid);
