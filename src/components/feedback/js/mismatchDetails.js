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
        model: {
            notInteresting: false,
            text: false,
            transcripts: false,
            audio: false,
            audioDesc: false,
            other: false,
            otherFeedback: ""
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
            "afterTemplateFetched.attachSkipHandler": {
                "this": "{that}.dom.skip",
                method: "on",
                args: ["click", "{that}.events.onSkip.fire"]
            },
            "afterTemplateFetched.attachSubmitHandler": {
                "this": "{that}.dom.submit",
                method: "on",
                args: ["click", "{that}.onSubmitFired"]
            },
            "afterTemplateFetched.fireOnReady": {
                listener: "{that}.events.onReady.fire",
                priority: "last",
                args: "{that}"
            },
            "onSkip.preventDefault": {
                listener: "gpii.metadata.feedback.mismatchDetails.preventDefault",
                args: "{arguments}.0"
            }
        },
        invokers: {
            onSubmitFired: {
                funcName: "gpii.metadata.feedback.mismatchDetails.onSubmitFired",
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

    gpii.metadata.feedback.mismatchDetails.preventDefault = function (e) {
        e.preventDefault();
    };

    gpii.metadata.feedback.mismatchDetails.onSubmitFired = function (that, evt) {
        that.events.onSubmit.fire(that.model, evt);
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
        }
    });

})(jQuery, fluid);
