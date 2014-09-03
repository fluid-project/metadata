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
     * Renders mismatch details
     */
    fluid.defaults("gpii.metadata.feedback.mismatchDetails", {
        gradeNames: ["gpii.metadata.feedback.baseDialogContent", "autoInit"],
        selectors: {
            header: ".gpiic-mismatchDetails-header",
            notInteresting: ".gpiic-notInteresting",
            notInterestingLabel: ".gpiic-notInteresting-label",
            prefsTitle: ".gpiic-mismatchDetails-prefs-title",
            text: ".gpiic-text",
            textLabel: ".gpiic-text-label",
            transcripts: ".gpiic-transcripts",
            transcriptsLabel: ".gpiic-transcripts-label",
            audio: ".gpiic-audio",
            audioLabel: ".gpiic-audio-label",
            audioDesc: ".gpiic-audioDesc",
            audioDescLabel: ".gpiic-audioDesc-label",
            other: ".gpiic-other",
            otherLabel: ".gpiic-other-label",
            otherFeedback: ".gpiic-other-feedback",
            skip: ".gpiic-mismatchDetails-skip",
            submit: ".gpiic-mismatchDetails-submit"
        },
        selectorsToIgnore: ["submit"],
        strings: {
            header: "Feedback",
            prefsTitle: "Content didn’t meet my preferences",
            notInterestingLabel: "Not interesting",
            textLabel: "Needs text",
            transcriptsLabel: "Needs transcripts",
            audioLabel: "Needs audio",
            audioDescLabel: "Needs audio descriptions",
            otherLabel: "Other",
            specify: "Please specify",
            skip: "Skip",
            submit: "Submit"
        },
        protoTree: {
            header: {messagekey: "header"},
            prefsTitle: {messagekey: "prefsTitle"},
            notInteresting: "${notInteresting}",
            notInterestingLabel: {messagekey: "notInterestingLabel"},
            text: "${text}",
            textLabel: {messagekey: "textLabel"},
            transcripts: "${transcripts}",
            transcriptsLabel: {messagekey: "transcriptsLabel"},
            audio: "${audio}",
            audioLabel: {messagekey: "audioLabel"},
            audioDesc: "${audioDesc}",
            audioDescLabel: {messagekey: "audioDescLabel"},
            other: "${other}",
            otherLabel: {messagekey: "otherLabel"},
            otherFeedback: {
                value: "${otherFeedback}",
                decorators: {
                    type: "attrs",
                    attributes: {placeholder: "${{that}.options.strings.specify}"}
                }
            },
            skip: {messagekey: "skip"}
        },
        events: {
            onSkip: null,
            onSubmit: null,
            onReset: null
        },
        listeners: {
            "afterRender.setButtonText": {
                "this": "{that}.dom.submit",
                method: "text",
                args: "{that}.options.strings.submit"
            },
            "afterRender.bindSkipHandler": {
                "this": "{that}.dom.skip",
                method: "on",
                args: ["click", "{that}.events.onSkip.fire"]
            },
            "afterRender.bindSubmitHandler": {
                "this": "{that}.dom.submit",
                method: "on",
                args: ["click", "{that}.events.onSubmit.fire"]
            },
            "afterRender.bindTextareaKeyup": {
                "this": "{that}.dom.otherFeedback",
                method: "on",
                args: ["keyup", "{that}.bindTextareaKeyup"]
            },
            "onSkip.preventDefault": {
                listener: "gpii.metadata.feedback.mismatchDetails.preventDefault",
                args: "{arguments}.0"
            },
            "onReset.resetModel": {
                listener: "{that}.applier.change",
                args: ["", "{that}.options.defaultModel"],
                priority: "first"
            }
        },
        defaultModel: {
            notInteresting: false,
            text: false,
            transcripts: false,
            audio: false,
            audioDesc: false,
            other: false,
            otherFeedback: ""
        },
        model: "{that}.options.defaultModel",
        modelListeners: {
            other: {
                listener: "gpii.metadata.feedback.handleCheckboxOtherState",
                args: ["{change}.value", "{that}"]
            },
            otherFeedback: {
                listener: "gpii.metadata.feedback.updateFeedbackContent",
                args: ["{change}.value", "{that}"]
            }
        },
        invokers: {
            bindTextareaKeyup: {
                funcName: "gpii.metadata.feedback.mismatchDetails.bindTextareaKeyup",
                args: ["{arguments}.0", "{that}"],
                excludeSource: "init"
            },
            bindCheckboxOther: {
                funcName: "gpii.metadata.feedback.mismatchDetails.bindCheckboxOther",
                args: ["{arguments}.0", "{that}"],
                excludeSource: "init"
            }
        }
    });

    gpii.metadata.feedback.mismatchDetails.preventDefault = function (evt) {
        evt.preventDefault();
    };

    // Check the length of the value in the text area. When an input value is detectd,
    // the corresponding checkbox, "other", should be checked.
    gpii.metadata.feedback.mismatchDetails.bindTextareaKeyup = function (evt, that) {
        if (evt.target.value.length) {
            that.applier.change("other", true);
        }
    };

    gpii.metadata.feedback.handleCheckboxOtherState = function (other, that) {
        if (!other) {
            that.applier.change("otherFeedback", "");
        }
        that.locate("other").prop("checked", other);
    };

    gpii.metadata.feedback.updateFeedbackContent = function (feedbackContent, that) {
        that.locate("otherFeedback").val(feedbackContent);
    };

    /*
     * Attaches mismatch details panel with "bindDialog" component
     */
    fluid.defaults("gpii.metadata.feedback.bindMismatchDetails", {
        gradeNames: ["gpii.metadata.feedback.bindDialog", "autoInit"],
        panelType: "gpii.metadata.feedback.mismatchDetails",
        renderDialogContentOptions: {
            listeners: {
                "afterRender.fireContentReadyEvent": "{bindMismatchDetails}.events.onDialogContentReady",
                "onSkip.closeDialog": "{bindMismatchDetails}.closeDialog",
                "onSkip.resetSelections": "{that}.events.onReset.fire",
                "onSubmit.closeDialog": "{bindMismatchDetails}.closeDialog"
            }
        },
        modelListeners: {
            "isActive": {
                listener: "gpii.metadata.feedback.bindMismatchDetails.resetDialogModel",
                args: ["{change}.value", "{that}"]
            }
        }
    });

    gpii.metadata.feedback.bindMismatchDetails.resetDialogModel = function (isActive, that) {
        if (!isActive && that.renderDialogContent) {
            that.renderDialogContent.events.onReset.fire();
        }
    };

})(jQuery, fluid);
