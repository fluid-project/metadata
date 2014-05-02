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
        gradeNames: ["fluid.rendererComponent", "autoInit"],
        listeners: {
            "onCreate.setDefaultModel": {
                listener: "{that}.setDefaultModel",
                priority: "first"
            }
        },
        modelListeners: {
            "url": "{that}.refreshView"
        },
        invokers: {
            setModel: {
                funcName: "fluid.metadata.metadataPanel.setModel",
                args: ["{that}", "{arguments}.0"]
            },
            setDefaultModel: {
                funcName: "fluid.metadata.metadataPanel.setDefaultModel",
                args: ["{that}", "{that}.defaultModel"]
            }
        }
    });

    fluid.metadata.metadataPanel.setModel = function (that, model) {
        model = model || {};
        model = $.extend(true, {}, that.defaultModel, model);
        that.applier.change("", model);
    };

    fluid.metadata.metadataPanel.setDefaultModel = function (that, defaultModel) {
        that.setModel(defaultModel);
    };

})(jQuery, fluid);
