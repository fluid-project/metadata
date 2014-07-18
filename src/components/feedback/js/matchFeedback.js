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

(function ($, fluid) {

    fluid.registerNamespace("gpii.metadata.feedback");

    fluid.defaults("gpii.metadata.feedback.matchFeedback", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        strings: {
            content: "Thanks! You will be matched with similar resources."
        },
        listeners: {
            "onCreate.addContent": {
                "this": "{that}.container",
                method: "text",
                args: "{that}.options.strings.content"
            }
        }
    });

})(jQuery, fluid);
