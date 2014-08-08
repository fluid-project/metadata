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

    /*******************************************************************************
     * The base panel component for metadata panels
     *******************************************************************************/

    fluid.defaults("gpii.metadata.basePanel", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            indicator: {
                type: "gpii.metadata.indicator",
                container: "{basePanel}.dom.indicator"
            }
        },
        strings: {
            title: "A panel title"
        },
        selectors: {
            title: ".gpiic-panel-title",
            indicator: ".gpiic-panel-indicator"
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

    fluid.defaults("gpii.metadata.panel", {
        gradeNames: ["gpii.metadata.basePanel", "autoInit"],
        components: {
            indicator: {
                options: {
                    modelRelay: {
                        source: "{panel}.model.value",
                        target: "{that}.model.value",
                        singleTransform: {
                            type: "fluid.transforms.identity"
                        }
                    }
                }
            }
        }
    });

})(jQuery, fluid);
