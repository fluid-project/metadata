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

    fluid.tests.checkCheckboxState = function (that, modelPath, state) {
        return function () {
            var validationFunc = state ? jqUnit.assertTrue : jqUnit.assertFalse;
            validationFunc(modelPath + " checkbox is checked", that.locate(modelPath).is(":checked"));
        };
    };

    fluid.tests.checkRadioButtonState = function (that, state) {
        return function () {
            var radiobuttons = that.locate("flashingRow");

            jqUnit.assertTrue("The radio button with the value 'unavailable' is checked", radiobuttons.find("[value='" + state + "']").is(":checked"));
        };
    };

    fluid.defaults("fluid.tests.videoPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test summary panel",
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
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on high contrast attribute",
                sequence: [{
                    func: "{videoPanel}.applier.requestChange",
                    args: ["highContrast", true]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{videoPanel}", "highContrast", true],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
                }, {
                    func: "{videoPanel}.applier.requestChange",
                    args: ["highContrast", false]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{videoPanel}", "highContrast", false],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
                }]
            }]
        }, {
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on sign language attribute",
                sequence: [{
                    func: "{videoPanel}.applier.requestChange",
                    args: ["signLang", true]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{videoPanel}", "signLang", true],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
                }, {
                    func: "{videoPanel}.applier.requestChange",
                    args: ["signLang", false]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{videoPanel}", "signLang", false],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
                }]
            }]
        }, {
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on video",
                sequence: [{
                    func: "{videoPanel}.applier.requestChange",
                    args: ["flashing", "flashing"]
                }, {
                    listenerMaker: "fluid.tests.checkRadioButtonState",
                    makerArgs: ["{videoPanel}", "flashing"],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
                }, {
                    func: "{videoPanel}.applier.requestChange",
                    args: ["flashing", "noFlashing"]
                }, {
                    listenerMaker: "fluid.tests.checkRadioButtonState",
                    makerArgs: ["{videoPanel}", "noFlashing"],
                    spec: {priority: "last"},
                    event: "{videoPanel}.events.afterRender"
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
