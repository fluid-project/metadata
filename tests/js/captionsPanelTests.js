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

    fluid.defaults("fluid.tests.captionsPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            captionsPanel: {
                type: "fluid.metadata.captionsPanel",
                container: ".flc-captionsPanel",
                createOnEvent: "{captionsPanelTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../src/html/resourceInputPanel-template.html"
                        },
                        resourceInput: {
                            url: "../../src/html/resourceInput-template.html"
                        }
                    }
                }
            },
            captionsPanelTester: {
                type: "fluid.tests.captionsPanelTester"
            }
        }
    });

    fluid.tests.checkInitPanel = function (that) {
        var srcFields = that.container.find("input");
        var languageFields = that.container.find("select");

        jqUnit.assertEquals("Two src fields have been rendered", 2, srcFields.length);
        jqUnit.assertEquals("Two language fields have been rendered", 2, languageFields.length);
        jqUnit.assertTrue("The indicator state has been set to 'unavailable'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
        srcFields.each(function () {
            jqUnit.assertEquals("The placeholder for the input field has been set", that.primaryResource.options.strings.srcPlaceholder, $(this).attr("placeholder"));
        });
        languageFields.each(function () {
            jqUnit.assertEquals("All language options have been rendered in a combo box", that.primaryResource.options.controlValues.length, $(this).find("option").length);
        });
    };

    fluid.tests.changeSrcByIndex = function (that, newSrcValue, index) {
        that.container.find("input").eq(index).val(newSrcValue).change();
    };

    fluid.tests.changeLanguageByIndex = function (that, newLanguageValue, index) {
        that.container.find("select").eq(index).find("[value='" + newLanguageValue + "']").attr("selected", "selected").change();
    };

    fluid.tests.checkModelValueByIndex = function (that, path, newSrcValue, index) {
        return function (newModel, oldModel, changeRequest) {
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", newSrcValue, fluid.get(newModel, ["resources", index, path]));
            jqUnit.assertTrue("The indicator state has been set to 'available'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));
        };
    };

    fluid.defaults("fluid.tests.captionsPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newSrcValue1: "http://weblink.com/one.mp4",
            newLanguage1: "hi",
            newSrcValue2: "http://weblink.com/two.mp4",
            newLanguage2: "zh"
        },
        modules: [{
            name: "Test initial captions panel",
            tests: [{
                expect: 7,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInitPanel",
                    event: "{captionsPanelTests captionsPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test captions panel",
            tests: [{
                expect: 8,
                name: "Click on captions input fields",
                sequence: [{
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newSrcValue1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{captionsPanel}", "src", "{that}.options.testOptions.newSrcValue1", 0],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newLanguage1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{captionsPanel}", "language", "{that}.options.testOptions.newLanguage1", 0],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newSrcValue2", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{captionsPanel}", "src", "{that}.options.testOptions.newSrcValue2", 1],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newLanguage2", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{captionsPanel}", "language", "{that}.options.testOptions.newLanguage2", 1],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.captionsPanelTests"
        ]);
    });

})(jQuery);
