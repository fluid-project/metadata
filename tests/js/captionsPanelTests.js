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

    fluid.defaults("fluid.tests.captionsInputTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            captionsInput: {
                type: "fluid.metadata.captionsPanel.captionInput",
                container: ".flc-captionsPanel-captionsInput",
                createOnEvent: "{captionInputTester}.events.onTestCaseStart"
            },
            captionInputTester: {
                type: "fluid.tests.captionInputTester"
            }
        }
    });

    fluid.defaults("fluid.tests.captionInputTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test summary panel",
            tests: [{
                expect: 6,
                name: "Init",
                sequence: [{
                    listenerMaker: "fluid.tests.checkInit",
                    makerArgs: ["{captionsInputTests captionsInput}", 3, 2],
                    spec: {priority: "last"},
                    event: "{captionsInputTests captionsInput}.events.onReady"
                }]
            }]
        }, {
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on high contrast attribute",
                sequence: [{
                    func: "{captionsInput}.applier.requestChange",
                    args: ["highContrast", true]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{captionsInput}", "highContrast", true],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }, {
                    func: "{captionsInput}.applier.requestChange",
                    args: ["highContrast", false]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{captionsInput}", "highContrast", false],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }]
            }]
        }, {
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on sign language attribute",
                sequence: [{
                    func: "{captionsInput}.applier.requestChange",
                    args: ["signLang", true]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{captionsInput}", "signLang", true],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }, {
                    func: "{captionsInput}.applier.requestChange",
                    args: ["signLang", false]
                }, {
                    listenerMaker: "fluid.tests.checkCheckboxState",
                    makerArgs: ["{captionsInput}", "signLang", false],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }]
            }]
        }, {
            name: "Test summary panel",
            tests: [{
                expect: 2,
                name: "Request change on video",
                sequence: [{
                    func: "{captionsInput}.applier.requestChange",
                    args: ["flashing", "flashing"]
                }, {
                    listenerMaker: "fluid.tests.checkRadioButtonState",
                    makerArgs: ["{captionsInput}", "flashing"],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }, {
                    func: "{captionsInput}.applier.requestChange",
                    args: ["flashing", "noFlashing"]
                }, {
                    listenerMaker: "fluid.tests.checkRadioButtonState",
                    makerArgs: ["{captionsInput}", "noFlashing"],
                    spec: {priority: "last"},
                    event: "{captionsInput}.events.afterRender"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.captionsInputTests"
        ]);
    });

})(jQuery);
