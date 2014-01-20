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

    /*************************************************
     * The panel to define captions related metadata *
     *************************************************/

    // todo: The creation of captionInput sub-components should be generalized, perhaps by
    // using dynamic components, due to their similarity.
    fluid.defaults("fluid.metadata.captionsPanel", {
        gradeNames: ["fluid.metadata.resourceInputPanel", "autoInit"],
        components: {
            primaryResource: {
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: "{captionsPanel}.options.strings.resources"
                }
            },
            secondaryResource: {
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: "{captionsPanel}.options.strings.resources"
                }
            },
            indicator: {
                createOnEvent: "afterMarkupReady",
                options: {
                    tooltipContent: "{captionsPanel}.options.strings.tooltip"
                }
            }
        },
        strings: {
            title: "Captions",
            description: "Captions provide a synchronized, equivalent text version of spoken word in a video.",
            tooltip: {
                captionsAvailable: "Captions are available in this video.",
                captionsUnavailable: "Captions are not available in this video."
            },
            resources: {
                srcLabel: "Enter web link to caption:",
                languagesLabel: "Select language:",
                srcPlaceholder: "www.example.com/movie.srt",
                languages: ["Arabic", "Chinese", "English", "French", "Hindi", "Spanish"]
            }
        },
        resources: {
            template: {
                src: "../html/captions-template.html",
                forceCache: true
            }
        },
        events: {
            afterMarkupReady: null
        },
        listeners: {
            "onCreate.init": "fluid.metadata.captionsPanel.init"
        }
    });

    fluid.metadata.captionsPanel.init = function (that) {
        fluid.fetchResources(that.options.resources, function (resourceSpec) {
            that.container.append(resourceSpec.template.resourceText);
            that.events.afterMarkupReady.fire(that);
        });
    };

})(jQuery, fluid_1_5);
