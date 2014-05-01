/*!
Copyright 2014 OCAD University

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

    fluid.defaults("fluid.tests.resourceInputTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            resourceInput: {
                type: "fluid.metadata.resourceInput",
                container: ".gpiic-resourceInput",
                createOnEvent: "{resourceInputTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../src/html/resourceInput-template.html"
                        }
                    }
                }
            },
            resourceInputTester: {
                type: "fluid.tests.resourceInputTester"
            }
        }
    });

    fluid.tests.checkInit = function (that) {
        jqUnit.assertEquals("The placeholder for the input field is set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));
        jqUnit.assertEquals("All language options are rendered in a combo box", that.options.controlValues.length, that.locate("languages").find("option").length);
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
        };
    };

    fluid.defaults("fluid.tests.resourceInputTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        testOptions: {
            newSrcValue: "http://weblink.com/one.mp4",
            newLanguage: "hi"
        },
        modules: [{
            name: "Test resourceInputs",
            tests: [{
                expect: 2,
                name: "Init",
                sequence: [{
                    listener: "fluid.tests.checkInit",
                    event: "{resourceInputTests resourceInput}.events.afterRender"
                }]
            }]
        }, {
            name: "Test resourceInputs",
            tests: [{
                expect: 2,
                name: "Click on resource input fields",
                sequence: [{
                    func: "fluid.tests.changeSrc",
                    args: ["{resourceInput}", "{that}.options.testOptions.newSrcValue"]
                }, {
                    listenerMaker: "fluid.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newSrcValue"],
                    spec: {path: "src", priority: "last"},
                    changeEvent: "{resourceInput}.applier.modelChanged"
                }, {
                    func: "fluid.tests.changeLanguage",
                    args: ["{resourceInput}", "{that}.options.testOptions.newLanguage"]
                }, {
                    listenerMaker: "fluid.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newLanguage"],
                    spec: {path: "language", priority: "last"},
                    changeEvent: "{resourceInput}.applier.modelChanged"
                }]
            }]
        }]
    });

    var baseResources = {
        template: {
            url: "../../src/html/resourceInputPanel-base-template.html"
        },
        resourceInput: {
            url: "../../src/html/resourceInput-template.html"
        }
    };

    var verifyInitialBaseResourceState = function (that, styleClass) {
        jqUnit.assertEquals("The initial indicator model should be set correctly", "unavailable", that.indicator.model.value);
        jqUnit.assertTrue("The container class should have been applied", that.container.hasClass(styleClass));
    };

    var verifyModelChanges = function (that, expectedModel) {
        fluid.each(that.inputs, function (input, idx) {
            input.applier.requestChange("src", expectedModel.resources[idx].src);
        });
        jqUnit.assertDeepEq("The parent model should have been updated.", expectedModel, that.model);
        jqUnit.assertEquals("The indicator model should be updated correctly", "available", that.indicator.model.value);
    };

    jqUnit.asyncTest("baseResourceInputPanel", function () {
        jqUnit.expect(4);

        var newModel = {
            resources: [{
                src: "http://example.com/primary/video.mp4",
                language: "en"
            }, {
                src: "http://example.com/secondary/video.mp4",
                language: "en"
            }]
        };

        var styleClass = "fl-test-style";

        var that = fluid.metadata.baseResourceInputPanel(".gpiic-baseResourceInputPanel", {
            styles: {
                container: styleClass
            },
            resources: baseResources,
            listeners: {
                onReady: [{
                    listener: verifyInitialBaseResourceState,
                    args: ["{that}", styleClass],
                    priority: "last"
                }, {
                    listener: verifyModelChanges,
                    args: ["{that}", newModel],
                    priority: "last"
                }, {
                    listener: "jqUnit.start",
                    priority: "last"
                }]
            }
        });
    });

    jqUnit.test("transformation", function () {

        var modelTrue = {
            resources: [{
                src: "",
                language: "en"
            }, {
                src: "www.example.com/video.mp4",
                language: "fr"
            }]
        };

        var modelFalse = {
            resources: [{
                src: "",
                language: "en"
            }, {
                src: "",
                language: "fr"
            }]
        };

        var rules = {
            value: {
                transform: {
                    type: "fluid.transforms.find",
                    conditionPath: "resources",
                    innerPath: "src",
                    "true": "available",
                    "false": "unavailable"
                }
            }
        };

        var expectedTrue = {
            value: "available"
        };

        var expectedFalse = {
            value: "unavailable"
        };

        jqUnit.assertDeepEq("The model should be transformed", expectedTrue, fluid.model.transform(modelTrue, rules));
        jqUnit.assertDeepEq("The model should be transformed", expectedFalse, fluid.model.transform(modelFalse, rules));

    });

    var rsourceInputPanelResources = {
        template: {
            url: "../../src/html/resourceInputPanel-template.html"
        },
        resourceInput: {
            url: "../../src/html/resourceInput-template.html"
        }
    };

    // This test should have been included in fluid.tests.resourceInputPanelTester from
    // resourceInputPanelTestUtils.js. However at the time it wasn't possible to declare
    // listeners for multiple events (onReady, afterRender) in a sequence. This is because
    // all of these events are triggered by the creation of the parent compnoent.
    jqUnit.asyncTest("resourceInputPanel initialization", function () {
        var count = 0;
        var that = fluid.metadata.resourceInputPanel(".gpiic-resourceInputPanel-init", {
            dynamicComponents: {
                input: {
                    options: {
                        listeners: {
                            afterRender: {
                                listener: function (input) {
                                    fluid.tests.checkInitInput(input);
                                    count++;
                                    if (count >= that.model.resources.length) {
                                        jqUnit.start();
                                    }
                                }
                            }
                        }
                    }
                }
            },
            resources: rsourceInputPanelResources
        });
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "fluid.tests.resourceInputTests",
            "fluid.tests.resourceInputPanelTests"
        ]);
    });

})(jQuery);
