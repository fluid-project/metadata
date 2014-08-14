/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.metadata");

    fluid.defaults("gpii.metadata.feedback", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            bindMatchConfirmation: {
                type: "gpii.metadata.feedback.bindMatchConfirmation",
                container: "{feedback}.dom.matchConfirmationButton",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: {
                        buttonLabel: "{feedback}.options.strings.matchConfirmationLabel"
                    },
                    styles: {
                        activeCss: "{feedback}.options.styles.activeCss"
                    }
                }
            },
            bindMismatchDetails: {
                type: "gpii.metadata.feedback.bindMismatchDetails",
                container: "{feedback}.dom.mismatchDetailsButton",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: {
                        buttonLabel: "{feedback}.options.strings.mismatchDetailsLabel"
                    },
                    styles: {
                        activeCss: "{feedback}.options.styles.activeCss"
                    }
                }
            }
        },
        strings: {
            matchConfirmationLabel: "I like this article, match me with similar content.",
            mismatchDetailsLabel: "I don't like this article, request improvements.",
            requestLabel: "Request improvements to the content."
        },
        styles: {
            container: "gpii-feedback",
            activeCss: "gpii-icon-active"
        },
        selectors: {
            matchConfirmationButton: ".gpiic-matchConfirmation-button",
            mismatchDetailsButton: ".gpiic-mismatchDetails-button"
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
        },
        distributeOptions: [{
            source: "{that}.options.matchConfirmationTemplate",
            remove: true,
            target: "{that matchConfirmation}.options.resources.template.url"
        }, {
            source: "{that}.options.mismatchDetailsTemplate",
            remove: true,
            target: "{that mismatchDetails}.options.resources.template.url"
        }]
    });

})(jQuery, fluid);
