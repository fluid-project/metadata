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
                createOnEvent: "{mismatchDetailsTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/feedback/html/mismatchDetailsTemplate.html"
                        }
                    }
                }
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

    gpii.tests.mismatchDetails.assertInitOnSkip = function () {
        return function () {
            jqUnit.assertTrue("Clicking the skip button fires onSkip event", true);
        };
    };

    gpii.tests.mismatchDetails.assertInitOnSubmit = function () {
        return function (evt) {
            jqUnit.assertDeepEq("onSubmit event is fired", "click", evt.type);
        };
    };

    gpii.tests.mismatchDetails.modelChangedChecker = function (modelPath, expectedValue) {
        return function (newValue) {
            jqUnit.assertEquals("The model path '" + modelPath + "'' is updated correctly.", expectedValue, newValue);
        };
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
                expect: 7,
                name: "Initial checks",
                sequence: [{
                    listener: "gpii.tests.mismatchDetails.assertInit",
                    spec: {priority: "last"},
                    event: "{mismatchDetailsTests mismatchDetails}.events.onReady"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.skip"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.assertInitOnSkip",
                    event: "{mismatchDetails}.events.onSkip"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.submit"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.assertInitOnSubmit",
                    makerArgs: ["{mismatchDetails}"],
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
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["notInteresting", true],
                    spec: {path: "notInteresting"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.text"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["text", true],
                    spec: {path: "text"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.transcripts"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["transcripts", true],
                    spec: {path: "transcripts"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.audio"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["audio", true],
                    spec: {path: "audio"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{mismatchDetails}.dom.audioDesc"
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["audioDesc", true],
                    spec: {path: "audioDesc"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    func: "gpii.tests.mismatchDetails.checkOther",
                    args: ["{mismatchDetails}.dom.other"]
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["other", true],
                    spec: {path: "other"},
                    changeEvent: "{mismatchDetails}.applier.modelChanged"
                }, {
                    func: "gpii.tests.mismatchDetails.changeOtherFeedback",
                    args: ["{mismatchDetails}.dom.otherFeedback", "{that}.options.testOptions.newText"]
                }, {
                    listenerMaker: "gpii.tests.mismatchDetails.modelChangedChecker",
                    makerArgs: ["otherFeedback", "{that}.options.testOptions.newText"],
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
                container: ".gpiic-mismatchDetails-feedbackInteraction",
                createOnEvent: "{feedbackInteractionTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/feedback/html/mismatchDetailsTemplate.html"
                        }
                    }
                }
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
                    spec: {priority: "last"},
                    event: "{feedbackInteractionTests mismatchDetails}.events.onReady"
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
