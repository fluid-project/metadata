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

    /**
     * "gpii.metadata.feedback.bindDialog" is a view component that accepts a container. Clicking on the container triggers following steps in order:
     *
     * 1. Create a container for the future dialog;
     * 2. Instantiate the subcomponent "renderDialogPanel" to render the dialog content into the container created in step 1;
     *    "renderDialogPanel" is normally provided the integrators via "panelType" and "renderDialogPanel" options at the top level;
     * 3. Once the content of the dialog is ready, turn the container into a jquery dialog;
     * 4. When the dialog is ready, open it and hook up event handlers that would close the dialog when clicking anywhere outside of the dialog.
     *
     * Note: every click on the container triggers re-rendering and re-instantion of the dialog.
     **/

    fluid.registerNamespace("gpii.metadata.feedback");

    fluid.defaults("gpii.metadata.feedback.bindDialog", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            renderDialogPanel: {
                type: "fluid.rendererRelayComponent",
                createOnEvent: "onRenderDialogPanel",
                container: "{bindDialog}.panelContainer",
                options: {
                    gradeNames: ["{that}.options.panelType"],
                    panelType: null,
                    events: {
                        onPanelRendered: "{bindDialog}.events.onDialogPanelReady"
                    },
                    renderOnInit: true,
                    listeners: {
                        "afterRender.fireOnPanelRendered": {
                            listener: "{that}.events.onPanelRendered.fire",
                            priority: "last"
                        }
                    }
                }
            }
        },
        // MUST be supplied by integrators.
        // The unique selector to identify {that}.container, for example, ".gpiic-button".
        // It's used to position the dialog relative to {that}.container, which is the button that triggers the popup of the dialog.
        containerIdentifier: null,
        members: {
            dialog: null,
            panelContainer: null
        },
        styles: {
            activeCss: "gpii-icon-active"
        },
        markup: {
            dialog: '<div class="gpii-hide">&nbsp;</div>'
        },
        commonDialogOptions: {
            closeOnEscape: true,
            autoOpen: false,
            position: {
                my: "center top"
            },
            dialogClass: "gpii-feedback-noClose gpii-feedback-dialog"
        },
        events: {
            onRenderDialogPanel: null,
            onDialogPanelReady: null,
            onDialogReady: null
        },
        listeners: {
            "onCreate.bindButtonClick": {
                "this": "{that}.container",
                method: "click",
                args: "{that}.bindbutton"
            },
            "onDialogPanelReady.instantiateDialog": "{that}.instantiateDialog",
            "onDialogReady.openDialog": {
                "this": "{that}.dialog",
                method: "dialog",
                args: "open"
            },
            "onDialogReady.bindOutsideOfDialogClick": "{that}.bindOutsideOfDialogClick"
        },
        invokers: {
            bindbutton: {
                funcName: "gpii.metadata.feedback.bindbutton",
                args: ["{that}.dialog", "{that}.panelContainer", "{that}.options.markup.dialog", "{that}.events.onRenderDialogPanel.fire", "{that}.container", "{that}"],
                dynamic: true
            },
            instantiateDialog: {
                funcName: "gpii.metadata.feedback.instantiateDialog",
                args: ["{that}.panelContainer", "{that}.container", "{that}.options.commonDialogOptions", "{that}.options.styles.activeCss", "{that}.options.containerIdentifier", "{that}.events.onDialogReady.fire", "{that}"]
            },
            bindOutsideOfDialogClick: {
                funcName: "gpii.metadata.feedback.bindOutsideOfDialogClick",
                args: ["{that}.dialog", "{that}.container"]
            }
        },
        distributeOptions: [{
            source: "{that}.options.panelType",
            removeSource: true,
            target: "{that > renderDialogPanel}.options.panelType"
        }, {
            source: "{that}.options.renderDialogPanel",
            removeSource: true,
            target: "{that > renderDialogPanel}.options"
        }]
    });

    gpii.metadata.feedback.bindbutton = function (dialog, panelContainer, dialogMarkup, fireRenderDialogPanelEvent, buttonDom, that) {
        if (dialog && dialog.dialog("isOpen")) {
            dialog.dialog("close");
        } else {
            // Remove the panel container and dialog created last time
            if (dialog) {
                dialog.dialog("destroy");
            }
            if (panelContainer) {
                panelContainer.remove();
            }

            // The dialog panel is re-rendered at every button click
            that.panelContainer = $(dialogMarkup);
console.log(that.panelContainer);
            fireRenderDialogPanelEvent();
        }
    };

    gpii.metadata.feedback.instantiateDialog = function (panelContainer, buttonDom, commonDialogOptions, activeCss, dialogRelativeTo, fireOnDialogReady, that) {
        var moreOptions = {
            position: {
                of: dialogRelativeTo
            },
            open: function () {
                buttonDom.addClass(activeCss);
            },
            close: function () {
                buttonDom.removeClass(activeCss);
            }
        };

        var dialogOptions = $.extend(true, {}, commonDialogOptions, moreOptions);
        that.dialog = panelContainer.dialog(dialogOptions);

        fireOnDialogReady(that.dialog);

    };

    gpii.metadata.feedback.bindOutsideOfDialogClick = function (dialog, buttonDom) {
        // Unbind the body click event handler that's added previously to
        // re-attach the event handler to work with the re-rendered dialog
        $("body").unbind("click.clickOutsideOfDialog");

        $("body").bind("click.clickOutsideOfDialog", function (e) {
            if (dialog.dialog("isOpen")
                && !$(e.target).is(buttonDom)
                && !$(e.target).is('.ui-dialog, a')
                && !$(e.target).closest('.ui-dialog').length) {
                dialog.dialog("close");
            }
        });
    };

})(jQuery, fluid);
