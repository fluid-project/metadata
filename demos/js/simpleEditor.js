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

    fluid.registerNamespace("fluid.simpleEditor");

    fluid.simpleEditor.command = function (event) {
        var elm = $(event.target);
        document.execCommand(elm.data("control"), false, null);
        event.preventDefault();
    };

    fluid.defaults("fluid.simpleEditor", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            controls: ".flc-simpleEditor-control",
            content: ".flc-simpleEditor-content"
        },
        listeners: {
            "onCreate.makeEditable": {
                "this": "{that}.dom.content",
                "method": "attr",
                "args": [{contentEditable: true}]
            },
            "onCreate.bindControls": {
                "this": "{that}.dom.controls",
                "method": "click",
                "args": [fluid.simpleEditor.command]
            }
        }
    });

})(jQuery, fluid);
