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
     * The panel to define video related metadata
     *******************************************************************************/

    fluid.defaults("fluid.metadata.videoPanel", {
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        model: {
            highContrast: false,
            signLanguage: false,
            flashing: "unknown", // flashing, noFlashing are alternatives
        },
        strings: {
            title: "video",
            instruction: "Select all that apply",
            highContrastLabel: "Video is high contrast which may improve visibility.",
            signLangLabel: "Video contains sign language translation.",
            flashingLabel: "Video has flashing visuals that some users may want to avoid",
            flashing: ["Yes", "No", "Not sure"]
        },
        controlValues: ["flashing", "noFlashing", "unknown"],
        selectors: {
            title: ".flc-video-title",
            icon: ".flc-video-icon",
            instruction: ".flc-instruction",
            highContrast: ".flc-highContrast",
            highContrastLabel: ".flc-highContrast-label",
            signLang: ".flc-signLang",
            signLangLabel: ".flc-signLang-label",
            flashingLabel: ".flc-flashing-label",
            flashingRow: ".flc-flashing-row",
            flashingInput: ".flc-flashing-input",
            flashingRowLabel: ".flc-flashingRow-label"
        },
        repeatingSelectors: ["flashingRow"],
        protoTree: {
            title: {messagekey: "title"},
            instruction: {messagekey: "instruction"},
            flashingLabel: {messagekey: "flashingLabel"},
            icon: {
                decorators: {
                    func: "fluid.metadata.indicator",
                    type: "fluid",
                    options: {
                        model: {
                            value: "available"
                        },
                        tooltipContent: {
                            "available": "Video attribute is available."
                        }
                    }
                }
            },
            highContrastLabel: {messagekey: "highContrastLabel"},
            highContrast: "${highContrast}",
            signLangLabel: {messagekey: "signLangLabel"},
            signLang: "${signLang}",
            expander: {
                type: "fluid.renderer.selection.inputs",
                rowID: "flashingRow",
                labelID: "flashingRowLabel",
                inputID: "flashingInput",
                selectID: "flashing-radio",
                tree: {
                    optionnames: "${{that}.options.strings.flashing}",
                    optionlist: "${{that}.options.controlValues}",
                    selection: "${flashing}"
                }
            }
        },
        resources: {
            template: {
                url: "../html/video-template.html"
            }
        },
        events: {
            onReady: {
                events: {
                    onCreate: "onCreate",
                    afterRender: "afterRender"
                },
                args: "{that}"
            }
        },
        listeners: {
            "onCreate.init": "fluid.metadata.videoPanel.init"
        },
        modelListeners: {
            "*": {
                func: "{that}.refreshView"
            }
        }
    });

    fluid.metadata.videoPanel.init = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.refreshView();
        });
    };

})(jQuery, fluid_1_5);
