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

    fluid.registerNamespace("fluid.metadata");

    /*******************************************************************************
     * The base panel component for metadata panels
     *******************************************************************************/

    fluid.defaults("fluid.metadata.panel", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        components: {
            indicator: {
                type: "fluid.metadata.indicator",
                container: "{panel}.dom.indicator",
                options: {
                    model: {
                        expander: {
                            funcName: "fluid.model.transform",
                            args: ["{panel}.model", "{panel}.options.indicatorModelRules"]
                        }
                    },
                    invokers: {
                        updateModel: {
                            funcName: "fluid.metadata.panel.updateIndicatorModel",
                            args: ["{that}", "{arguments}.0", "{arguments}.1"]
                        }
                    },
                    modelListeners: {
                        "{panel}.model.*": {
                            func: "{that}.updateModel",
                            args: ["{panel}.model", "{panel}.options.indicatorModelRules"]
                        }
                    }
                }
            }
        },
        strings: {
            title: "A panel title"
        },
        selectors: {
            title: ".flc-panel-title",
            indicator: ".flc-panel-indicator"
        },
        listeners: {
            "onCreate.setTitle": {
                "this": "{that}.dom.title",
                "method": "text",
                "args": ["{that}.options.strings.title"]
            }
        }
    });

    fluid.metadata.panel.updateIndicatorModel = function (that, change, transformationRules) {
        var model = transformationRules ? fluid.model.transform(change, transformationRules) : change;
        that.applier.requestChange("value", model.value);
    };


})(jQuery, fluid_1_5);
