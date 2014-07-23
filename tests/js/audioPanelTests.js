/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.tests");

    fluid.tests.checkAudioState = function (audioPanel, expectedRadiobuttons, expectedCheckboxes, state) {
        audioPanel = audioPanel.typeName === "fluid.metadata.audioPanel" ? audioPanel : audioPanel;

        var radiobuttons = audioPanel.container.find("[type='radio']");
        var checkboxes = audioPanel.locate("attributes").find("[type='checkbox']");

        jqUnit.assertEquals("Expected number of radiobuttons are rendered", expectedRadiobuttons, radiobuttons.length);
        jqUnit.assertEquals("Expected number of checkboxes are rendered", expectedCheckboxes, checkboxes.length);
        radiobuttons.each(function () {
            if ($(this).attr("value") === state) {
                jqUnit.assertTrue("The radio button with the value '" + state + "' is checked", $(this).is(":checked"));
            }
        });

        jqUnit.assertTrue("Appropriate Indicator css class has been applied", audioPanel.locate("indicator").hasClass("gpii-" + state));

        if (state === "available") {
            var count = 0;
            checkboxes.each(function () {
                jqUnit.assertFalse("Checkbox #" + (++count) + " is not checked", $(this).is(":checked"));
            });

            // test aria
            var attributesContainer = audioPanel.getContainerForAttributes();
            jqUnit.assertEquals("The aria attribute 'role' has been set", "region", attributesContainer.attr("role"));
            jqUnit.assertEquals("The aria attribute 'aria-live' has been set", "polite", attributesContainer.attr("aria-live"));
            jqUnit.assertEquals("The aria attribute 'aria-relevant' has been set", "additions removals", attributesContainer.attr("aria-relevant"));
        }
    };

    fluid.tests.clickAttribute = function (audioPanel, attribute) {
        audioPanel.locate("attributes").find("[value='" + attribute + "']").click();
    };

    fluid.tests.checkAttributeModel = function (audioPanel, modelPath) {
        audioPanel.applier.modelChanged.addListener("", function (newModel) {
            var keywords = fluid.get(newModel, "keywords");
            jqUnit.assertNotEquals("The proper model path has been updated", -1, $.inArray(modelPath, keywords));
            audioPanel.applier.modelChanged.removeListener("checkAttributeModel");
        }, "checkAttributeModel", null, "last");
    };

    fluid.tests.clickAudioState = function (audioPanel, state) {
        audioPanel.container.find("[value='" + state + "']").click();
    };

    fluid.tests.checkAudioStateChange = function (audioPanel, expectedRadiobuttons, expectedCheckboxes, state) {
        audioPanel.events.afterAttributesRendered.addListener(function () {
            fluid.tests.checkAudioState(audioPanel, expectedRadiobuttons, expectedCheckboxes, state);
            audioPanel.events.afterAttributesRendered.removeListener("checkAudioStateChange");
        }, "checkAudioStateChange", null, "last");
    };

    fluid.tests.createAudioPanel = function (container, options) {
        var defaultOptions = {
            audioTemplate: "../../src/html/audio-template.html",
            audioAttributesTemplate: "../../src/html/audio-attributes-template.html"
        };

        return fluid.metadata.audioPanel(container, $.extend(true, {}, defaultOptions, options));
    };

    jqUnit.asyncTest("Initial settings", function () {
        jqUnit.expect(10);

        var options = {
            listeners: {
                onReady: function (that) {
                    fluid.tests.checkAudioState(that, 3, 3, "available");
                    jqUnit.start();
                }
            }
        };

        fluid.tests.createAudioPanel(".flc-audio-test-init", options);
    });

    jqUnit.asyncTest("Click on attribute checkboxes", function () {
        jqUnit.expect(3);

        var options = {
            listeners: {
                onCreate: {
                    listener: "fluid.tests.checkAttributeModel",
                    args: ["{that}", "dialogue"],
                    priority: "first"
                },
                onReady: function (that) {
                    fluid.tests.checkAttributeModel(that, "dialogue");
                    fluid.tests.clickAttribute(that, "dialogue");

                    fluid.tests.checkAttributeModel(that, "soundtrack");
                    fluid.tests.clickAttribute(that, "soundtrack");

                    fluid.tests.checkAttributeModel(that, "sound effect");
                    fluid.tests.clickAttribute(that, "sound effect");

                    jqUnit.start();
                }
            }
        };

        fluid.tests.createAudioPanel(".flc-audio-test-attributes", options);
    });

    jqUnit.asyncTest("Click and check the audio availability", function () {
        jqUnit.expect(18);

        var options = {
            listeners: {
                onReady: function (that) {
                    fluid.tests.checkAudioStateChange(that, 3, 0, "unavailable");
                    fluid.tests.clickAudioState(that, "unavailable");

                    fluid.tests.checkAudioStateChange(that, 3, 0, "unknown");
                    fluid.tests.clickAudioState(that, "unknown");

                    fluid.tests.checkAudioStateChange(that, 3, 3, "available");
                    fluid.tests.clickAudioState(that, "available");

                    jqUnit.start();
                }
            }
        };

        fluid.tests.createAudioPanel(".flc-audio-test-audio-availability", options);
    });

})(jQuery, fluid);
