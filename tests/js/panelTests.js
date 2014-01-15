/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

// Declare dependencies
/*global fluid, jqUnit, expect, jQuery*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($) {
    fluid.registerNamespace("fluid.tests");

    jqUnit.test("Test panel", function () {
        var that = fluid.metadata.panel(".flc-panel", {
                model: {
                    audio: "available"
                },
                components: {
                    indicator: {
                        options: {
                            sourceApplier: "{panel}.applier",
                            rules: {
                                "audio": "value"
                            },
                            model: {
                                value: "{panel}.model.audio"
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
        that.applier.requestChange("audio", newStatus);
        jqUnit.assertTrue("The indicator status is set to " + newStatus, that.locate("indicator").hasClass(that.indicator.options.styles.indicatorState.unavailable));
    });

})(jQuery);
