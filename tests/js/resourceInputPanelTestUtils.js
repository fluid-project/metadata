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

    fluid.defaults("fluid.tests.resourceInputPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            resourceInputPanel: {
                type: "fluid.metadata.resourceInputPanel",
                container: ".flc-resourceInputPanel",
                createOnEvent: "{resourceInputPanelTester}.events.onTestCaseStart",
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
            resourceInputPanelTester: {
                type: "fluid.tests.resourceInputPanelTester"
            }
        }
    });

    fluid.tests.checkInitPanel = function (that) {
        var srcFields = that.container.find("input");
        var languageFields = that.container.find("select");

        jqUnit.assertEquals("The title should have been rendered", that.options.strings.title, that.locate("title").text());
        jqUnit.assertEquals("The description should have been rendered", that.options.strings.description, that.locate("description").text());
        jqUnit.assertEquals("Two src fields have been rendered", 2, srcFields.length);
        jqUnit.assertEquals("Two language fields have been rendered", 2, languageFields.length);
        jqUnit.assertTrue("The indicator state has been set to 'unavailable'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));

        srcFields.each(function (idx, elm) {
            jqUnit.assertEquals("The placeholder for the input field has been set", that.primaryResource.options.strings.srcPlaceholder, $(elm).attr("placeholder"));
        });

        languageFields.each(function (idx, elm) {
            $("option", elm).each(function (idx, optElm) {
                jqUnit.assertEquals("All language option should have been rendered in a combo box", that.primaryResource.options.controlValues[idx], $(optElm).val());
            });
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

    fluid.defaults("fluid.tests.resourceInputPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newSrcValue1: "http://weblink.com/one.mp4",
            newLanguage1: "hi",
            newSrcValue2: "http://weblink.com/two.mp4",
            newLanguage2: "zh"
        },
        modules: [{
            name: "Test initial resourceInput panel",
            tests: [{
                expect: 19,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInitPanel",
                    event: "{resourceInputPanelTests resourceInputPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test resourceInput panel",
            tests: [{
                expect: 8,
                name: "Click on resource input fields",
                sequence: [{
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOptions.newSrcValue1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{resourceInputPanel}", "src", "{that}.options.testOptions.newSrcValue1", 0],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOptions.newLanguage1", 0]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{resourceInputPanel}", "language", "{that}.options.testOptions.newLanguage1", 0],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeSrcByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOptions.newSrcValue2", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{resourceInputPanel}", "src", "{that}.options.testOptions.newSrcValue2", 1],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguageByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOptions.newLanguage2", 1]
                }, {
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{resourceInputPanel}", "language", "{that}.options.testOptions.newLanguage2", 1],
                    spec: {path: "resources", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }]
            }]
        }]
    });

})(jQuery);
