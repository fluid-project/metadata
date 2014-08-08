/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/* global PouchDB, emit */

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    gpii.tests.cleanUp = function (dbname) {
        PouchDB.destroy(dbname, jqUnit.start);
    };

    jqUnit.asyncTest("Creation", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        ds.database.info(function (err, result) {
            jqUnit.assertEquals("The database should have been created",  dbname, result.db_name);
            gpii.tests.cleanUp (dbname);
        });
    });

    jqUnit.asyncTest("Set: create document - POST", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            "model": "data"
        };

        ds.set(doc, function (createdDoc) {
            ds.database.get(createdDoc.id).then(function (getDoc) {
                jqUnit.assertEquals("The document should be created", doc.model, getDoc.model);
                gpii.tests.cleanUp (dbname);
            });
        });
    });

    jqUnit.asyncTest("Set: create document - PUT", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            id: "test",
            "model": "data"
        };

        ds.set(doc, function () {
            ds.database.get(doc.id).then(function (getDoc) {
                jqUnit.assertEquals("The document should be created", doc.model, getDoc.model);
                gpii.tests.cleanUp (dbname);
            });
        });
    });

    jqUnit.asyncTest("Set: update document", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            id: "test",
            "model": "new"
        };

        ds.database.put({
            _id: doc.id,
            "model": "original"
        }).then(function () {
            ds.set(doc, function () {
                ds.database.get(doc.id).then(function (getDoc) {
                    jqUnit.assertEquals("The document should be updated", doc.model, getDoc.model);
                    gpii.tests.cleanUp (dbname);
                });
            });
        });
    });

    jqUnit.asyncTest("Get", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            id: "test",
            "model": "data"
        };

        ds.database.put({
            _id: doc.id,
            "model": doc.model
        }).then(function () {
            ds.get(doc, function (result) {
                jqUnit.assertEquals("The model should have been returned", doc.model, result);
                gpii.tests.cleanUp (dbname);
            });
        });
    });

    jqUnit.asyncTest("Get: query view", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var view = {
            _id: "_design/nameView",
            views: {
                "nameView": {
                    map: function (doc) {
                        emit(doc.name);
                    }.toString()
                }
            }
        };
        var newDocName = "JavaScript";

        ds.database.put(view).then(function () {
            ds.database.post({name: newDocName});
        }).then(function () {
            ds.get({id: "nameView", query: {}}, function (doc) {
                jqUnit.assertEquals("The correct value should be returned from the query.", newDocName, doc[0].key);
                gpii.tests.cleanUp (dbname);
            });
        });
    });

    jqUnit.asyncTest("Delete", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            id: "test",
            "model": "data"
        };

        ds.database.put({
            _id: doc.id,
            "model": doc.model
        }).then(function () {
            ds["delete"](doc, function () {
                ds.database.get(doc.id)["catch"](function (err) {
                    jqUnit.assertTrue("The document should no longer exist", err);
                    gpii.tests.cleanUp (dbname);
                });
            });
        });
    });

    jqUnit.asyncTest("afterChange event", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname,
            listeners: {
                afterChange: [{
                    listener: "jqUnit.assert",
                    args: ["The afterChange event should have fired."]
                }, {
                    listener: "gpii.tests.cleanUp",
                    args: [dbname],
                    priority: "last"
                }]
            }
        });

        var doc = {
            id: "test",
            "model": "data"
        };

        ds.database.put({
            _id: doc.id,
            "model": doc.model
        });
    });

    jqUnit.asyncTest("createView: view added", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var viewSetup = {
            name: "testView",
            map: function (doc) {
                emit(doc.name, 1);
            },
            reduce: "_count"
        };

        ds.createView(viewSetup.name, viewSetup.map, viewSetup.reduce, function () {
            ds.database.get("_design/" + viewSetup.name).then(function (doc) {
                jqUnit.assertEquals("The map function should be added", viewSetup.map, doc.views[viewSetup.name].map);
                jqUnit.assertEquals("The reduce function should be added", viewSetup.reduce, doc.views[viewSetup.name].reduce);
                gpii.tests.cleanUp (dbname);
            });
        });
    });

    jqUnit.asyncTest("createView: assert view", function () {
        var dbname = "test";
        var ds = gpii.pouchdb.dataSource({
            databaseName: dbname
        });

        var viewSetup = {
            name: "petView",
            map: function (doc) {
                fluid.each(doc.pets, function (names, species) {
                    emit(species, names.length);
                });
            },
            reduce: "_sum"
        };

        var owner = {
            pets: {
                dog: ["Spot", "Fido"],
                cat: ["Fluffy", "Whiskers"],
                bird: ["Polly"]
            }
        };

        ds.createView(viewSetup.name, viewSetup.map, viewSetup.reduce, function () {
            ds.database.post(owner).then(function () {
                ds.get({id: viewSetup.name, query: {reduce: true}}, function (doc) {
                    jqUnit.assertEquals("Total number of pets should be calculated.", 5, doc[0].value);
                    gpii.tests.cleanUp (dbname);
                });
            });
        });
    });

})(jQuery, fluid);
