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

    fluid.registerNamespace("demo.metadata");

    fluid.defaults("demo.metadata.overview", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        components: {
            overviewPanel: {
                type: "fluid.overviewPanel",
                container: "{overview}.container",
                options: {
                    modelListeners: {
                        "": {
                            listener: "{cookieStore}.set",
                            args: ["{change}.value"]
                        }
                    },
                    model: {
                        showPanel: {
                            expander: {
                                funcName: "fluid.get",
                                args: [{
                                    expander: {
                                        funcName: "{cookieStore}.get"
                                    }
                                }, "showPanel"]
                            }
                        }
                    }
                }
            },
            cookieStore: {
                type: "demo.metadata.cookieStore"
            }
        },
        distributeOptions: [{
            source: "{that}.options.overviewPanelTemplate",
            removeSource: true,
            target: "{that > overviewPanel}.options.resources.template.href"
        }, {
            source: "{that}.options.strings",
            removeSource: true,
            target: "{that > overviewPanel}.options.strings"
        }, {
            source: "{that}.options.markup",
            removeSource: true,
            target: "{that > overviewPanel}.options.markup"
        }, {
            source: "{that}.options.links",
            removeSource: true,
            target: "{that > overviewPanel}.options.links"
        }]
    });

    $(document).ready(function () {
        demo.metadata.overview(".gpiic-overviewPanel", {
            overviewPanelTemplate: "../../src/lib/infusion/src/components/overviewPanel/html/overviewPanelTemplate.html",
            strings: {
                "titleBegin": "A",
                "titleLinkText": "Metadata",
                "componentName": "FLOE Metadata Authoring",
                "infusionCodeLinkText": "get Metadata",
                "feedbackText": "Found a bug? Have a question?",
                "feedbackLinkText": "Let us know!"
            },
            markup: {
                "description": "The FLOE metadata authoring components can be integrated into existing content editors to allow authors to create or edit " +
                                "metadata that accompanies the content of their Open Education Resource (OER).  For the purposes of this demo, the metadata " +
                                "components are shown within a simple content editor.",
                "instructions": "<p>First choose whether to edit \"Climate Change Impacts\" or \"Create New Resource\". This will open a text editor.</p>" +
                                 "<p>If creating a new resource, <em>insert a video</em> by typing text in the web address field.</p>" +
                                 "<p><em>Note:</em> If editing \"Climate Change Impacts\", there will already be a video in the editor window and its address cannot be changed.</p>" +
                                 "<ul>" +
                                 "   <li>A panel named <em>\"Video Details\"</em> will appear - add as much detail as possible.</li>" +
                                 "   <li>Select <em>\"Preview Content\"</em> to see an example of how the end user would see the content.</li>" +
                                 "   <li>Select <em>\"View Output HTML\"</em> to see the HTML mark-up with metadata included.</li>" +
                                 "</ul>"

            },
            links: {
                "titleLink": "http://wiki.fluidproject.org/display/fluid/%28Floe%29+Metadata+Authoring+and+Feedback+Tools",
                "demoCodeLink": "https://github.com/fluid-project/metadata/tree/master/demos/metadata",
                "infusionCodeLink": "https://github.com/fluid-project/metadata",
                "apiLink": "http://wiki.fluidproject.org/display/fluid/Metadata+API",
                "designLink": "http://wiki.fluidproject.org/display/fluid/FLOE+Metadata+Authoring+Design",
                "feedbackLink": "mailto:infusion-users@fluidproject.org?subject=FLOE Metadata Authoring feedback"
            }
        });
    });

})(jQuery, fluid);
