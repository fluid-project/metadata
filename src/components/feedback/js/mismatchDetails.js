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
        members: {
            defaultModel: {
                notInteresting: false,
                text: false,
                transcripts: false,
                audio: false,
                audioDesc: false,
                other: false,
                otherFeedback: ""
            }
        },
        model: {
            expander: {
                funcName: "fluid.copy",
                args: ["{that}.defaultModel"]
            }
        },
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
            afterTemplateFetched: null,
            onSkip: null,
            onSubmit: null,
            onReset: null,
            onReady: null
        },
        listeners: {
            "onCreate.fetchResources": {
                listener: "fluid.fetchResources",
                args: ["{that}.options.resources", "{that}.events.afterTemplateFetched.fire"]
            },
            "afterTemplateFetched.refreshView": "{that}.refreshView",
            "afterTemplateFetched.setButtonText": {
                "this": "{that}.dom.submit",
                method: "text",
                args: "{that}.options.strings.submit"
            },
            "afterTemplateFetched.bindSkipHandler": {
                "this": "{that}.dom.skip",
                method: "on",
                args: ["click", "{that}.events.onSkip.fire"]
            },
            "afterTemplateFetched.bindSubmitHandler": {
                "this": "{that}.dom.submit",
                method: "on",
                args: ["click", "{that}.events.onSubmit.fire"]
            },
            "afterTemplateFetched.bindTextareaKeyup": {
                "this": "{that}.dom.otherFeedback",
                method: "on",
                args: ["keyup", "{that}.bindTextareaKeyup"]
            },
            "afterTemplateFetched.fireOnReady": {
                listener: "{that}.events.onReady.fire",
                priority: "last",
                args: "{that}"
            },
            "onSkip.preventDefault": {
                listener: "gpii.metadata.feedback.mismatchDetails.preventDefault",
                args: "{arguments}.0"
            },
            "onReset.resetModel": {
                listener: "{that}.applier.change",
                args: ["", "{that}.defaultModel"],
                priority: "first"
            }
        },
        invokers: {
            bindTextareaKeyup: {
                funcName: "gpii.metadata.feedback.mismatchDetails.bindTextareaKeyup",
                args: ["{that}", "{arguments}.0"]
            }
        },
        resources: {
            template: {
                url: "../html/mismatchDetailsTemplate.html",
                forceCache: true
            }
        }
    });

    gpii.metadata.feedback.mismatchDetails.preventDefault = function (evt) {
        evt.preventDefault();
    };

    gpii.metadata.feedback.mismatchDetails.bindTextareaKeyup = function (that, evt) {
        var checkboxOther = that.locate("other");
        if (evt.target.value.length) {
            checkboxOther.attr("checked", "checked");
        } else {
            checkboxOther.removeAttr("checked");
        }
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
