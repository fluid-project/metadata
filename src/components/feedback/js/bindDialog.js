/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var gpii = gpii || {};

(function ($, fluid) {

    /**
     * "gpii.metadata.feedback.bindDialog" is a view component that accepts a "button" container. The click on the container triggers following steps:
     *
     * 1. Close the dialog if the dialog exists and opens. Or, create a container for the dialog and fire onRenderDialogContent when the container is ready;
     * 2. Instantiate the subcomponent "renderDialogContent" to render the dialog content into the container created in step 1;
     *    Note: The actual component for "renderDialogContent" MUST be provided by integrators via "panelType" and "renderDialogContent" options
     *    at the top level of {bindDialog}. Also fire {bindDialog}.events.onDialogContentReady event when the content is rendered.
     * 3. Once the content is ready, the container is instantiated into a jQuery dialog;
     * 4. When the dialog is ready, i) open it; ii) hook up event handlers that would close the dialog when clicking anywhere outside of the dialog.
     *
     * Note: every click on the container triggers re-rendering of the dialog content using onRenderDialogContent event.
     **/

    "use strict";

    fluid.registerNamespace("gpii.metadata.feedback");

    fluid.defaults("gpii.metadata.feedback.bindDialog", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            renderDialogContent: {
                type: "fluid.rendererRelayComponent",
                createOnEvent: "onRenderDialogContent",
                container: "{bindDialog}.dialogContainer",
                options: {
                    gradeNames: ["{that}.options.panelType"]
                }
            }
        },
        members: {
            dialog: null,
            dialogContainer: null,
            isActive: false    // Keep track of the active state of the button
        },
        strings: {
            buttonLabel: null
        },
        styles: {
            activeCss: "gpii-icon-active",
            arrowCss: "gpii-icon-arrow"
        },
        markup: {
            dialog: "<section>&nbsp;</section>"
        },
        commonDialogOptions: {
            closeOnEscape: true,
            autoOpen: false,
            minHeight: 0,
            resizable: false,
            width: 450,
            position: {
                my: "center top",
                at: "center-10% bottom+42%",
                of: "{that}.container"
            },
            dialogClass: "gpii-feedback-noClose gpii-feedback-dialog",
            open: "{that}.events.onDialogOpen.fire",
            close: "{that}.events.onDialogClose.fire"
        },
        events: {
            onActiveStateChange: null,   // The argument for this event is a boolean value indicating whether the button is active.
            onRenderDialogContent: null,
            onDialogContentReady: null,
            onBindDialogHandlers: null,
            onDialogReady: null,
            onDialogOpen: null,
            onDialogClose: null
        },
        listeners: {
            "onCreate.addAriaRole": {
                "this": "{that}.container",
                method: "attr",
                args: ["role", "button"]
            },
            "onCreate.addAriaLabel": {
                "this": "{that}.container",
                method: "attr",
                args: ["aria-label", "{that}.options.strings.buttonLabel"]
            },
            "onCreate.bindButtonClick": {
                "this": "{that}.container",
                method: "click",
                args: "{that}.bindbutton"
            },
            "onDialogContentReady.instantiateDialog": "{that}.instantiateDialog",
            "onBindDialogHandlers.bindOutsideOfDialogClick": "{that}.bindOutsideOfDialogClick",
            "onDialogReady.openDialog": {
                "this": "{that}.dialog",
                method: "dialog",
                args: "open"
            },
            "onActiveStateChange.setActiveProps": "{that}.setActiveProps",
            "onDialogOpen.applyArrowCss": {
                "this": "{that}.container",
                method: "addClass",
                args: "{that}.options.styles.arrowCss"
            },
            "onDialogClose.removeArrowCss": {
                "this": "{that}.container",
                method: "removeClass",
                args: "{that}.options.styles.arrowCss"
            }
        },
        invokers: {
            bindbutton: {
                funcName: "gpii.metadata.feedback.bindbutton",
                args: ["{arguments}.0", "{that}"]
            },
            instantiateDialog: {
                funcName: "gpii.metadata.feedback.instantiateDialog",
                args: ["{that}"]
            },
            bindOutsideOfDialogClick: {
                funcName: "gpii.metadata.feedback.bindOutsideOfDialogClick",
                args: ["{that}.dialog", "{that}.container"]
            },
            setActiveProps: {
                funcName: "gpii.metadata.feedback.setActiveProps",
                args: ["{arguments}.0", "{that}.container", "{that}.options.styles.activeCss"]
            }
        },
        distributeOptions: [{
            source: "{that}.options.panelType",
            removeSource: true,
            target: "{that > renderDialogContent}.options.panelType"
        }, {
            source: "{that}.options.renderDialogContentOptions",
            removeSource: true,
            target: "{that > renderDialogContent}.options"
        }]
    });

    gpii.metadata.feedback.bindbutton = function (event, that) {
        event.preventDefault();

        if (that.dialog && that.dialog.dialog("isOpen") && that.isActive) {
            that.dialog.dialog("close");
        } else if (!that.isActive) {
            if (!that.dialogContainer) {
                that.dialogContainer = $(that.options.markup.dialog);
            }
            that.events.onRenderDialogContent.fire();
        }

        that.isActive = !that.isActive;
        that.events.onActiveStateChange.fire(that.isActive);
    };

    gpii.metadata.feedback.instantiateDialog = function (that) {
        if (!that.dialog) {
            var dialogId = fluid.allocateSimpleId();
            that.dialog = that.dialogContainer.dialog(that.options.commonDialogOptions).attr("id", dialogId);
            that.container.attr("aria-controls", dialogId);

            that.events.onBindDialogHandlers.fire();
        }

        that.events.onDialogReady.fire(that.dialog);
    };

    gpii.metadata.feedback.bindOutsideOfDialogClick = function (dialog, buttonDom) {
        $("body").bind("click", function (e) {
            if (dialog.dialog("isOpen")) {
                fluid.globalDismissal({
                    button: buttonDom,
                    dialog: dialog,
                    dialogDescendant: $.contains(dialog, e.target)
                }, function () {
                    dialog.dialog("close");
                });
            }
        });

        $("body").find("iframe").contents().find("body").on("click", function () {
            dialog.dialog("close");
        });
    };

    gpii.metadata.feedback.setActiveProps = function (isActive, buttonDom, activeCss) {
        if (isActive) {
            buttonDom.addClass(activeCss);
            buttonDom.attr("aria-pressed", true);
        } else {
            buttonDom.removeClass(activeCss);
            buttonDom.attr("aria-pressed", false);
        }
    };

})(jQuery, fluid);
