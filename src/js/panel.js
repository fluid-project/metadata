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

    fluid.defaults("fluid.metadata.basePanel", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        components: {
            indicator: {
                type: "fluid.metadata.indicator",
                container: "{basePanel}.dom.indicator"
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

    /**********************************************************************************
     * Another panel grade component that brings the base panel grade one step further
     * with auto-generating the indicator model by transforming the panel model.
     **********************************************************************************/

    fluid.defaults("fluid.metadata.panel", {
        gradeNames: ["fluid.metadata.basePanel", "autoInit"],
        components: {
            indicator: {
                options: {
                    model: {
                        expander: {
                            funcName: "{that}.transformPanelModel"
                        }
                    },
                    invokers: {
                        transformPanelModel: {
                            funcName: "fluid.metadata.panel.transformPanelModel",
                            args: ["{panel}.model", "{panel}.options.indicatorModelRules"]
                        }
                    },
                    modelListeners: {
                        "{panel}.model.*": {
                            func: "fluid.metadata.panel.updateModel",
                            args: ["{that}"]
                        }
                    }
                }
            }
        }
    });

    fluid.metadata.panel.updateModel = function (that) {
        var model = that.transformPanelModel();
        that.applier.requestChange("value", model.value);
    };

    fluid.metadata.panel.transformPanelModel = function (panelModel, transformationRules) {
        return transformationRules ? fluid.model.transform(panelModel, transformationRules) : panelModel;
    };

})(jQuery, fluid_1_5);
