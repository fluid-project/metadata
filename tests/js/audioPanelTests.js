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

    fluid.defaults("fluid.tests.audioPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            audioPanel: {
                type: "fluid.metadata.audioPanel",
                container: ".flc-audio",
                createOnEvent: "{audioPanelTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../src/html/audio-template.html"
                        }
                    },
                    audioAttributesTemplate: "../../src/html/audio-attributes-template.html",
                }
            },
            audioPanelTester: {
                type: "fluid.tests.audioPanelTester"
            }
        }
    });

    fluid.tests.checkAudioState = function (audioPanel, expectedRadiobuttons, expectedCheckboxes, state) {
        return function (that) {
            that = that.typeName === "fluid.metadata.audioPanel" ? that : audioPanel;

            var radiobuttons = that.container.find("[type='radio']");
            var checkboxes = that.locate("attributes").find("[type='checkbox']");

            jqUnit.assertEquals("Expected number of radiobuttons are rendered", expectedRadiobuttons, radiobuttons.length);
            jqUnit.assertEquals("Expected number of checkboxes are rendered", expectedCheckboxes, checkboxes.length);
            radiobuttons.each(function () {
                if ($(this).attr("value") === state) {
                    jqUnit.assertTrue("The radio button with the value '" + state + "' is checked", $(this).is(":checked"));
                }
            });

            jqUnit.assertTrue("Appropriate Indicator css class has been applied", that.locate("icon").hasClass("fl-" + state));

            if (state === "available") {
                var count = 0;
                checkboxes.each(function () {
                    jqUnit.assertFalse("Checkbox #" + ++count + " is not checked", $(this).is(":checked"));
                });
            }
        }
    };

    fluid.tests.clickAttribute = function (audioPanel, attribute) {
        audioPanel.locate("attributes").find("[value='" + attribute + "']").click();
    };

    fluid.tests.checkAttribute = function (modelPath) {
        return function (newModel, oldModel, changeReqeust) {
            var keywords = fluid.get(newModel, "keywords");
            jqUnit.assertNotEquals("The proper model path has been updated", -1, $.inArray(modelPath, keywords));
        };
    };

    fluid.tests.clickAudioState = function (audioPanel, state) {
        audioPanel.container.find("[value='" + state + "']").click();
    };

    fluid.defaults("fluid.tests.audioPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test audio panel",
            tests: [{
                expect: 7,
                name: "Init",
                sequence: [{
                    listenerMaker: "fluid.tests.checkAudioState",
                    makerArgs: ["{audioPanelTests audioPanel}", 3, 3, "available"],
                    spec: {priority: "last"},
                    event: "{audioPanelTests audioPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test audio panel",
            tests: [{
                expect: 3,
                name: "Click on an audio attribute",
                sequence: [{
                    func: "fluid.tests.clickAttribute",
                    args: ["{audioPanel}", "dialogue"]
                }, {
                    listenerMaker: "fluid.tests.checkAttribute",
                    makerArgs: ["dialogue"],
                    spec: {path: "keywords", priority: "last"},
                    changeEvent: "{audioPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.clickAttribute",
                    args: ["{audioPanel}", "soundtrack"]
                }, {
                    listenerMaker: "fluid.tests.checkAttribute",
                    makerArgs: ["soundtrack"],
                    spec: {path: "keywords", priority: "last"},
                    changeEvent: "{audioPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.clickAttribute",
                    args: ["{audioPanel}", "sound effect"]
                }, {
                    listenerMaker: "fluid.tests.checkAttribute",
                    makerArgs: ["sound effect"],
                    spec: {path: "keywords", priority: "last"},
                    changeEvent: "{audioPanel}.applier.modelChanged"
                }]
            }]
        }, {
            name: "Test audio panel",
            tests: [{
                expect: 8,
                name: "Change audio availability",
                sequence: [{
                    func: "fluid.tests.clickAudioState",
                    args: ["{audioPanel}", "unavailable"]
                }, {
                    listenerMaker: "fluid.tests.checkAudioState",
                    makerArgs: ["{audioPanel}", 3, 0, "unavailable"],
                    spec: {priority: "last"},
                    event: "{audioPanel}.events.afterAttributesRendered"
                }, {
                    func: "fluid.tests.clickAudioState",
                    args: ["{audioPanel}", "unknown"]
                }, {
                    listenerMaker: "fluid.tests.checkAudioState",
                    makerArgs: ["{audioPanel}", 3, 0, "unknown"],
                    spec: {priority: "last"},
                    event: "{audioPanel}.events.afterAttributesRendered"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.audioPanelTests"
        ]);
    });

})(jQuery);
