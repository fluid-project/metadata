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

    fluid.defaults("gpii.tests.feedbackLoaderTests", {
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
                type: "gpii.tests.feedbackLoaderTester"
            }
        }
    });

    gpii.tests.verifyLoader = function (feedbackLoader) {
        var resources = feedbackLoader.templateLoader.resources;
        jqUnit.assertNotNull("The feedback template is loaded", resources.feedback.resourceText);
        jqUnit.assertNotNull("The matchConfirmation template is loaded", resources.matchConfirmation.resourceText);
        jqUnit.assertNotNull("The mismatchDetails template is loaded", resources.mismatchDetails.resourceText);

        var that = feedbackLoader.feedback;
        jqUnit.assertNotNull("The subcomponent dataSource has been created", that.dataSource);
        jqUnit.assertNotNull("The subcomponent matchConfirmation has been created", that.matchConfirmation);
        jqUnit.assertNotNull("The subcomponent mismatchDetails has been created", that.mismatchDetails);
    };

    fluid.defaults("gpii.tests.feedbackLoaderTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Feedback loader tests",
            tests: [{
                name: "feedbackLoader",
                expect: 6,
                sequence: [{
                    listener: "gpii.tests.verifyLoader",
                    args: ["{feedbackLoader}", "{arguments}.0"],
                    priority: "last",
                    event: "{feedbackLoaderTests feedbackLoader}.events.onTemplatesLoaded"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.feedbackLoaderTests"
        ]);
    });
})(jQuery, fluid);
