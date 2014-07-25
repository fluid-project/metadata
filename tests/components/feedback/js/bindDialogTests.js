/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($) {
    "use strict";

    fluid.registerNamespace("fluid.tests.bindDialog");

    fluid.tests.bindDialog.clickButton = function (button) {
        button.click();
    };

    fluid.tests.bindDialog.testDialog = function (that) {
        var nonDialogArea = $(".gpiic-nonDialog-area");

        that.events.onActiveStateChange.addListener(function (newValue) {
            jqUnit.assertTrue("The button state is set to \"active\"", newValue);
            jqUnit.assertTrue("The aria pressed is set", that.container.attr("aria-pressed"));
            jqUnit.assertTrue("The active css is applied", that.container.hasClass(that.options.styles.activeCss));
            that.events.onActiveStateChange.removeListener("checkState");
        }, "checkState", null, "last");

        jqUnit.assertTrue("The dialog is open", that.dialog.dialog("isOpen"));
        jqUnit.assertEquals("The aria role is set", "button", that.container.attr("role"));
        jqUnit.assertEquals("The aria label is set", that.options.strings.buttonLabel, that.container.attr("aria-label"));

        // Clicking on the dialog doesn't close itself
        that.dialog.click();
        jqUnit.assertTrue("Cicking on the dialog does not close itself", that.dialog.dialog("isOpen"));

        // Clicking outside the dialog closes it
        nonDialogArea.click();
        jqUnit.assertFalse("Cicking anywhere outside of the dialog closes the dialog", that.dialog.dialog("isOpen"));

        jqUnit.start();
    };

    $(document).ready(function () {
        jqUnit.asyncTest("Test bindDialog", function () {
            jqUnit.expect(11);

            gpii.metadata.feedback.bindDialog(".gpiic-button", {
                renderDialogContentOptions: {
                    listeners: {
                        "onCreate.refreshView": "{that}.refreshView",
                        "afterRender.fireContentReadyEvent": "{bindDialog}.events.onDialogContentReady"
                    }
                },
                listeners: {
                    "onCreate.clickButton": {
                        listener: "fluid.tests.bindDialog.clickButton",
                        args: "{that}.container",
                        priority: "last"
                    },
                    "onRenderDialogContent.verifyPanelContainer": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["Initialization - The container for rendering the dialog content should have been created when onRenderDialogContent fires", null, "{that}.panelContainer"]
                    },
                    "onDialogContentReady.verifyRenderedPanel": {
                        listener: "jqUnit.assertNotNull",
                        args: ["Initialization - The subcomponent for rendering dialog content has been instantiated and rendered when onDialogContentReady fires", "{that}.renderDialogPanel"]
                    },
                    "onDialogReady.verifyDialog": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["Initialization - The dialog has been created and attached as a member option when onDialogReady fires", null, "{that}.dialog"]
                    },
                    "onDialogReady.start": {
                        listener: "fluid.tests.bindDialog.testDialog",
                        args: ["{that}"],
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);
