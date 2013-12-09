/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests");

    jqUnit.asyncTest("Creation", function () {
        var dbname = "test";
        var ds = fluid.pouchdb.dataSource({
            databaseName: dbname
        });

        ds.database.info(function (err, result) {
            jqUnit.assertEquals("The database should have been created",  "_pouch_" + dbname, result.db_name);
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

        ds.set(doc, function (err, result) {
            ds.database.get(doc.id, function (err, result) {
                jqUnit.assertEquals("The document should be created", doc.model, result.model);
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
        }, function (err, result) {
            ds.set(doc, function (err, result) {
                ds.database.get(doc.id, function (err, result) {
                    jqUnit.assertEquals("The document should be updated", doc.model, result.model);
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
        }, function (err, result) {
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
        }, function (err, result) {
            ds.delete(doc, function () {
                ds.database.get(doc.id, function (err, result) {
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

})(jQuery);
