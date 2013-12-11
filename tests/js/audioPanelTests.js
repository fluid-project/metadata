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

    fluid.tests.checkInit = function (audioPanel, expectedRadiobuttons, expectedCheckboxes) {
        return function (that) {
            var radiobuttons = that.locate("audioRow");
            var checkboxes = that.locate("attributes").find("[type='checkbox']");

            jqUnit.assertEquals("Expected number of radiobuttons are rendered", expectedRadiobuttons, radiobuttons.length);
            jqUnit.assertEquals("Expected number of checkboxes are rendered", expectedCheckboxes, checkboxes.length);
            jqUnit.assertTrue("The radio button with the value 'available' is checked", radiobuttons.find("[value='available']").is(":checked"));
            jqUnit.assertTrue("Appropriate Indicator css class has been applied", that.locate("icon").hasClass("fl-available"));

            var count = 0;
            checkboxes.each(function () {
                jqUnit.assertFalse("Checkbox #" + ++count + " is not checked", $(this).is(":checked"));
            });
        }
    };

    fluid.tests.checkSoundTrack = function (that, modelPath) {
        return function () {
            var checkboxes = that.locate("attributes").find("[type='checkbox']");
            checkboxes.each(function () {
                if ($(this).attr("name") === modelPath) {
                    jqUnit.assertTrue(modelPath + " checkbox is checked", $(this).is(":checked"));
                } else {
                    jqUnit.assertFalse("The other checkbox is not checked", $(this).is(":checked"));
                }
            });
        };
    };

    fluid.tests.checkDisabledAttributes = function (that) {
        return function () {
            var radiobuttons = that.locate("audioRow");

            jqUnit.assertTrue("The radio button with the value 'unavailable' is checked", radiobuttons.find("[value='unavailable']").is(":checked"));
            jqUnit.assertTrue("Appropriate Indicator css class has been applied", that.locate("icon").hasClass("fl-unavailable"));
            jqUnit.assertEquals("Checkboxes for defining audio attributes are not rendered", 0, that.locate("attributes").find("[type='checkbox']").length);
        };
    };

    fluid.defaults("fluid.tests.audioPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test audio panel",
            tests: [{
                expect: 7,
                name: "Init",
                sequence: [{
                    listenerMaker: "fluid.tests.checkInit",
                    makerArgs: ["{audioPanelTests audioPanel}", 3, 3],
                    spec: {priority: "last"},
                    event: "{audioPanelTests audioPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test audio panel",
            tests: [{
                expect: 3,
                name: "Request change on an audio attribute",
                sequence: [{
                    func: "{audioPanel}.applier.requestChange",
                    args: ["soundTrack", true]
                }, {
                    listenerMaker: "fluid.tests.checkSoundTrack",
                    makerArgs: ["{audioPanel}", "soundTrack"],
                    spec: {priority: "last"},
                    event: "{audioPanel}.events.afterAttributesRendered"
                }]
            }]
        }, {
            name: "Test audio panel",
            tests: [{
                expect: 3,
                name: "Request change on audio",
                sequence: [{
                    func: "{audioPanel}.applier.requestChange",
                    args: ["audio", "unavailable"]
                }, {
                    listenerMaker: "fluid.tests.checkDisabledAttributes",
                    makerArgs: ["{audioPanel}"],
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
