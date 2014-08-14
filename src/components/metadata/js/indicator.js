/*
Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.metadata");

    /*******************************************************************************
     * The graphic indicator to show the availability of a metadata
     *******************************************************************************/

    fluid.defaults("gpii.metadata.indicator", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        members: {
            tooltip: {
                expander: {
                    func: "fluid.tooltip",
                    args: ["{that}.container", {
                        expander: {
                            func: "gpii.metadata.indicator.getTooltipOptions",
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
                funcName: "gpii.metadata.indicator.applyChange",
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

    gpii.metadata.indicator.applyChange = function (that, state) {
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

    gpii.metadata.indicator.getTooltipOptions = function (tooltipOptions, tooltipContent, state) {
        return $.extend(true, {}, tooltipOptions, {content: tooltipContent[state]});
    };

})(jQuery, fluid);
