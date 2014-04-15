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
                "instructions": "First choose whether to edit the existing resource or start a new one. The screen will change and there will be a text editor.<ul><li>Insert a video by typing some text in the web address field.</li><li>Select \"Preview\" to see an example of how the end user would see the content.</li><li>Select \"View Output HTML\" to see the HTML mark-up with included metadata.</li></ul>"
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
