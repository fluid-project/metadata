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

    fluid.registerNamespace("gpii.metadata");

    /*******************************************************************
     * The component used in conjunction with as a base grade for media
     * panels such as "gpii.metadata.videoMetadataPanel". It contains
     * common functionalities to be shared by all media panels.
     *
     * Note: "inputModel" option MUST be provided by integrators
     ****************************************************************/

    fluid.defaults("gpii.metadata.metadataPanel", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        model: {
            expander: {
                funcName: "{that}.generateModel",
                args: ["{that}.options.inputModel"]
            }
        },
        invokers: {
            generateModel: {
                funcName: "gpii.metadata.metadataPanel.generateModel",
                args: ["{that}.defaultModel", "{arguments}.0"]
            }
        }
    });

    gpii.metadata.metadataPanel.generateModel = function (defaultModel, inputModel) {
        inputModel = inputModel || {};
        return fluid.merge({"metadata": "replace"}, defaultModel, inputModel);
    };

})(jQuery, fluid);
