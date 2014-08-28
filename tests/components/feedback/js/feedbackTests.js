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

    fluid.defaults("gpii.tests.feedbackLoader.feedbackLoaderTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            feedbackLoader: {
                type: "gpii.metadata.feedbackLoader",
                container: ".gpiic-feedbackLoader",
                createOnEvent: "{feedbackLoaderTester}.events.onTestCaseStart",
                options: {
                    templatePrefix: "../../../../src/components/feedback/html/"
                }
            },
            feedbackLoaderTester: {
                type: "gpii.tests.feedbackLoader.feedbackLoaderTester"
            }
        }
    });

    gpii.tests.feedbackLoader.verifyInit = function (feedbackLoader) {
        var resources = feedbackLoader.templateLoader.resources;
        jqUnit.assertNotNull("The feedback template is loaded", resources.feedback.resourceText);
        jqUnit.assertNotNull("The matchConfirmation template is loaded", resources.matchConfirmation.resourceText);
        jqUnit.assertNotNull("The mismatchDetails template is loaded", resources.mismatchDetails.resourceText);

        var that = feedbackLoader.feedback;
        jqUnit.assertNotNull("The template should be rendered into the markup", that.options.resources.template.resourceText, that.container.html());
        jqUnit.assertEquals("The aria role is set for match confirmation button", "button", that.locate("matchConfirmationButton").attr("role"));
        jqUnit.assertEquals("The aria label is set", that.options.strings.matchConfirmationLabel, that.locate("matchConfirmationButton").attr("aria-label"));

        jqUnit.assertNotNull("The subcomponent dataSource has been created", that.dataSource);
        jqUnit.assertNotNull("The subcomponent matchConfirmation has been created", that.matchConfirmation);
        jqUnit.assertNotNull("The subcomponent mismatchDetails has been created", that.mismatchDetails);

        jqUnit.assertNotNull("The user id has been generated", that._id);
    };

    gpii.tests.feedbackLoader.clickButton = function (feedbackLoader, buttonSelector) {
        feedbackLoader.feedback.locate(buttonSelector).click();
    };

    gpii.tests.feedbackLoader.checkSavedModel = function (savedModel, expectedModelValues) {
        fluid.each(expectedModelValues, function (expectedValue, key) {
            jqUnit.assertEquals("The value " + expectedValue + " on the path " + key + " is correct", expectedValue, fluid.get(savedModel.model, key));
        });
    };

    gpii.tests.feedbackLoader.verifyDialog = function (feedbackLoader, dialogComponentName, expectedIsDialogOpen, expectedIsActive) {
        var dialogComponent = feedbackLoader.feedback[dialogComponentName];

        jqUnit.assertNotNull("Button click triggers the creation of the dialog", dialogComponent.dialog);
        jqUnit.assertEquals("The dialog is open", expectedIsDialogOpen, dialogComponent.model.isDialogOpen);
        jqUnit.assertEquals("The state is active", expectedIsActive, dialogComponent.model.isActive);
    };

    gpii.tests.feedbackLoader.clickMismatchDetailsLinks = function (feedbackLoader, linkSelector) {
        var mismatchDetailsComponent = feedbackLoader.feedback.bindMismatchDetails.renderDialogContent;
        mismatchDetailsComponent.locate(linkSelector).click();
    };

    gpii.tests.feedbackLoader.verifyDialogOnSkip = function (feedbackLoader) {
        var bindMismatchDetails = feedbackLoader.feedback.bindMismatchDetails;
        jqUnit.assertFalse("The dialog is closed", bindMismatchDetails.model.isDialogOpen);
    };

    gpii.tests.feedbackLoader.setMismatchDetailsFields = function (feedbackLoader, newText) {
        var mismatchDetailsComponent = feedbackLoader.feedback.bindMismatchDetails.renderDialogContent;

        mismatchDetailsComponent.locate("notInteresting").click();
        mismatchDetailsComponent.locate("text").click();
        mismatchDetailsComponent.locate("transcripts").click();
        mismatchDetailsComponent.locate("audio").click();
        mismatchDetailsComponent.locate("audioDesc").click();
        mismatchDetailsComponent.locate("other").click();
        mismatchDetailsComponent.locate("otherFeedback").text(newText).change();
    };

    gpii.tests.feedbackLoader.verifyDialogOnSubmit = function (feedbackLoader) {
        var bindMismatchDetails = feedbackLoader.feedback.bindMismatchDetails;
        jqUnit.assertFalse("The dialog is closed", bindMismatchDetails.model.isDialogOpen);
    };

    fluid.defaults("gpii.tests.feedbackLoader.feedbackLoaderTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newText: "some text"
        },
        modules: [{
            name: "Initialization",
            tests: [{
                name: "Init",
                expect: 10,
                sequence: [{
                    listener: "gpii.tests.feedbackLoader.verifyInit",
                    args: ["{feedbackLoader}", "{arguments}.0"],
                    priority: "last",
                    event: "{feedbackLoaderTests feedbackLoader}.events.onTemplatesLoaded"
                }]
            }, {
                name: "Match confirmation dialog",
                expect: 5,
                sequence: [{
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "matchConfirmationButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialog",
                    args: ["{feedbackLoader}", "bindMatchConfirmation", true, true],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterMatchConfirmationButtonClicked"
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: true,
                        mismatch: false
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }]
            }, {
                name: "Mismatch details dialog",
                expect: 24,
                sequence: [{
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "mismatchDetailsButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialog",
                    args: ["{feedbackLoader}", "bindMismatchDetails", true, true],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterMismatchDetailsButtonClicked"
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: false,
                        mismatch: true
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }, {
                    func: "gpii.tests.feedbackLoader.clickMismatchDetailsLinks",
                    args: ["{feedbackLoader}", "skip"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialogOnSkip",
                    args: ["{feedbackLoader}"],
                    priority: "last",
                    event: "{feedbackLoader}.events.onSkipAtMismatchDetails"
                }, {
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "mismatchDetailsButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialog",
                    args: ["{feedbackLoader}", "bindMismatchDetails", false, false],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterMismatchDetailsButtonClicked"
                }, {
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "mismatchDetailsButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialog",
                    args: ["{feedbackLoader}", "bindMismatchDetails", true, true],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterMismatchDetailsButtonClicked"
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: false,
                        mismatch: true
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }, {
                    func: "gpii.tests.feedbackLoader.setMismatchDetailsFields",
                    args: ["{feedbackLoader}", "{that}.options.testOptions.newText"]
                }, {
                    func: "gpii.tests.feedbackLoader.clickMismatchDetailsLinks",
                    args: ["{feedbackLoader}", "submit"]
                }, {
                    listener: "gpii.tests.feedbackLoader.verifyDialogOnSubmit",
                    args: ["{feedbackLoader}"],
                    priority: "last",
                    event: "{feedbackLoader}.events.onSubmitAtMismatchDetails"
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: false,
                        mismatch: true,
                        notInteresting: true,
                        other: true,
                        otherFeedback: "{that}.options.testOptions.newText",
                        "requests.text": true,
                        "requests.transcripts": true,
                        "requests.audio": true,
                        "requests.audioDesc": true
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }]
            }, {
                name: "Interaction between Match confirmation and mismatch details icons",
                expect: 6,
                sequence: [{
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "matchConfirmationButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: true,
                        mismatch: false
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }, {
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "mismatchDetailsButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: false,
                        mismatch: true
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }, {
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "matchConfirmationButton"]
                }, {
                    listener: "gpii.tests.feedbackLoader.checkSavedModel",
                    args: ["{arguments}.0", {
                        match: true,
                        mismatch: false
                    }],
                    priority: "last",
                    event: "{feedbackLoader}.events.afterSave"
                }, {
                    func: "gpii.tests.feedbackLoader.clickButton",
                    args: ["{feedbackLoader}", "matchConfirmationButton"]
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.feedbackLoader.feedbackLoaderTests"
        ]);
    });
})(jQuery, fluid);
