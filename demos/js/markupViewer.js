/*

Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.defaults("fluid.markupViewer", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        invokers: {
            update: {
                funcName: "fluid.markupViewer.update",
                args: ["{that}.container", "{arguments}.0"]
            }
        },
        components: {
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "simpleEditor",
                    listeners: {
                        "onCreate.fetch": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{markupViewer}.update"]
                        }
                    }
                }
            }
        }
    });

    fluid.markupViewer.update = function (elm, content) {
        elm.text(content);
    };

})(jQuery, fluid);
