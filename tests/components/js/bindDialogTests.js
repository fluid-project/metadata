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

    $(document).ready(function () {
        jqUnit.asyncTest("Initial settings", function () {
            jqUnit.expect(3);
            var containerSelector = ".gpiic-button";

            gpii.metadata.feedback.bindDialog(containerSelector, {
                containerIdentifier: containerSelector,
                listeners: {
                    "onCreate.debug": {
                        listener: "console.log",
                        args: "{that}.container",
                    },
                    "onCreate.clickButton": {
                        listener: "fluid.tests.bindDialog.clickButton",
                        args: "{that}.container"
                    },
                    "onRenderDialogPanel.verifyPanelContainer": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["The container for rendering the dialog content should have been created", null, "{that}.panelContainer"]
                    },
                    "onDialogPanelReady.verifyRenderedPanel": {
                        listener: "jqUnit.assertNotNull",
                        args: ["The subcomponent for rendering dialog content has been instantiated and rendered", "{that}.renderDialogPanel"]
                    },
                    "onDialogReady.verifyDialog": {
                        listener: "jqUnit.assertNotEquals",
                        args: ["The dialog has been created and attached as a member option", null, "{that}.dialog"]
                    },
                    "onReady.start": {
                        listener: "jqUnit.start"
                    }
                }
            });
        });
    });
})(jQuery);
