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

    fluid.defaults("fluid.metadata.transforms.condition", {
        gradeNames: ["fluid.transforms.condition", "fluid.lens"],
        invertConfiguration: "fluid.metadata.transforms.condition.invert"
    });

    fluid.metadata.transforms.condition = fluid.transforms.condition;

    fluid.metadata.transforms.condition.createLiteralTransform = function (outputPath, outputValue) {
        return {
            type: "fluid.transforms.literalValue",
            value: outputValue,
            outputPath: outputPath
        };
    };

    fluid.metadata.transforms.condition.processOneCondition = function (togo, transformSpec, mapOptionTransform) {
        var type = fluid.get(transformSpec, "type");
        if (type === "fluid.transforms.literalValue") {
            fluid.set(togo, "inputPath", fluid.get(transformSpec, "outputPath"));
            var optionKey = fluid.get(transformSpec, "value");
            fluid.set(togo, ["options", optionKey, "outputValue", "transform"], mapOptionTransform);
        } else if (type === "fluid.metadata.transforms.condition") {
            var conditionPath = fluid.get(transformSpec, "conditionPath");
            fluid.each(transformSpec, function (value, key) {
                if (key === "true" || key === "false") {
                    var keyTree = fluid.get(transformSpec, key);

                    if (keyTree) {
                        var nextMapOptionTransform = fluid.copy(mapOptionTransform);
                        nextMapOptionTransform.push(fluid.metadata.transforms.condition.createLiteralTransform(conditionPath, key === "true" ? true : false));
                        togo = fluid.metadata.transforms.condition.processOneCondition(togo, fluid.get(keyTree, "transform"), nextMapOptionTransform);
                    }
                }
            });
        }
        return togo;
    };

    fluid.metadata.transforms.condition.invert = function (transformSpec, transform) {
        var togo = {
                type: "fluid.transforms.valueMapper"
            };

        var conditionPath = fluid.get(transformSpec, "conditionPath");

        fluid.each(transformSpec, function (value, key) {
            if (key === "true" || key === "false") {
                var keyTree = fluid.get(transformSpec, key);

                if (keyTree) {
                    var mapOptionTransform = [];
                    mapOptionTransform.push(fluid.metadata.transforms.condition.createLiteralTransform(conditionPath, key === "true" ? true : false));
                    togo = fluid.metadata.transforms.condition.processOneCondition(togo, fluid.get(keyTree, "transform"), mapOptionTransform);
                }
            }
        });
        return togo;
    };

})(jQuery, fluid_1_5);
