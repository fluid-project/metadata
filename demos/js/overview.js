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

var demo = demo || {};

(function ($, fluid) {

    $(document).ready(function () {
        fluid.overviewPanel(".gpiic-overviewPanel", {
            resources: {
                template: {
                    href: "../../src/lib/infusion/components/overviewPanel/html/overviewPanelTemplate.html"
                }
            },
            strings: {
                "componentName": "FLOE Metadata Authoring",
                "feedbackText": "Found a bug? Have a question?",
                "feedbackLinkText": "Let us know!"
            },
            markup: {
                "description": "This component allows content authors to create or edit metadata that accompanies the content of their OER.",
                "instructions": "First choose whether to <em>edit</em> \"Climate Change Impacts\" or start a new resource. The screen will change and there will \
                                 be a text editor.\
                                 \
                                 <ul>\
                                    <li>If starting a new resource, <em>insert a video</em> by typing text in the web address field.</li>\
                                    <li>A panel named <em>\"Video Details\"</em> will appear - add as much detail as needed.</li>\
                                    <li>Select <em>\"Preview Content\"</em> to see an example of how the end user would see the content.</li>\
                                    <li>Select <em>\"View Output HTML\"</em> to see the HTML mark-up with included metadata.</li>\
                                </ul>\
                                Note\: If editing \"Climate Change Impacts\", there will already be a video and its address can not be changed."
                                
            },
            links: {
                "codeLink": "http://github.com/fluid-project/metadata/",
                "apiLink": "http://github.com/fluid-project/metadata/",
                "designLink": "http://wiki.fluidproject.org/display/fluid/FLOE+Metadata+Authoring+Design",
                "feedbackLink": "mailto:infusion-users@fluidproject.org?subject=FLOE Metadata Authoring feedback"
            }
        });
    });

})(jQuery, fluid);
