/*!
Copyright 2013 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.tests");

    jqUnit.module("Metadata Model Transformation");

    var invertConditionTests = [{
        message: "A conditional transform with inversion",
        rules: {
            transform: {
                type: "fluid.metadata.transforms.condition",
                conditionPath: "hasHazard",
                "true": {
                    transform: {
                        type: "fluid.transforms.literalValue",
                        value: "flashing",
                        outputPath: "hazard"
                    }
                },
                "false": {
                    transform: {
                        type: "fluid.transforms.literalValue",
                        value: "noFlashing",
                        outputPath: "hazard"
                    }
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.transforms.valueMapper",
                inputPath: "hazard",
                options: {
                    "flashing": {
                        outputValue: {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "hasHazard"
                            }]
                        }
                    },
                    "noFlashing": {
                        outputValue: {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "hasHazard"
                            }]
                        }
                    }
                }
            }]
        },
        expectPerfectInversion: true,
        model: {
            hasHazard: true
        },
        expected: {
            hazard: "flashing"
        },
        method: "assertDeepEq"
    }, {
        message: "A nested conditional transform with inversion",
        rules: {
            transform: {
                type: "fluid.metadata.transforms.condition",
                conditionPath: "audio",
                "true": {
                    transform: {
                        type: "fluid.metadata.transforms.condition",
                        conditionPath: "sound",
                        "true": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "available",
                                outputPath: "audio"
                            }
                        },
                        "false": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "unknown",
                                outputPath: "audio"
                            }
                        }
                    }
                },
                "false": {
                    transform: {
                        type: "fluid.metadata.transforms.condition",
                        conditionPath: "nosoundHazard",
                        "true": {
                            transform: {
                                type: "fluid.transforms.literalValue",
                                value: "unavailable",
                                outputPath: "audio"
                            }
                        }
                    }
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.transforms.valueMapper",
                inputPath: "audio",
                options: {
                    "available": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "sound"
                            }]
                        }
                    },
                    "unknown": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "sound"
                            }]
                        }
                    },
                    "unavailable": {
                        "outputValue": {
                            transform: [{
                                type: "fluid.transforms.literalValue",
                                value: false,
                                outputPath: "audio"
                            }, {
                                type: "fluid.transforms.literalValue",
                                value: true,
                                outputPath: "nosoundHazard"
                            }]
                        }
                    }
                }
            }]
        },
        expectPerfectInversion: true,
        model: {
            audio: false,
            nosoundHazard: true
        },
        expected: {
            audio: "unavailable"
        },
        method: "assertDeepEq"
    }];

    var testInvertConditions = function (json) {
        var description = json.message;
        var transformed = fluid.model.transformWithRules(json.model, json.rules);
        jqUnit.assertDeepEq(description + " forward transformation", json.expected, transformed);
        var inverseRules = fluid.model.transform.invertConfiguration(json.rules);
        jqUnit.assertDeepEq(description + " inverted rules", json.invertedRules, inverseRules);
        if (json.expectPerfectInversion === true) {
            var inverseTransformed = fluid.model.transformWithRules(json.expected, json.invertedRules);
            jqUnit.assertDeepEq(description + " inverted transformation", json.model, inverseTransformed);
        }
    };

    jqUnit.test("Customized invertible conditional transform tests", function () {
        fluid.each(invertConditionTests, function (v) {
            testInvertConditions(v);
        });
    });

    fluid.defaults("fluid.tests.simpleRelay", {
        gradeNames: ["fluid.standardRelayComponent", "autoInit"],
        model: {
            flashing: false,
            noFlashing: false
        },
        components: {
            sub: {
                type: "fluid.standardRelayComponent",
                options: {
                    modelRelay: [{
                        source: "{simpleRelay}.model",
                        target: "{that}.model",
                        singleTransform: {
                            type: "fluid.metadata.transforms.condition",
                            conditionPath: "flashing",
                            "true": {
                                transform: {
                                    type: "fluid.transforms.literalValue",
                                    value: "flashing",
                                    outputPath: "flashing"
                                }
                            },
                            "false": {
                                transform: {
                                    type: "fluid.metadata.transforms.condition",
                                    conditionPath: "noFlashing",
                                    "true": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "noFlashing",
                                            outputPath: "flashing"
                                        }
                                    },
                                    "false": {
                                        transform: {
                                            type: "fluid.transforms.literalValue",
                                            value: "unknown",
                                            outputPath: "flashing"
                                        }
                                    }
                                }
                            }
                        }
                    }]
                }
            }
        }
    });

    jqUnit.test("Model relay with the customized invertible conditional transform", function () {
        var that = fluid.tests.simpleRelay();

        // Transformation from the parent component to the sub component
        var unknownSubModel = {
            flashing: "unknown"
        };
        var flashingSubModel = {
            flashing: "flashing"
        };
        var noFlashingSubModel = {
            flashing: "noFlashing"
        };

        jqUnit.assertDeepEq("The initial forward transformation is performed correctly - unknown", unknownSubModel, that.sub.model);

        that.applier.change("flashing", true);
        jqUnit.assertDeepEq("The forward transformation is performed correctly - flashing", flashingSubModel, that.sub.model);

        that.applier.change("flashing", false);
        that.applier.change("noFlashing", true);
        jqUnit.assertDeepEq("The forward transformation is performed correctly - noFlashing", noFlashingSubModel, that.sub.model);

        // Transformation from the sub component to the parent component

        var unknownParentModel = {
            "flashing": false,
            "noFlashing": false
        };
        var flashingParentModel = {
            "flashing": true,
            "noFlashing": false
        };
        var noFlashingParentModel = {
            "flashing": false,
            "noFlashing": true
        };

        that.sub.applier.change("flashing", "unknown");
        jqUnit.assertDeepEq("The inverted relay from the sub to the parent component is performed correctly - unknown", unknownParentModel, that.model);

        that.sub.applier.change("flashing", "flashing");
        jqUnit.assertDeepEq("The inverted relay from the sub to the parent component is performed correctly - flashing", flashingParentModel, that.model);

        that.sub.applier.change("flashing", "noFlashing");
        jqUnit.assertDeepEq("The inverted relay from the sub to the parent component is performed correctly - noFlashing", noFlashingParentModel, that.model);
    });

})(jQuery, fluid);
