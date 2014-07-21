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
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            matchConfirmation: {
                type: "gpii.metadata.feedback.bindDialog",
                container: "{feedback}.dom.happyButton",
                createOnEvent: "afterMarkupReady",
                options: {
                    panelType: "gpii.metadata.feedback.matchConfirmation"
                }
            }
        },
        styles: {
            container: "gpii-feedback"
        },
        selectors: {
            happyButton: ".gpiic-happy"
        },
        events: {
            afterTemplateFetched: null,
            afterMarkupReady: null
        },
        listeners: {
            "onCreate.addContainerClass": {
                "this": "{that}.container",
                "method": "addClass",
                "args": "{that}.options.styles.container"
            },
            "onCreate.fetchResources": {
                "funcName": "fluid.fetchResources",
                "args": ["{that}.options.resources", "{that}.events.afterTemplateFetched.fire"]
            },
            "afterTemplateFetched.appendMarkup": {
                "this": "{that}.container",
                "method": "append",
                "args": "{arguments}.0.template.resourceText",
                "priority": "first"
            },
            "afterTemplateFetched.afterMarkupReady": {
                "func": "{that}.events.afterMarkupReady",
                "args": "{that}",
                "priority": "last"
            }
        },
        resources: {
            template: {
                url: "../html/feedbackTemplate.html"
            }
        }
    });

})(jQuery);
