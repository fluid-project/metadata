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

    gpii.tests.checkInitPanel = function (that) {
        jqUnit.assertEquals("The title should have been rendered", that.options.strings.title, that.locate("title").text());
        jqUnit.assertEquals("The description should have been rendered", that.options.strings.description, that.locate("description").text());
        jqUnit.assertTrue("The indicator state has been set to 'unavailable'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
    };

    gpii.tests.checkInitInput = function (that) {
        jqUnit.assertEquals("The placeholder for the input field has been set", that.options.strings.srcPlaceholder, that.locate("src").attr("placeholder"));

        $("select", that.locate("languages")).each(function (ignored, selectElm) {
            $(selectElm).find("option").each(function(idx, optElm){
                jqUnit.assertEquals("All language option should have been rendered in a combo box", that.input.options.controlValues[idx], $(optElm).val());
            });
        });
    };

    gpii.tests.changeSrcByIndex = function (that, newSrcValue, index) {
        that.container.find("input").eq(index).val(newSrcValue).change();
    };

    gpii.tests.changeLanguageByIndex = function (that, newLanguageValue, index) {
        that.container.find("select").eq(index).find("[value='" + newLanguageValue + "']").attr("selected", "selected").change();
    };

    gpii.tests.testOptions = [
        {src: "http://weblink.com/one.mp4", language: "hi"},
        {src: "http://weblink.com/two.mp4", language: "zh"}
    ];
    gpii.tests.testSequenceConfig = [
        {check: "gpii.tests.changeSrcByIndex", path: "src"},
        {check: "gpii.tests.changeLanguageByIndex", path: "language"}
    ];

    gpii.tests.resourceInputPanelChangesTests = function (that, testOpts, sequenceConfig) {
        fluid.each(testOpts, function (testOpt, index) {
            fluid.each(sequenceConfig, function (config) {
                var testVal = testOpts[index][config.path];

                that.applier.modelChanged.addListener({
                    path: "resources",
                    transactional: true,
                    priority: fluid.event.mapPriority("last", 0)
                }, function (newModel) {
                    jqUnit.assertEquals("The model path '" + config.path + "' has been updated to the new value", testVal, fluid.get(newModel[index], config.path));
                    jqUnit.assertTrue("The indicator state has been set to 'available'", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));
                    that.applier.modelChanged.removeListener("checkModel");
                }, "checkModel");

                fluid.invokeGlobalFunction(config.check, [that, testVal, index]);
            });
        });
    };

    gpii.tests.testResourceInputPanel = function (resourceInputPanelComponent, container, message) {
        jqUnit.asyncTest("Test " + message, function () {
            jqUnit.expect(24);

            resourceInputPanelComponent(container, {
                resources: {
                    template: {
                        url: "../../../../src/components/metadata/html/resourceInputPanel-template.html"
                    },
                    resourceInput: {
                        url: "../../../../src/components/metadata/html/resourceInput-template.html"
                    }
                },
                listeners: {
                    onReady: {
                        listener: function (that) {
                            gpii.tests.checkInitPanel(that);
                            gpii.tests.checkInitInput(that);
                            gpii.tests.resourceInputPanelChangesTests(that, gpii.tests.testOptions, gpii.tests.testSequenceConfig);

                            jqUnit.start();
                        },
                        priority: "last"
                    }
                }
            });
        });
    };


})(jQuery, fluid);
