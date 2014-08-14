/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.bindDialog");

    gpii.tests.bindDialog.clickButton = function (button) {
        button.click();
    };

    gpii.tests.bindDialog.testDialog = function (that) {
        jqUnit.assertTrue("The dialog is open", that.model.isDialogOpen);
        jqUnit.assertEquals("The aria role is set", "button", that.container.attr("role"));
        jqUnit.assertEquals("The aria label is set", that.options.strings.buttonLabel, that.container.attr("aria-label"));

        // Clicking on the dialog doesn't close itself
        that.dialog.click();
        jqUnit.assertTrue("Cicking on the dialog does not close itself", that.model.isDialogOpen);

        // Clicking outside the dialog closes it
        $("body").click();
        jqUnit.assertFalse("Cicking anywhere outside of the dialog closes the dialog", that.model.isDialogOpen);

        jqUnit.start();
    };

    gpii.tests.bindDialog.verifyStyle = function (state, domElement, css, stateType) {
        if (state) {
            jqUnit.assertTrue("The " + stateType + " css is applied", domElement.hasClass(css));
        } else {
            jqUnit.assertFalse("The " + stateType + " css is applied", domElement.hasClass(css));
        }
    };

    gpii.tests.bindDialog.verifyActiveState = function (isActive, buttonDom, activeCss) {
        gpii.tests.bindDialog.verifyStyle(isActive, buttonDom, activeCss, "active");

        if (isActive) {
            jqUnit.assertEquals("The aria-pressed is set to true", "true", buttonDom.attr("aria-pressed"));
        } else {
            jqUnit.assertEquals("The aria-pressed is set to false", "false", buttonDom.attr("aria-pressed"));
        }
    };

    $(document).ready(function () {
        jqUnit.asyncTest("Test bindDialog", function () {
            jqUnit.expect(15);

            gpii.metadata.feedback.bindDialog(".gpiic-button", {
                renderDialogContentOptions: {
                    listeners: {
                        "onCreate.refreshView": "{that}.refreshView",
                        "afterRender.fireContentReadyEvent": "{bindDialog}.events.onDialogContentReady"
                    }
                },
                listeners: {
                    "onCreate.clickButton": {
                        listener: "gpii.tests.bindDialog.clickButton",
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
                        listener: "gpii.tests.bindDialog.testDialog",
                        args: ["{that}"],
                        priority: "last"
                    }
                },
                modelListeners: {
                    isActive: {
                        listener: "gpii.tests.bindDialog.verifyActiveState",
                        args: ["{change}.value", "{that}.container", "{that}.options.styles.active"],
                        priority: "last"
                    },
                    isDialogOpen: {
                        listener: "gpii.tests.bindDialog.verifyStyle",
                        args: ["{change}.value", "{that}.container", "{that}.options.styles.dialogOpen", "dialogOpen"],
                        priority: "last"
                    }
                }
            });
        });
    });
})(jQuery);
