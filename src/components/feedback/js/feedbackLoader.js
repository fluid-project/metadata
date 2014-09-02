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

    /*
     * feedbackLoader: The component to load in templates and instantiate the feedback tool.
     */

    fluid.defaults("gpii.metadata.feedbackLoader", {
        gradeNames: ["fluid.viewRelayComponent", "fluid.prefs.resourceLoader", "autoInit"],
        templates: {
            feedback: "%prefix/feedbackTemplate.html",
            matchConfirmation: "%prefix/matchConfirmationTemplate.html",
            mismatchDetails: "%prefix/mismatchDetailsTemplate.html"
        },
        components: {
            feedback: {
                type: "gpii.metadata.feedback",
                createOnEvent: "onResourcesLoaded",
                container: "{feedbackLoader}.container",
                options: {
                    components: {
                        bindMatchConfirmation: {
                            options: {
                                renderDialogContentOptions: {
                                    resources: {
                                        template: "{feedbackLoader}.resources.matchConfirmation"
                                    }
                                }
                            }
                        },
                        bindMismatchDetails: {
                            options: {
                                renderDialogContentOptions: {
                                    resources: {
                                        template: "{feedbackLoader}.resources.mismatchDetails"
                                    }
                                }
                            }
                        }
                    },
                    resources: {
                        template: "{feedbackLoader}.resources.feedback"
                    }
                }
            }
        },
        distributeOptions: [{
            source: "{that}.options.templatePrefix",
            target: "{that fluid.prefs.resourcePath}.options.value",
            removeSource: true
        }, {
            source: "{that}.options.feedback",
            target: "{that feedback}.options"
        }]
    });

})(jQuery, fluid);
