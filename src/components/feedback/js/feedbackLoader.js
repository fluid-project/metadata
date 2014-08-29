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
     * templateLoader: Define the template urls for rendering each dialog content
     */

    fluid.defaults("gpii.metadata.templateLoader", {
        gradeNames: ["fluid.prefs.resourceLoader", "autoInit"],
        templates: {
            feedback: "%prefix/feedbackTemplate.html",
            matchConfirmation: "%prefix/matchConfirmationTemplate.html",
            mismatchDetails: "%prefix/mismatchDetailsTemplate.html"
        }
    });

    /*
     * feedbackLoader: The component to instantiate the feedback tool.
     * This component has two sub-components: the feedback component that implements the
     * feedback tool; the templateLoader that loads in all the templates, from where on,
     * operations would be synchronous.
     */

    fluid.defaults("gpii.metadata.feedbackLoader", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        components: {
            feedback: {
                type: "gpii.metadata.feedback",
                createOnEvent: "onTemplatesLoaded",
                container: "{feedbackLoader}.container",
                options: {
                    components: {
                        bindMatchConfirmation: {
                            options: {
                                renderDialogContentOptions: {
                                    resources: {
                                        template: "{templateLoader}.resources.matchConfirmation"
                                    }
                                }
                            }
                        },
                        bindMismatchDetails: {
                            options: {
                                renderDialogContentOptions: {
                                    resources: {
                                        template: "{templateLoader}.resources.mismatchDetails"
                                    }
                                }
                            }
                        }
                    },
                    resources: {
                        template: "{templateLoader}.resources.feedback"
                    }
                }
            },
            templateLoader: {
                type: "gpii.metadata.templateLoader",
                options: {
                    events: {
                        onResourcesLoaded: "{feedbackLoader}.events.onTemplatesLoaded"
                    }
                }
            }
        },
        events: {
            onTemplatesLoaded: null
        },
        distributeOptions: [{
            source: "{that}.options.templatePrefix",
            target: "{that > templateLoader > resourcePath}.options.value",
            removeSource: true
        }, {
            source: "{that}.options.templates",
            target: "{that > templateLoader}.options.templates",
            removeSource: true
        }, {
            source: "{that}.options.feedback",
            target: "{that > feedback}.options"
        }]
    });

})(jQuery, fluid);
