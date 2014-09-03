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

    fluid.registerNamespace("gpii.metadata.feedback");

    /*
     * Renders match confirmation
     */
    fluid.defaults("gpii.metadata.feedback.matchConfirmation", {
        gradeNames: ["gpii.metadata.feedback.baseDialogContent", "autoInit"],
        selectors: {
            content: ".gpiic-matchConfirmation-content",
            header: ".gpiic-matchConfirmation-header"
        },
        strings: {
            header: "Thanks!",
            content: "You will be matched with similar resources."
        },
        protoTree: {
            content: {messagekey: "content"},
            header: {messagekey: "header"}
        }
    });

    /*
     * Attaches match confirmation panel with "bindDialog" component
     */
    fluid.defaults("gpii.metadata.feedback.bindMatchConfirmation", {
        gradeNames: ["gpii.metadata.feedback.bindDialog", "autoInit"],
        panelType: "gpii.metadata.feedback.matchConfirmation",
        renderDialogContentOptions: {
            listeners: {
                "afterRender.fireContentReadyEvent": "{bindMatchConfirmation}.events.onDialogContentReady"
            }
        }
    });

})(jQuery, fluid);
