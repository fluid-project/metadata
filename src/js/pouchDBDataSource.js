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
            },
            createView: {
                funcName: "fluid.pouchdb.dataSource.createView",
                args: ["{that}.database", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"]
            }
        }
    });

    fluid.pouchdb.dataSource.create = function (name) {
        return new PouchDB(name);
    };

    /**
     * In terms of pouchDB semantics this will handle both "get" and "query" methods.
     * To perform a query instead of a straight get, provide the name of a view to the id property
     * and add a query property that contains an object with the necessary query parameters. If the query does
     * not require any parameters, simply provide and empty object.
     */
    fluid.pouchdb.dataSource.get = function (database, directModel, callback) {
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

    fluid.pouchdb.dataSource.setImpl = function (database, doc, callback) {
        database.get(doc._id).then(function (otherDoc) {
            doc._rev = otherDoc._rev;
            database.put(doc).then(callback);
        }, function (error) {
            if (error.status === 404) {
                database.put(doc).then(callback);
            }
        });
    };

    fluid.pouchdb.dataSource.set = function (database, directModel, callback) {
        var newDoc = {
            _id: directModel.id,
            model: directModel.model
        };
        fluid.pouchdb.dataSource.setImpl(database, newDoc, callback);
    };

    fluid.pouchdb.dataSource["delete"] = function (database, directModel, callback) {
        database.get(directModel.id).then(function (doc) {
            database.remove(doc).then(callback);
        });
    };

    fluid.pouchdb.dataSource.createView = function (database, name, map, reduce, callback) {
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

        fluid.pouchdb.dataSource.setImpl(database, designDoc, callback);
    };

})(jQuery, fluid);
