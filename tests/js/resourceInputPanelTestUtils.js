/*!
Copyright 2013-2014 OCAD University

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
                container: ".gpiic-resourceInputPanel",
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
        jqUnit.assertEquals("The title should have been rendered", that.options.strings.title, that.locate("title").text());
        jqUnit.assertEquals("The description should have been rendered", that.options.strings.description, that.locate("description").text());
        jqUnit.assertTrue("The indicator state has been set to 'unavailable'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
    };

    fluid.tests.checkInitInput = function (that) {
        jqUnit.assertEquals("The placeholder for the input field has been set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));

        $("option", that.locate("languages")).each(function (idx, optElm) {
            jqUnit.assertEquals("All language option should have been rendered in a combo box", that.options.controlValues[idx], $(optElm).val());
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
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", newSrcValue, fluid.get(newModel[0], path));
            jqUnit.assertTrue("The indicator state has been set to 'available'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));
        };
    };

    fluid.tests.testOptions = [
        {src: "http://weblink.com/one.mp4", language: "hi"},
        {src: "http://weblink.com/two.mp4", language: "zh"}
    ];
    fluid.tests.testSequenceConfig = [
        {check: "fluid.tests.changeSrcByIndex", path: "src"},
        {check: "fluid.tests.changeLanguageByIndex", path: "language"}
    ];

    fluid.tests.resourceInputPanelSequenceGenerator = function (testOpts, sequenceConfig) {
        var generatedSequence = [];
        fluid.each(testOpts, function (testOpt, index) {
            fluid.each(sequenceConfig, function (config) {
                var testVal = testOpts[index][config.path];
                generatedSequence.push({
                    func: config.check,
                    args:["{resourceInputPanel}", testVal, index]
                });
                generatedSequence.push({
                    listenerMaker: "fluid.tests.checkModelValueByIndex",
                    makerArgs: ["{resourceInputPanel}", config.path, testVal, index],
                    spec: {transactional: true, path: "resources", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                });
            });
        });
        return generatedSequence;
    };

    fluid.defaults("fluid.tests.resourceInputPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Test initial resourceInput panel",
            tests: [{
                expect: 3,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInitPanel",
                    spec: {priority: "last"},
                    event: "{resourceInputPanelTests resourceInputPanel}.events.onReady"
                }]
            }]
        }, {
            name: "Test resourceInput panel",
            tests: [{
                expect: 8,
                name: "Click on resource input fields",
                sequence: fluid.tests.resourceInputPanelSequenceGenerator(fluid.tests.testOptions, fluid.tests.testSequenceConfig)
            }]
        }]
    });

})(jQuery);
