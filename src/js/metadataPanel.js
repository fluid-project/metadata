/*

Copyright 2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.registerNamespace("fluid.metadata");

    /****************************************************************
     * The component used in conjunction with media element grades
     * such as "fluid.metadata.videoMetadataPanel". It contains
     * common functionalities to be shared by all these grades.
     ****************************************************************/

    fluid.defaults("fluid.metadata.metadataPanel", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        events: {
            onReset: null
        },
        savedModel: null,  // The model saved previously. Must be provided by integrators
        model: {
            expander: {
                func: "fluid.metadata.metadataPanel.getModel",
                args: ["{that}.options.savedModel", "{that}.defaultModel"]
            }
        }
    });

    fluid.metadata.metadataPanel.getModel = function (savedModel, defaultModel) {
        if (savedModel) {
            return $.extend(true, {}, defaultModel, savedModel);
        } else {
            return defaultModel;
        }
    };

})(jQuery, fluid);
