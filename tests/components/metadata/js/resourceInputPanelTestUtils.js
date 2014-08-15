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

    gpii.tests.checkInitPanel = function (that) {
        jqUnit.assertEquals("The title should have been rendered", that.options.strings.title, that.locate("title").text());
        jqUnit.assertEquals("The description should have been rendered", that.options.strings.description, that.locate("description").text());
        jqUnit.assertTrue("The indicator state has been set to 'unavailable'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
    };

    gpii.tests.checkInitInput = function (that) {
        jqUnit.assertEquals("The placeholder for the input field has been set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));

        $("select", that.locate("languages")).each(function (selectIdx, selectElm) {
            $(selectElm).find("option").each(function(idx, optElm){
                var actualVal = $(optElm).val();
                jqUnit.assertEquals("The language option '" + actualVal + "' should have been rendered in select element #" + selectIdx, that.input.options.controlValues[idx], actualVal);
            });
        });
    };

    gpii.tests.checkResourcePanelInit = function (that) {
        gpii.tests.checkInitPanel(that);
        gpii.tests.checkInitInput(that);
    };

    gpii.tests.changeSrcByIndex = function (that, newSrcValue, index) {
        that.container.find("input").eq(index).val(newSrcValue).change();
    };

    gpii.tests.changeLanguageByIndex = function (that, newLanguageValue, index) {
        that.container.find("select").eq(index).find("[value='" + newLanguageValue + "']").prop("selected", "selected").change();
    };

    gpii.tests.makeAssertModelChanges = function (that, path, expected) {
        return function (newModel) {
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", expected, fluid.get(newModel, path));
            jqUnit.assertTrue("The indicator state has been set to 'available'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));
        };
    };

    fluid.defaults("gpii.tests.resourceInputPanelTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            resourceInputPanel: {
                type: "gpii.metadata.resourceInputPanel",
                container: ".gpiic-resourceInputPanel",
                createOnEvent: "{resourceInputPanelTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/metadata/html/resourceInputPanel-template.html"
                        },
                        resourceInput: {
                            url: "../../../../src/components/metadata/html/resourceInput-template.html"
                        }
                    }
                }
            },
            resourceInputPanelTester: {
                type: "gpii.tests.resourceInputPanelTester"
            }
        }
    });

    fluid.defaults("gpii.tests.resourceInputPanelTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOpts: [
            {src: "http://weblink.com/one.mp4", language: "hi"},
            {src: "http://weblink.com/two.mp4", language: "zh"}
        ],
        modules: [{
            name: "Test resourceInputPanel",
            tests: [{
                expect: 16,
                name: "Initialization",
                sequence: [{
                    listener: "gpii.tests.checkResourcePanelInit",
                    event: "{resourceInputPanelTests resourceInputPanel}.events.onReady"
                }]
            }, {
                expected: 2,
                name: "Model Changes",
                sequence: [{
                    func: "gpii.tests.changeSrcByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOpts.0.src", 0]
                }, {
                    listenerMaker: "gpii.tests.makeAssertModelChanges",
                    makerArgs: ["{resourceInputPanel}", "resources.0.src", "{that}.options.testOpts.0.src"],
                    spec: {path: "", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "gpii.tests.changeLanguageByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOpts.0.language", 0]
                }, {
                    listenerMaker: "gpii.tests.makeAssertModelChanges",
                    makerArgs: ["{resourceInputPanel}", "resources.0.language", "{that}.options.testOpts.0.language"],
                    spec: {path: "", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "gpii.tests.changeSrcByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOpts.1.src", 1]
                }, {
                    listenerMaker: "gpii.tests.makeAssertModelChanges",
                    makerArgs: ["{resourceInputPanel}", "resources.1.src", "{that}.options.testOpts.1.src"],
                    spec: {path: "", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }, {
                    func: "gpii.tests.changeLanguageByIndex",
                    args: ["{resourceInputPanel}", "{that}.options.testOpts.1.language", 1]
                }, {
                    listenerMaker: "gpii.tests.makeAssertModelChanges",
                    makerArgs: ["{resourceInputPanel}", "resources.1.language", "{that}.options.testOpts.1.language"],
                    spec: {path: "", priority: "last"},
                    changeEvent: "{resourceInputPanel}.applier.modelChanged"
                }]
            }]

        }]
    });

})(jQuery, fluid);
