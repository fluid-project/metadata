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
                createOnEvent: "{captionsInputTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../src/html/captions-input-template.html"
                        }
                    }
                }
            },
            captionsInputTester: {
                type: "fluid.tests.captionsInputTester"
            }
        }
    });

    fluid.tests.checkInit = function (that) {
        jqUnit.assertEquals("The placeholder for the input field is set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));
        jqUnit.assertEquals("All language options are rendered in a combo box", that.options.controlValues.length, that.locate(languages).find("option").length);
    };

    fluid.tests.changeSrc = function (that, newSrcValue) {
        that.locate("src").val(newSrcValue).change();
    };

    fluid.tests.changeLanguage = function (that, newLanguageValue) {
        that.locate("languages").find("[value='" + newLanguageValue + "']").attr("selected", "selected").change();
    };

    fluid.tests.checkModelValue = function (newSrcValue) {
        return function (newModel, oldModel, changeRequest) {
            var path = changeRequest[0].path;
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", newSrcValue, fluid.get(newModel, path));
        }
    };

    fluid.defaults("fluid.tests.captionsInputTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newSrcValue: "http://weblink.com/one.mp4",
            newLanguage: "hi"
        },
        modules: [{
            name: "Test captions input fields panel",
            tests: [{
                expect: 2,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInit",
                    event: "{captionsInputTests captionsInput}.events.afterRender"
                }]
            }]
        }, {
            name: "Test captions input panel",
            tests: [{
                expect: 2,
                name: "Click on captions input fields",
                sequence: [{
                    func: "fluid.tests.changeSrc",
                    args: ["{captionsInput}", "{that}.options.testOptions.newSrcValue"]
                }, {
                    listenerMaker: "fluid.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newSrcValue"],
                    spec: {path: "src", priority: "last"},
                    changeEvent: "{captionsInput}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguage",
                    args: ["{captionsInput}", "{that}.options.testOptions.newLanguage"]
                }, {
                    listenerMaker: "fluid.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newLanguage"],
                    spec: {path: "language", priority: "last"},
                    changeEvent: "{captionsInput}.applier.modelChanged"
                }]
            }]
        }]
    });

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
                            url: "../../src/html/captions-template.html"
                        }
                    },
                    captionsInputTemplate: "../../src/html/captions-input-template.html"
                }
            },
            captionsPanelTester: {
                type: "fluid.tests.captionsPanelTester"
            }
        }
    });

    fluid.tests.checkInitPanel = function (that) {
        var srcFields = that.container.find("input");
        var languageFields = that.container.find("select");;

        jqUnit.assertEquals("Two src fields have been rendered", 2, srcFields.length);
        jqUnit.assertEquals("Two language fields have been rendered", 2, languageFields.length);
        srcFields.each(function () {
            jqUnit.assertEquals("The placeholder for the input field has been set", that.input1.options.strings.srcPlaceholder, $(this).attr("placeholder"));
        });
        languageFields.each(function () {
            jqUnit.assertEquals("All language options have been rendered in a combo box", that.input1.options.controlValues.length, $(this).find("option").length);
        });
    };

    fluid.tests.changeSrcByIndex = function (that, newSrcValue, index) {
        that.container.find("input").eq(index).val(newSrcValue).change();
    };

    fluid.tests.changeLanguageByIndex = function (that, newLanguageValue, index) {
        that.container.find("select").eq(index).find("[value='" + newLanguageValue + "']").attr("selected", "selected").change();
    };

    fluid.tests.checkModelValueByIndex = function (path, newSrcValue, index) {
        return function (newModel, oldModel, changeRequest) {
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", newSrcValue, fluid.get(newModel, ["captions", index, path]));
        }
    };

    fluid.defaults("fluid.tests.captionsPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newSrcValue1: "http://weblink.com/one.mp4",
            newLanguage1: "hi",
            newSrcValue1: "http://weblink.com/two.mp4",
            newLanguage1: "zh"
        },
        modules: [{
            name: "Test initial captions panel",
            tests: [{
                expect: 6,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInitPanel",
                    event: "{captionsPanelTests captionsPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test captions panel",
            tests: [{
                expect: 4,
                name: "Click on captions input fields",
                sequence: [{
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newSrcValue1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["src", "{that}.options.testOptions.newSrcValue1", 0],
                    spec: {path: "captions", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newLanguage1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["language", "{that}.options.testOptions.newLanguage1", 0],
                    spec: {path: "captions", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newSrcValue1", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["src", "{that}.options.testOptions.newSrcValue1", 1],
                    spec: {path: "captions", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{captionsPanel}", "{that}.options.testOptions.newLanguage1", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["language", "{that}.options.testOptions.newLanguage1", 1],
                    spec: {path: "captions", priority: "last"},
                    changeEvent: "{captionsPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.captionsInputTests",
            "fluid.tests.captionsPanelTests"
        ]);
    });

})(jQuery);
