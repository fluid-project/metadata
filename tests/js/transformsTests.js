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

    jqUnit.module("Metadata Model Transformation");

    function testOneTransform(message, model, transform, method, expected, expandWrap) {
        if (expandWrap) {
            transform = {
                value: {
                    transform: transform
                }
            };
        }
        var transformed = fluid.model.transform(model, transform);
        jqUnit[method].apply(null, [message, expected, (expandWrap ? transformed.value : transformed) ]);
    }

    function testOneInversion (test) {
        var inverseRules = fluid.model.transform.invertConfiguration(test.transform);
        jqUnit.assertDeepEq(test.message + " -- inverted rules", test.invertedRules, inverseRules);
        if (test.fullyinvertible) {
            var transformed = fluid.model.transform(test.expected, inverseRules);
            jqUnit.assertDeepEq(test.message + " -- result transformation with inverse", test.model, transformed);
        }
    }

    var testOneStructure = function (tests) {
        fluid.each(tests, function (v) {
            testOneTransform(v.message, v.model, v.transform, v.method, v.expected, v.expandWrap);
            if (v.invertedRules) {
                testOneInversion(v);
            }
        });
    };

    var transformsTests = [{
        message: "A defined feature is transformed correctly",
        transform: {
            "highContrast": {
                transform: {
                    type: "fluid.metadata.transforms.decomposeFeatures",
                    feature: "highContrast",
                    inputPath: "metadata.features"
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.metadata.transforms.composeFeatures",
                outputPath: "metadata.features",
                feature: "highContrast"
            }]
        },
        fullyinvertible: true,
        model: {
            metadata: {
                features: ["highContrast"]
            }
        },
        expected: {
            highContrast: true
        },
        method: "assertDeepEq"
    }, {
        message: "An undefined features is transformed correctly",
        transform: {
            "signLanguage": {
                transform: {
                    type: "fluid.metadata.transforms.decomposeFeatures",
                    feature: "signLanguage",
                    inputPath: "metadata.features"
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.metadata.transforms.composeFeatures",
                outputPath: "metadata.features",
                feature: "signLanguage"
            }]
        },
        fullyinvertible: true,
        expected: {
            signLanguage: false
        },
        model: {
            metadata: {
                features: []
            }
        },
        method: "assertDeepEq"
    }, {
        message: "A feature with true value is transformed correctly",
        transform: {
            "metadata": {
                transform: {
                    type: "fluid.metadata.transforms.composeFeatures",
                    feature: "highContrast",
                    outputPath: "features"
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.metadata.transforms.decomposeFeatures",
                inputPath: "metadata.features",
                outputPath: "highContrast",
                feature: "highContrast"
            }]
        },
        fullyinvertible: true,
        model: {
            highContrast: true
        },
        expected: {
            metadata: {
                features: ["highContrast"]
            }
        },
        method: "assertDeepEq"
    }, {
        message: "A feature with false value is transformed correctly",
        transform: {
            "metadata": {
                transform: {
                    type: "fluid.metadata.transforms.composeFeatures",
                    feature: "signLanguage",
                    outputPath: "features"
                }
            }
        },
        invertedRules: {
            transform: [{
                type: "fluid.metadata.transforms.decomposeFeatures",
                inputPath: "metadata.features",
                outputPath: "signLanguage",
                feature: "signLanguage"
            }]
        },
        fullyinvertible: true,
        model: {
            signLanguage: false
        },
        expected: {
            metadata: {
                features: []
            }
        },
        method: "assertDeepEq"
    }];

    jqUnit.test("Metadata transforms tests", function () {
        testOneStructure(transformsTests);
    });

})(jQuery);
