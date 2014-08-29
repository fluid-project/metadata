/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var demo = demo || {};

(function ($, fluid) {
    "use strict";

    $(document).ready(function () {

        // User Interface Options
        fluid.uiOptions.prefsEditor(".flc-prefsEditor-separatedPanel", {
            tocTemplate: "../../src/lib/infusion/src/components/tableOfContents/html/TableOfContents.html",
            templatePrefix: "../../src/lib/infusion/src/framework/preferences/html/",
            messagePrefix: "../../src/lib/infusion/src/framework/preferences/messages/",
            components: {
                prefsEditorLoader: {
                    options: {
                        iframeRenderer: {
                            markupProps: {
                                src: "html/SeparatedPanelPrefsEditorFrame.html"
                            }
                        }
                    }
                }
            }
        });

        // Overview Panel
        fluid.overviewPanel(".flc-overviewPanel", {
            resources: {
                template: {
                    href: "../../src/lib/infusion/src/components/overviewPanel/html/overviewPanelTemplate.html"
                }
            },
            strings: {
                titleBegin: "A",
                titleLinkText: "Metadata",
                componentName: "FLOE Metadata Feedback Tool",
                infusionCodeLinkText: "get Metadata",
                feedbackText: "Found a bug? Have a question?",
                feedbackLinkText: "Let us know!"
            },
            markup: {
                description: "The FLOE metadata feedback tool can be integrated into existing sites to allow users to provide feedback about how a resource matched their preferences and to request alternatives or modifications to improve it. For the purposes of this demo, the feedback tool is shown within a simple OER.",
                instructions: "<p>The feedback tool is located along the top of the page</p><ul><li>Use the <span class='gpii-icon gpii-icon-matchConfirmation'></span> to confirm that the resource matches your preferences.</li><li>Use the <span class='gpii-icon gpii-icon-mismatchDetails'></span> to indicated that the resource does not match your preferences and indicate the issue you are encountering.</li><li>Use the <span class='gpii-icon gpii-icon-request'></span> to view the set of requests made against the resource and to vote for the requests that you are also interested in.</li></ul>"
            },
            links: {
                "titleLink": "http://wiki.fluidproject.org/display/fluid/%28Floe%29+Metadata+Authoring+and+Feedback+Tools",
                "demoCodeLink": "https://github.com/fluid-project/metadata/tree/master/demos/feedback",
                "infusionCodeLink": "https://github.com/fluid-project/metadata",
                "apiLink": "http://wiki.fluidproject.org/display/fluid/Metadata+Feedback+Tool+API",
                "designLink": "http://wiki.fluidproject.org/display/fluid/Metadata+Feedback+Tool+Design",
                "feedbackLink": "mailto:infusion-users@fluidproject.org?subject=FLOE Metadata Feedback Tool feedback"
            }
        });

        // Feedback Tool
        gpii.metadata.feedbackLoader(".gpiic-feedback", {
            templatePrefix: "../../src/components/feedback/html/"
        });
    });

})(jQuery, fluid);
