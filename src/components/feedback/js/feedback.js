/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {

    fluid.registerNamespace("gpii.metadata");

    fluid.defaults("gpii.metadata.feedback", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        styles: {
            container: "gpii-feedback"
        },
        events: {
            templateFetched: null,
            markupReady: null
        },
        listeners: {
            "onCreate.addContainerClass": {
                "this": "{that}.container",
                "method": "addClass",
                "args": "{that}.options.styles.container"
            },
            "onCreate.fetchResources": {
                "funcName": "fluid.fetchResources",
                "args": ["{that}.options.resources", "{that}.events.templateFetched.fire"]
            },
            "templateFetched.appendMarkup": {
                "this": "{that}.container",
                "method": "append",
                "args": "{arguments}.0.template.resourceText"
            }
        },
        resources: {
            template: {
                url: "../html/feedbackTemplate.html"
            }
        }
    });

})(jQuery);
