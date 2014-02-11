/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};


(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata.transforms");

    fluid.defaults("fluid.metadata.transforms.decomposeFeatures", {
        gradeNames: ["fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction"],
        invertConfiguration: "fluid.metadata.transforms.decomposeFeatures.invert"
    });

    fluid.metadata.transforms.decomposeFeatures = function (inputs, transformSpec, transform) {
        var inputValue = fluid.get(transform.source, transformSpec.inputPath);
        return $.inArray(transformSpec.feature, inputValue) !== -1;
    };

    fluid.metadata.transforms.decomposeFeatures.invert = function (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);
        togo.type = "fluid.metadata.transforms.composeFeatures";
        togo.outputPath = transformSpec.inputPath;
        delete togo.inputPath;
        return togo;
    };

    fluid.defaults("fluid.metadata.transforms.composeFeatures", {
        gradeNames: ["fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction"],
        invertConfiguration: "fluid.metadata.transforms.composeFeatures.invert"
    });

    fluid.metadata.transforms.composeFeatures = function (inputs, transformSpec, transform) {
        var inputValue = fluid.get(transform.source, transformSpec.feature),
            featureValue = [];

        if (inputValue) {
            featureValue.push(transformSpec.feature);
        }

        return featureValue;
    };

    fluid.metadata.transforms.composeFeatures.invert = function (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);
        togo.type = "fluid.metadata.transforms.decomposeFeatures";
        togo.inputPath = transform.outputPrefix + "." + transformSpec.outputPath;
        togo.outputPath = transformSpec.feature;
        return togo;
    };

})(jQuery, fluid_1_5);
