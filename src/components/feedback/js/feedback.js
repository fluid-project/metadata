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

    fluid.defaults("gpii.metadata.feedback", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        members: {
            databaseName: {
                expander: {
                    funcName: "gpii.metadata.feedback.getDbName",
                    args: "{that}.options.databaseName"
                }
            },
            dataId: "feedback"
        },
        model: {
            _id: {
                expander: {
                    funcName: "fluid.allocateGuid"
                }
            }
        },
        components: {
            bindMatchConfirmation: {
                type: "gpii.metadata.feedback.bindMatchConfirmation",
                container: "{feedback}.dom.matchConfirmationButton",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: {
                        buttonLabel: "{feedback}.options.strings.matchConfirmationLabel"
                    },
                    styles: {
                        activeCss: "{feedback}.options.styles.activeCss"
                    },
                    modelListeners: {
                        "isActive": [{
                            listener: "{feedback}.applier.change",
                            args: ["match", "{change}.value"]
                        }, {
                            listener: "gpii.metadata.feedback.updatePartner",
                            args: ["{change}.value", "{bindMismatchDetails}", "{feedback}.save"],
                            excludeSource: "init"
                        }]
                    }
                }
            },
            bindMismatchDetails: {
                type: "gpii.metadata.feedback.bindMismatchDetails",
                container: "{feedback}.dom.mismatchDetailsButton",
                createOnEvent: "afterMarkupReady",
                options: {
                    strings: {
                        buttonLabel: "{feedback}.options.strings.mismatchDetailsLabel"
                    },
                    styles: {
                        activeCss: "{feedback}.options.styles.activeCss"
                    },
                    modelListeners: {
                        "isActive": [{
                            listener: "{feedback}.applier.change",
                            args: ["mismatch", "{change}.value"]
                        }, {
                            listener: "gpii.metadata.feedback.updatePartner",
                            args: ["{change}.value", "{bindMatchConfirmation}", "{feedback}.save"],
                            excludeSource: "init"
                        }]
                    },
                    renderDialogContentOptions: {
                        model: {
                            notInteresting: "{feedback}.model.notInteresting",
                            otherFeedback: "{feedback}.model.other",
                            text: "{feedback}.model.requests.text",
                            transcripts: "{feedback}.model.requests.transcripts",
                            audio: "{feedback}.model.requests.audio",
                            audioDesc: "{feedback}.model.requests.audioDesc"
                        },
                        listeners: {
                            "onSubmit.save": "{feedback}.save"
                        }
                    }
                }
            },
            dataSource: {
                type: "gpii.pouchdb.dataSource",
                options: {
                    databaseName: "{feedback}.databaseName"
                }
            }
        },
        databaseName: "feedback",
        strings: {
            matchConfirmationLabel: "I like this article, match me with similar content.",
            mismatchDetailsLabel: "I don't like this article, request improvements.",
            requestLabel: "Request improvements to the content."
        },
        styles: {
            container: "gpii-feedback",
            activeCss: "gpii-icon-active"
        },
        selectors: {
            matchConfirmationButton: ".gpiic-matchConfirmation-button",
            mismatchDetailsButton: ".gpiic-mismatchDetails-button"
        },
        events: {
            afterTemplateFetched: null,
            afterMarkupReady: null,
            onSave: null,
            afterSave: null
        },
        listeners: {
            "onCreate.addContainerClass": {
                "this": "{that}.container",
                "method": "addClass",
                "args": "{that}.options.styles.container"
            },
            "onCreate.fetchResources": {
                "funcName": "fluid.fetchResources",
                "args": ["{that}.options.resources", "{that}.events.afterTemplateFetched.fire"]
            },
            "afterTemplateFetched.appendMarkup": {
                "this": "{that}.container",
                "method": "append",
                "args": "{arguments}.0.template.resourceText",
                "priority": "first"
            },
            "afterTemplateFetched.afterMarkupReady": {
                "func": "{that}.events.afterMarkupReady",
                "args": "{that}",
                "priority": "last"
            }
        },
        invokers: {
            save: {
                funcName: "gpii.metadata.feedback.save",
                args: ["{that}", "{dataSource}"]
            }
        },
        resources: {
            template: {
                url: "../html/feedbackTemplate.html",
                forceCache: true
            }
        },
        distributeOptions: [{
            source: "{that}.options.matchConfirmationTemplate",
            remove: true,
            target: "{that matchConfirmation}.options.resources.template.url"
        }, {
            source: "{that}.options.mismatchDetailsTemplate",
            remove: true,
            target: "{that mismatchDetails}.options.resources.template.url"
        }]
    });

    gpii.metadata.feedback.getDbName = function (databaseName) {
        return databaseName ? databaseName : "feedback";
    };

    gpii.metadata.feedback.updatePartner = function (isActive, partner, saveFunc) {
        if (isActive && partner.model.isActive) {
            partner.applier.change("isActive", false);
        } else {
            saveFunc();
        }
    };

    gpii.metadata.feedback.save = function (that, dataSource) {
        var model = {
            id: that.dataId,
            model: that.model
        };

        that.events.onSave.fire(model);

        dataSource.set(model, function () {
            console.log("afterSave fired", model);
            that.events.afterSave.fire(model);
        });
    };

})(jQuery, fluid);
