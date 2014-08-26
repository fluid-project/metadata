/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.mismatchDetails");

    fluid.defaults("gpii.tests.mismatchDetailsTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            mismatchDetails: {
                type: "gpii.metadata.feedback.mismatchDetails",
                container: ".gpiic-mismatchDetails",
                createOnEvent: "{mismatchDetailsTester}.events.onTestCaseStart"
            },
            mismatchDetailsTester: {
                type: "gpii.tests.mismatchDetailsTester"
            }
        }
    });

    gpii.tests.mismatchDetails.assertInit = function (that) {
        var numOfCheckboxes = that.container.find(":checkbox:not(:checked)").length;
        jqUnit.assertEquals("Checkboxes are rendered and not checked", 6, numOfCheckboxes);

        var textarea = that.container.find("textarea");
        jqUnit.assertNotNull("The text area is rendered", textarea);
        jqUnit.assertEquals("The placeholder text is set", that.options.strings.specify, textarea.attr("placeholder"));

        jqUnit.assertEquals("The skip button is rendered with the correct label", that.options.strings.skip, that.container.find("a").text());
        jqUnit.assertEquals("The submit button is rendered with the correct label", that.options.strings.submit, that.container.find("button").text());
    };

    gpii.tests.mismatchDetails.checkOther = function (otherElm) {
        otherElm.attr("checked", "checked").change();
    };

    gpii.tests.mismatchDetails.changeOtherFeedback = function (otherFeedbackElm, newText) {
        otherFeedbackElm.val(newText).change();
    };

    fluid.defaults("gpii.tests.mismatchDetailsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newText: "some text"
        },
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 5,
                name: "Initial checks",
                sequence: [{
                    listener: "gpii.tests.mismatchDetails.assertInit",
                    priority: "last",
                    event: "{mismatchDetailsTests mismatchDetails}.events.afterRender"
                }]
            }]
        }, {
            name: "Button events",
            tests: [{
                expect: 2,
                name: "Button events",
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.skip"
                }, {
                    listener: "jqUnit.assertTrue",
                    args: ["Clicking the skip button fires onSkip event", true],
                    event: "{mismatchDetails}.events.onSkip"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.submit"
                }, {
                    listener: "jqUnit.assertDeepEq",
                    makerArgs: ["onSubmit event is fired", "click", "{arguments}.0.type"],
                    event: "{mismatchDetails}.events.onSubmit"
                }]
            }]
        }, {
            name: "Test checkboxes",
            tests: [{
                name: "Model binding",
                expect: 7,
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.notInteresting"
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'notInteresting' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "notInteresting"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.text"
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'text' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "text"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.transcripts"
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'transcripts' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "transcripts"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.audio"
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'audio' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "audio"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.audioDesc"
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'audioDesc' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "audioDesc"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    func: "gpii.tests.mismatchDetails.checkOther",
                    args: ["{mismatchDetails}.dom.other"]
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'other' is updated correctly.", true, "{arguments}.0"],
                    spec: {path: "other"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    func: "gpii.tests.mismatchDetails.changeOtherFeedback",
                    args: ["{mismatchDetails}.dom.otherFeedback", "{that}.options.testOptions.newText"]
                }, {
                    listener: "jqUnit.assertEquals",
                    args: ["The model path 'otherFeedback' is updated correctly.", "{that}.options.testOptions.newText", "{arguments}.0"],
                    spec: {path: "otherFeedback", priority: "last"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }]
            }]
        }]
    });

    fluid.defaults("gpii.tests.feedbackInteractionTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            mismatchDetails: {
                type: "gpii.metadata.feedback.mismatchDetails",
                container: ".gpiic-mismatchDetails",
                createOnEvent: "{feedbackInteractionTester}.events.onTestCaseStart"
            },
            feedbackInteractionTester: {
                type: "gpii.tests.feedbackInteractionTester"
            }
        }
    });

    gpii.tests.mismatchDetails.verifyInteraction = function (that) {
        var character = "a";
        that.locate("otherFeedback").val(character).change();
        that.locate("otherFeedback").simulate("keyup", {keyCode: character.charCodeAt(0)});
        jqUnit.assertTrue("The checkbox is auto-checked when the feedback textarea has input text", that.locate("other").is(":checked"));

        that.locate("other").click();
        jqUnit.assertFalse("The checkbox is unchecked", that.locate("other").is(":checked"));
        jqUnit.assertEquals("The text in the feedback textarea is cleared", "", that.locate("otherFeedback").val());
    };

    fluid.defaults("gpii.tests.feedbackInteractionTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Other feedback - The Checkbox and textarea interaction",
            tests: [{
                expect: 3,
                name: "The checkbox and textarea interaction",
                sequence: [{
                    listener: "gpii.tests.mismatchDetails.verifyInteraction",
                    priority: "last",
                    event: "{feedbackInteractionTests mismatchDetails}.events.afterRender"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.mismatchDetailsTests",
            "gpii.tests.feedbackInteractionTests"
        ]);
    });
})(jQuery);
