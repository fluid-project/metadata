/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("gpii.tests");

    jqUnit.test("Test panel with a defined model and defined rules", function () {
        var that = gpii.metadata.panel(".gpiic-panel", {
            model: {
                audio: "available"
            },
            components: {
                indicator: {
                    options: {
                        modelRelay: {
                            source: "{panel}.model.audio",
                            target: "{that}.model.value",
                            singleTransform: {
                                type: "fluid.transforms.identity"
                            }
                        }
                    }
                }
            }
        });

        jqUnit.expect(2);
        jqUnit.assertEquals("The initial title is properly set", that.options.strings.title, that.locate("title").text());
        jqUnit.assertTrue("The indicator status is properly set", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));

        jqUnit.expect(1);
        var newStatus = "unavailable";
        that.applier.change("audio", newStatus);
        jqUnit.assertTrue("The indicator status is set to " + newStatus, that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
    });

    jqUnit.test("Test panel without defined rules", function () {
        var that = gpii.metadata.panel(".gpiic-panel", {
            model: {
                value: "available"
            }
        });

        jqUnit.expect(2);
        jqUnit.assertEquals("The initial title is properly set", that.options.strings.title, that.locate("title").text());
        jqUnit.assertTrue("The indicator status is properly set", that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.available));
    });

})(jQuery, fluid);
