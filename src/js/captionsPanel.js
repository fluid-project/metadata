/*
Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};


(function ($, fluid) {

    /*************************************************
     * The panel to define captions related metadata *
     *************************************************/

    fluid.defaults("fluid.metadata.captionsPanel", {
        gradeNames: ["fluid.metadata.resourceInputPanel", "autoInit"],
        strings: {
            title: "Captions",
            description: "Captions provide a synchronized, equivalent text version of spoken word in a video.",
            tooltip: {
                available: "Captions are available in this video.",
                unavailable: "Captions are not available in this video."
            },
            resourceInput: {
                srcLabel: "Enter web link to caption:",
                languagesLabel: "Select language:",
                srcPlaceholder: "www.example.com/movie.srt",
                languages: ["Arabic", "Chinese", "English", "French", "Hindi", "Spanish"]
            }
        },
        styles: {
            container: "fl-captionsPanel"
        }
    });

})(jQuery, fluid);
