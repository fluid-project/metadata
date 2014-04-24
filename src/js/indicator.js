/*
Copyright 2013 OCAD University

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
     * The graphic indicator to show the availability of a metadata
     *******************************************************************************/

    fluid.defaults("fluid.metadata.indicator", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        members: {
            tooltip: {
                expander: {
                    func: "fluid.tooltip",
                    args: ["{that}.container", {
                        expander: {
                            func: "fluid.metadata.indicator.getTooltipOptions",
                            args: ["{that}.options.tooltipOptions", "{that}.options.strings.tooltipContent", "unknown"]
                        }
                    }]
                }
            }
        },
        strings: {
            tooltipContent: {
                available: "Available",
                unavailable: "Unavailable",
                unknown: "Unknown"
            }
        },
        tooltipOptions: {
            delay: 0,
            styles: {
                tooltip: "gpii-tooltip"
            }
        },
        styles: {
            circle: "gpii-circle",
            indicatorState: {
                available: "gpii-available",
                unavailable: "gpii-unavailable",
                unknown: "gpii-unknown"
            }
        },
        invokers: {
            applyChange: {
                funcName: "fluid.metadata.indicator.applyChange",
                args: ["{that}", "{arguments}.0"]
            }
        },
        listeners: {
            "onCreate.makeCircle": {
                "this": "{that}.container",
                method: "addClass",
                args: "{that}.options.styles.circle"
            },
            "onCreate.setDefaultState": {
                listener: "{that}.applyChange",
                args: ["{that}.model.value"],
                dynamic: true
            }
        },
        modelListeners: {
            value: {
                func: "{that}.applyChange",
                args: ["{change}.value"]
            }
        }
    });

    fluid.metadata.indicator.applyChange = function (that, state) {
        if (!state) {
            return;
        }

        var stateClasses = that.options.styles.indicatorState;

        fluid.each(stateClasses, function (state) {
            that.container.removeClass(state);
        });
        that.container.addClass(stateClasses[state]);
        that.tooltip.updateContent(that.options.strings.tooltipContent[state]);
    };

    fluid.metadata.indicator.getTooltipOptions = function (tooltipOptions, tooltipContent, state) {
        return $.extend(true, {}, tooltipOptions, {content: tooltipContent[state]});
    };

})(jQuery, fluid_1_5);
