/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests.bindDialog");

    fluid.tests.bindDialog.clickButton = function (button) {
        button.click();
    };

    fluid.tests.bindDialog.testDialog = function (that, nonDialogArea) {
        jqUnit.assertTrue("The dialog is open", that.dialog.dialog("isOpen"));
        that.dialog.click();
        jqUnit.assertTrue("Cicking on the dialog does not close itself", that.dialog.dialog("isOpen"));
        nonDialogArea.click();
        jqUnit.assertFalse("Cicking anywhere outside of the dialog closes the dialog", that.dialog.dialog("isOpen"));
        jqUnit.start();
    }

    $(document).ready(function () {
        jqUnit.asyncTest("Test bindDialog", function () {
            jqUnit.expect(6);
            var containerSelector = ".gpiic-button";
            var nonDialogArea = $(".gpiic-nonDialog-area");

            gpii.metadata.feedback.bindDialog(containerSelector, {
                listeners: {
                    "onCreate.clickButton": {
                        listener: "fluid.tests.bindDialog.clickButton",
                        args: "{that}.container",
                        priority: "last"
                    },
                    "onRenderDialogPanel.verifyPanelContainer": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["Initialization - The container for rendering the dialog content should have been created when onRenderDialogPanel fires", null, "{that}.panelContainer"]
                    },
                    "onDialogPanelReady.verifyRenderedPanel": {
                        listener: "jqUnit.assertNotNull",
                        args: ["Initialization - The subcomponent for rendering dialog content has been instantiated and rendered when onDialogPanelReady fires", "{that}.renderDialogPanel"]
                    },
                    "onDialogReady.verifyDialog": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["Initialization - The dialog has been created and attached as a member option when onDialogReady fires", null, "{that}.dialog"]
                    },
                    "onReady.start": {
                        listener: "fluid.tests.bindDialog.testDialog",
                        args: ["{that}", nonDialogArea]
                    }
                }
            });
        });
    });
})(jQuery);
