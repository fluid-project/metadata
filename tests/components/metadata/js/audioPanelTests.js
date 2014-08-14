/*!
Copyright 2013-2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    gpii.tests.checkAudioState = function (audioPanel, expectedRadiobuttons, expectedCheckboxes, state) {
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

    gpii.tests.clickAttribute = function (audioPanel, attribute) {
        audioPanel.locate("attributes").find("[value='" + attribute + "']").click();
    };

    gpii.tests.checkAttributeModel = function (audioPanel, modelPath) {
        audioPanel.applier.modelChanged.addListener({
            path: "",
            priority: fluid.event.mapPriority("last", 0)
        }, function (newModel) {
            var keywords = fluid.get(newModel, "keywords");
            jqUnit.assertNotEquals("The proper model path has been updated", -1, $.inArray(modelPath, keywords));
            audioPanel.applier.modelChanged.removeListener("checkAttributeModel");
        }, "checkAttributeModel");
    };

    gpii.tests.clickAudioState = function (audioPanel, state) {
        audioPanel.container.find("[value='" + state + "']").click();
    };

    gpii.tests.checkAudioStateChange = function (audioPanel, expectedRadiobuttons, expectedCheckboxes, state) {
        audioPanel.events.afterAttributesRendered.addListener(function () {
            gpii.tests.checkAudioState(audioPanel, expectedRadiobuttons, expectedCheckboxes, state);
            audioPanel.events.afterAttributesRendered.removeListener("checkAudioStateChange");
        }, "checkAudioStateChange", null, "last");
    };

    gpii.tests.createAudioPanel = function (container, options) {
        var defaultOptions = {
            audioTemplate: "../../../../src/components/metadata/html/audio-template.html",
            audioAttributesTemplate: "../../../../src/components/metadata/html/audio-attributes-template.html"
        };

        return gpii.metadata.audioPanel(container, $.extend(true, {}, defaultOptions, options));
    };

    jqUnit.asyncTest("Initial settings", function () {
        jqUnit.expect(10);

        var options = {
            listeners: {
                onReady: function (that) {
                    gpii.tests.checkAudioState(that, 2, 3, "available");
                    jqUnit.start();
                }
            }
        };

        gpii.tests.createAudioPanel(".gpiic-audio-test-init", options);
    });

    jqUnit.asyncTest("Click on attribute checkboxes", function () {
        jqUnit.expect(3);

        var options = {
            listeners: {
                onReady: function (that) {
                    gpii.tests.checkAttributeModel(that, "dialogue");
                    gpii.tests.clickAttribute(that, "dialogue");

                    gpii.tests.checkAttributeModel(that, "soundtrack");
                    gpii.tests.clickAttribute(that, "soundtrack");

                    gpii.tests.checkAttributeModel(that, "sound effect");
                    gpii.tests.clickAttribute(that, "sound effect");

                    jqUnit.start();
                }
            }
        };

        gpii.tests.createAudioPanel(".gpiic-audio-test-attributes", options);
    });

    jqUnit.asyncTest("Click and check the audio availability", function () {
        jqUnit.expect(14);

        var options = {
            listeners: {
                onReady: function (that) {
                    gpii.tests.checkAudioStateChange(that, 2, 0, "unavailable");
                    gpii.tests.clickAudioState(that, "unavailable");

                    gpii.tests.checkAudioStateChange(that, 2, 3, "available");
                    gpii.tests.clickAudioState(that, "available");

                    jqUnit.start();
                }
            }
        };

        gpii.tests.createAudioPanel(".gpiic-audio-test-audio-availability", options);
    });

})(jQuery, fluid);
