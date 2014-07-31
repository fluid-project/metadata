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

    "use strict";

    fluid.registerNamespace("gpii.metadata.feedback");

    /*
     * Renders match confirmation
     */
    fluid.defaults("gpii.metadata.feedback.mismatchDetails", {
        gradeNames: ["fluid.rendererRelayComponent", "autoInit"],
        selectors: {
            header: ".gpiic-mismatchDetails-header",
            notInteresting: ".gpiic-notInteresting",
            notInterestingLabel: ".gpiic-notInteresting-label",
            skip: ".gpiic-mismatchDetails-skip",
            submit: ".gpiic-mismatchDetails-submit"
        },
        strings: {
            header: "Feedback",
            notInterestingLabel: "Not interesting",
            specify: "Please specify"
        },
        protoTree: {
            header: {messagekey: "header"},
            notInteresting: "${notInteresting}"
            notInterestingLabel: {messagekey: "notInterestingLabel"},
        },
        listeners: {
            "onCreate.fetchResources": {
                listener: "fluid.fetchResources",
                args: ["{that}.options.resources", "{that}.refreshView"]
            }
        },
        resources: {
            template: {
                url: "../html/mismatchDetailsTemplate.html",
                forceCache: true
            }
        }
    });

    /*
     * Attaches match confirmation panel with "bindDialog" component
     */
    fluid.defaults("gpii.metadata.feedback.bindMismatchDetails", {
        gradeNames: ["gpii.metadata.feedback.bindDialog", "autoInit"],
        panelType: "gpii.metadata.feedback.mismatchDetails",
        renderDialogContentOptions: {
            listeners: {
                "afterRender.fireContentReadyEvent": "{bindMismatchDetails}.events.onDialogContentReady"
            }
        }
    });

})(jQuery, fluid);
