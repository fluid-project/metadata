/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

/* global PouchDB */

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.tests");

    jqUnit.asyncTest("Creation", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
            databaseName: dbname
        });

        ds.database.info(function (err, result) {
            jqUnit.assertEquals("The database should have been created",  dbname, result.db_name);
            PouchDB.destroy(dbname);
            jqUnit.start();
        });
    });

    jqUnit.asyncTest("Set: create document", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
            databaseName: dbname
        });

        var doc = {
            id: "test",
            "model": "data"
        };

        ds.set(doc, function () {
            ds.database.get(doc.id).then(function (doc) {
                jqUnit.assertEquals("The document should be created", doc.model, doc.model);
                PouchDB.destroy(dbname);
                jqUnit.start();
            });
        });

    });

    jqUnit.asyncTest("Set: update document", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
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
                    PouchDB.destroy(dbname);
                    jqUnit.start();
                });
            });
        });

    });

    jqUnit.asyncTest("Get", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
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
                PouchDB.destroy(dbname);
                jqUnit.start();
            });
        });

    });

    jqUnit.asyncTest("Delete", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
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
                    PouchDB.destroy(dbname);
                    jqUnit.start();
                });
            });
        });

    });

    jqUnit.asyncTest("afterChange", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
            databaseName: dbname,
            listeners: {
                afterChange: [{
                    listener: "jqUnit.assert",
                    args: ["The afterChange event should have fired."]
                }, "jqUnit.start"]
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

})(jQuery, fluid);
