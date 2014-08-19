/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    fluid.defaults("gpii.tests.resourceInputTests", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        components: {
            resourceInput: {
                type: "gpii.metadata.resourceInput",
                container: ".gpiic-resourceInput",
                createOnEvent: "{resourceInputTester}.events.onTestCaseStart",
                options: {
                    resources: {
                        template: {
                            url: "../../../../src/components/metadata/html/resourceInput-template.html"
                        }
                    }
                }
            },
            resourceInputTester: {
                type: "gpii.tests.resourceInputTester"
            }
        }
    });

    gpii.tests.checkInit = function (that) {
        jqUnit.assertEquals("The placeholder for the input field is set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));
        jqUnit.assertEquals("All language options are rendered in a combo box", that.options.controlValues.length, that.locate("languages").find("option").length);
    };

    gpii.tests.changeSrc = function (that, newSrcValue) {
        that.locate("src").val(newSrcValue).change();
    };

    gpii.tests.changeLanguage = function (that, newLanguageValue) {
        that.locate("languages").find("[value='" + newLanguageValue + "']").prop("selected", "selected").change();
    };

    gpii.tests.checkModelValue = function (newSrcValue) {
        return function (newModel, oldModel, changeRequest) {
            var path = changeRequest[0];
            jqUnit.assertEquals("The model path '" + path + "' has been updated to the new value", newSrcValue, newModel);
        };
    };

    fluid.defaults("gpii.tests.resourceInputTester", {
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
                    listener: "gpii.tests.checkInit",
                    event: "{resourceInputTests resourceInput}.events.afterRender"
                }]
            }]
        }, {
            name: "Test resourceInputs",
            tests: [{
                expect: 2,
                name: "Click on resource input fields",
                sequence: [{
                    func: "gpii.tests.changeSrc",
                    args: ["{resourceInput}", "{that}.options.testOptions.newSrcValue"]
                }, {
                    listenerMaker: "gpii.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newSrcValue"],
                    spec: {path: "src", priority: "last"},
                    changeEvent: "{resourceInput}.applier.modelChanged"
                }, {
                    func: "gpii.tests.changeLanguage",
                    args: ["{resourceInput}", "{that}.options.testOptions.newLanguage"]
                }, {
                    listenerMaker: "gpii.tests.checkModelValue",
                    makerArgs: ["{that}.options.testOptions.newLanguage"],
                    spec: {path: "language", priority: "last"},
                    changeEvent: "{resourceInput}.applier.modelChanged"
                }]
            }]
        }]
    });

    var baseResources = {
        template: {
            url: "../../../../src/components/metadata/html/resourceInputPanel-base-template.html"
        },
        resourceInput: {
            url: "../../../../src/components/metadata/html/resourceInput-template.html"
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

        gpii.metadata.baseResourceInputPanel(".gpiic-baseResourceInputPanel", {
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

    gpii.tests.inputCount = 0;
    gpii.tests.verifyInput = function (input, resources) {
        gpii.tests.checkInitInput(input);
        gpii.tests.inputCount++;
        if (gpii.tests.inputCount >= resources.length) {
            gpii.tests.inputCount = 0;
            jqUnit.start();
        }
    };

    fluid.defaults("gpii.tests.resrouceInputPanelInitializationTest", {
        gradeNames: ["gpii.metadata.resourceInputPanel", "autoInit"],
        inputListeners: {
            afterRender: {
                listener: "gpii.tests.verifyInput",
                args: ["{resourceInput}", "{resourceInputPanel}.model.resources"]
            }
        },
        resources: {
            template: {
                url: "../../../../src/components/metadata/html/resourceInputPanel-template.html"
            },
            resourceInput: {
                url: "../../../../src/components/metadata/html/resourceInput-template.html"
            }
        },
        distributeOptions: [{
            source: "{that}.options.resources.resourceInput.url",
            target: "{that > resourceInput}.options.resources.template.url"
        }, {
            source: "{that}.options.inputListeners",
            target: "{that > resourceInput}.options.listeners"
        }]
    });

    // This test should have been included in gpii.tests.resourceInputPanelTester from
    // resourceInputPanelTestUtils.js. However at the time it wasn't possible to declare
    // listeners for multiple events (onReady, afterRender) in a sequence. This is because
    // all of these events are triggered by the creation of the parent compnoent.
    // See: FLUID-5340
    jqUnit.asyncTest("resourceInputPanel initialization", function () {
        gpii.tests.resrouceInputPanelInitializationTest(".gpiic-resourceInputPanel-init");
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.resourceInputTests",
            "gpii.tests.resourceInputPanelTests"
        ]);
    });

})(jQuery, fluid);
