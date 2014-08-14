/*
Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    /****************************************************
     * The panel to define transcripts related metadata *
     ****************************************************/

    fluid.defaults("gpii.metadata.transcriptsPanel", {
        gradeNames: ["gpii.metadata.resourceInputPanel", "autoInit"],
        strings: {
            title: "Transcripts",
            description: "Transcripts provide a written version of all spoken words in a video, as well as additional descriptions, explanations or comments.",
            tooltip: {
                available: "Transcripts are available in this video.",
                unavailable: "Transcripts are not available in this video."
            },
            resourceInput: {
                srcLabel: "Enter web link to transcript:",
                languagesLabel: "Enter language:",
                srcPlaceholder: "www.example.com/movie.srt",
                languages: ["Arabic", "Chinese", "English", "French", "Hindi", "Spanish"]
            }
        },
        styles: {
            container: "fl-transcriptsPanel"
        }
    });

})(jQuery, fluid);
