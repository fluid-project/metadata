/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.videoPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            videoPanel: {
                type: "gpii.metadata.videoPanel",
                container: ".gpiic-video",
                createOnEvent: "{videoPanelTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/metadata/html/video-template.html"
                        }
                    }
                }
            },
            videoPanelTester: {
                type: "gpii.tests.videoPanelTester"
            }
        }
    });

    gpii.tests.checkInit = function ( expectedRadiobuttons, expectedCheckboxes) {
        return function (that) {
            var radiobuttons = that.locate("flashingRow");
            var checkboxes = that.container.find("[type='checkbox']");

            jqUnit.assertEquals("Expected number of radiobuttons are rendered", expectedRadiobuttons, radiobuttons.length);
            jqUnit.assertEquals("Expected number of checkboxes are rendered", expectedCheckboxes, checkboxes.length);
            jqUnit.assertTrue("The radio button with the value 'unknown' is checked", radiobuttons.find("[value='unknown']").is(":checked"));

            jqUnit.assertTrue("Appropriate Indicator css class has been applied", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));

            var count = 0;
            checkboxes.each(function () {
                jqUnit.assertFalse("Checkbox #" + (++count) + " is not checked", $(this).is(":checked"));
            });
        };
    };

    gpii.tests.clickCheckbox = function (videoPanel, attribute) {
        videoPanel.locate(attribute).click();
    };

    gpii.tests.checkModel = function (attribute, value) {
        return function (newModelValue) {
            jqUnit.assertEquals("The model for " + attribute + " has been updated correctly", value, newModelValue);
        };
    };

    fluid.defaults("gpii.tests.videoPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test video panel",
            tests: [{
                expect: 6,
                name: "Init",
                sequence: [{
                    listenerMaker: "gpii.tests.checkInit",
                    makerArgs: [3, 2],
                    spec: {priority: "last"},
                    event: "{videoPanelTests videoPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Click on checkboxes",
            tests: [{
                expect: 2,
                name: "Click on a video attribute",
                sequence: [{
                    func: "gpii.tests.clickCheckbox",
                    args: ["{videoPanel}", "highContrast"]
                }, {
                    listenerMaker: "gpii.tests.checkModel",
                    makerArgs: ["highContrast", true],
                    spec: {path: "highContrast", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }, {
                    func: "gpii.tests.clickCheckbox",
                    args: ["{videoPanel}", "signLang"]
                }, {
                    listenerMaker: "gpii.tests.checkModel",
                    makerArgs: ["signLang", true],
                    spec: {path: "signLanguage", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.videoPanelTests"
        ]);
    });

    gpii.tests.clickFlashing = function (videoPanel, flashingValue) {
        videoPanel.container.find("[value='" + flashingValue + "']").click();
    };

    gpii.tests.addModelListenerForFlashing = function (that, expectedValue) {
        that.applier.modelChanged.addListener("flashing", function (newModelValue) {
            jqUnit.assertEquals("The model for flashing attribute has been updated correctly - " + expectedValue, expectedValue, newModelValue);
            that.applier.modelChanged.removeListener("checkModel");
        }, "checkModel", null, "last");

    };

    jqUnit.asyncTest("Click on flashing attribute", function () {
        gpii.metadata.videoPanel(".gpiic-video-flashing", {
            resources: {
                template: {
                    url: "../../../../src/components/metadata/html/video-template.html"
                }
            },
            listeners: {
                onReady: function (that) {
                    gpii.tests.addModelListenerForFlashing(that, "flashing");
                    gpii.tests.clickFlashing(that, "flashing");

                    gpii.tests.addModelListenerForFlashing(that, "noFlashing");
                    gpii.tests.clickFlashing(that, "noFlashing");

                    gpii.tests.addModelListenerForFlashing(that, "unknown");
                    gpii.tests.clickFlashing(that, "unknown");

                    jqUnit.start();
                }
            }
        });
    });

})(jQuery, fluid);
