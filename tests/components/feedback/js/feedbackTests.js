/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.feedback", {
        gradeNames: ["gpii.metadata.feedback", "autoInit"],
        resources: {
            template: {
                url: "../../../../src/components/feedback/html/feedbackTemplate.html"
            }
        }
    });

    gpii.tests.assertMarkup = function (that) {
        jqUnit.assertNotNull("The template should be rendered into the markup", that.options.resources.template.resourceText, that.container.html());
        jqUnit.assertEquals("The aria role is set for match confirmation button", "button", that.locate("matchConfirmationButton").attr("role"));
        jqUnit.assertEquals("The aria label is set", that.options.strings.matchConfirmationLabel, that.locate("matchConfirmationButton").attr("aria-label"));
    };

    fluid.defaults("gpii.tests.feedback.verifyInit", {
        gradeNames: ["gpii.tests.feedback", "autoInit"],
        listeners: {
            "onCreate.verifyContainerClass": {
                funcName: "jqUnit.assertTrue",
                args: ["The container should have the styling class added", "{that}.options.styles.container"],
                priority: "last"
            },
            "afterTemplateFetched.verifyResourceTextReturned": {
                funcName: "jqUnit.assertTrue",
                args: ["The resourceText property should be set", "{that}.options.resources.template.resourceText"]
            },
            "afterTemplateFetched.verifyResourceTextSet": {
                funcName: "jqUnit.assertTrue",
                args: ["The resourceText should be returned by the event", "{arguments}.0.template.resourceText"]
            },
            "afterMarkupReady.verifyMarkup": {
                funcName: "gpii.tests.assertMarkup",
                args: ["{that}"]
            },
            "afterMarkupReady.verifyDataSource": {
                funcName: "jqUnit.assertNotNull",
                args: ["The subcomponent dataSource should be created", "{that}.dataSource"],
                priority: 1
            },
            "afterMarkupReady.verifyMatchConfirmation": {
                funcName: "jqUnit.assertNotNull",
                args: ["The subcomponent bindMatchConfirmation should be created", "{that}.bindMatchConfirmation"],
                priority: 1
            },
            "afterMarkupReady.verifyMismatchDetails": {
                funcName: "jqUnit.assertNotNull",
                args: ["The subcomponent bindMismatchDetails should be created", "{that}.bindMismatchDetails"],
                priority: 1
            },
            "afterMarkupReady.start": {
                funcName: "jqUnit.start",
                priority: "last"
            }
        }
    });

    fluid.defaults("gpii.tests.feedback.verifyDialogs", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        // markupFixture: ".gpiic-feedback-markupFixture",
        components: {
            feedback: {
                type: "gpii.metadata.feedback",
                container: ".gpiic-feedback-dialogs",
                createOnEvent: "{verifyDialogsTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/feedback/html/feedbackTemplate.html"
                        }
                    },
                    matchConfirmationTemplate: "../../../../src/components/feedback/html/matchConfirmationTemplate.html",
                    mismatchDetailsTemplate: "../../../../src/components/feedback/html/mismatchDetailsTemplate.html"
                }
            },
            verifyDialogsTester: {
                type: "gpii.tests.feedback.verifyDialogsTester"
            }
        }
    });

    gpii.tests.feedback.checkInitModel = function (model) {
        return function (that) {
            jqUnit.assertFalse("The match indicator is set to false", model.match);
            jqUnit.assertFalse("The mismatch indicator is set to false", model.mismatch);
        };
    };

    gpii.tests.feedback.checkSavedModel = function (expectedModelValues) {
        console.log("expectedModelValues", expectedModelValues);
        return function (savedModel) {
            console.log("in", savedModel);
            fluid.each(expectedModelValues, function (expectedValue, key) {
                jqUnit.assertEquals("The value " + expectedValue + " on the path " + key + " is correct", expectedValue, fluid.get(savedModel.model, key));
            });
        };
    };

    fluid.defaults("gpii.tests.feedback.verifyDialogsTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test dialogs",
            tests: [{
                name: "Interaction between Match confirmation and mismatch details dialogs",
                // expect: 6,
                sequence: [{
                    listenerMaker: "gpii.tests.feedback.checkInitModel",
                    makerArgs: ["{feedback}.model"],
                    spec: {priority: "last"},
                    event: "{verifyDialogs feedback}.events.afterMarkupReady"
                }, {
                    jQueryTrigger: "click",
                    element: "{feedback}.dom.matchConfirmationButton"
                }, {
                    listenerMaker: "gpii.tests.feedback.checkSavedModel",
                    makerArgs: [{
                        match: true,
                        mismatch: false
                    }],
                    spec: {priority: "last"},
                    event: "{feedback}.events.afterSave"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        jqUnit.asyncTest("Initial settings", function () {
            jqUnit.expect(9);
            gpii.tests.feedback.verifyInit(".gpiic-feedback-init");
        });

        fluid.test.runTests([
            "gpii.tests.feedback.verifyDialogs"
        ]);
    });
})(jQuery, fluid);
