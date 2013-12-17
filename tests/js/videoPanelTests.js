/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests");

    fluid.defaults("fluid.tests.videoPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            videoPanel: {
                type: "fluid.metadata.videoPanel",
                container: ".flc-video",
                createOnEvent: "{videoPanelTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../src/html/video-template.html"
                        }
                    }
                }
            },
            videoPanelTester: {
                type: "fluid.tests.videoPanelTester"
            }
        }
    });

    fluid.tests.checkInit = function (videoPanel, expectedRadiobuttons, expectedCheckboxes) {
        return function (that) {
            var radiobuttons = that.locate("flashingRow");
            var checkboxes = that.container.find("[type='checkbox']");

            jqUnit.assertEquals("Expected number of radiobuttons are rendered", expectedRadiobuttons, radiobuttons.length);
            jqUnit.assertEquals("Expected number of checkboxes are rendered", expectedCheckboxes, checkboxes.length);
            jqUnit.assertTrue("The radio button with the value 'unknown' is checked", radiobuttons.find("[value='unknown']").is(":checked"));

            jqUnit.assertTrue("Appropriate Indicator css class has been applied", that.locate("icon").hasClass("fl-available"));

            var count = 0;
            checkboxes.each(function () {
                jqUnit.assertFalse("Checkbox #" + ++count + " is not checked", $(this).is(":checked"));
            });
        }
    };

    fluid.tests.clickCheckbox = function (videoPanel, attribute) {
        videoPanel.locate(attribute).click();
    };

    fluid.tests.clickFlashing = function (videoPanel, flashingValue) {
        videoPanel.container.find("[value='" + flashingValue + "']").click();
    };

    fluid.tests.checkModel = function (attribute, value) {
        return function (newModel) {
            jqUnit.assertTrue("The model for " + attribute + " has been updated correctly", value, fluid.get(newModel, attribute));
        };
    };

    fluid.defaults("fluid.tests.videoPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test video panel",
            tests: [{
                expect: 6,
                name: "Init",
                sequence: [{
                    listenerMaker: "fluid.tests.checkInit",
                    makerArgs: ["{videoPanelTests videoPanel}", 3, 2],
                    spec: {priority: "last"},
                    event: "{videoPanelTests videoPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Click on checkboxes",
            tests: [{
                expect: 2,
                name: "Click on an audio attribute",
                sequence: [{
                    func: "fluid.tests.clickCheckbox",
                    args: ["{videoPanel}", "highContrast"]
                }, {
                    listenerMaker: "fluid.tests.checkModel",
                    makerArgs: ["highContrast", true],
                    spec: {path: "highContrast", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.clickCheckbox",
                    args: ["{videoPanel}", "signLang"]
                }, {
                    listenerMaker: "fluid.tests.checkModel",
                    makerArgs: ["signLang", true],
                    spec: {path: "signLang", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }]
            }]
        }, {
            name: "Click on flashing attribute",
            tests: [{
                expect: 3,
                name: "Click on a flashing attribute",
                sequence: [{
                    func: "fluid.tests.clickFlashing",
                    args: ["{videoPanel}", "noFlashing"]
                }, {
                    listenerMaker: "fluid.tests.checkModel",
                    makerArgs: ["flashing", "noFlashing"],
                    spec: {path: "flashing", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.clickFlashing",
                    args: ["{videoPanel}", "unknown"]
                }, {
                    listenerMaker: "fluid.tests.checkModel",
                    makerArgs: ["flashing", "unknown"],
                    spec: {path: "flashing", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.clickFlashing",
                    args: ["{videoPanel}", "flashing"]
                }, {
                    listenerMaker: "fluid.tests.checkModel",
                    makerArgs: ["flashing", "flashing"],
                    spec: {path: "flashing", priority: "last"},
                    changeEvent: "{videoPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.videoPanelTests"
        ]);
    });

})(jQuery);
