/*

Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global hljs */

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.markupViewer", {
        gradeNames: ["fluid.viewRelayComponent", "gpii.markup", "autoInit"],
        selectors: {
            code: ".gpiic-metadataDemo-outputHTML-code"
        },
        invokers: {
            render: {
                "funcName": "gpii.markupViewer.render",
                "args": ["{that}.dom.code", {
                    expander: {
                        func: "{that}.generateMarkup"
                    }
                }],
                "dynamic": true
            }
        },
        modelListeners: {
            "*": "{that}.render"
        }
    });

    gpii.markupViewer.render = function (elm, markup) {
        elm.text(markup);
        // TODO: Would switch to Prism.js for syntax highlighting.
        // but currently it causes the first line to indent.
        elm.each(function(i, e) {hljs.highlightBlock(e);});
    };

})(jQuery, fluid);
