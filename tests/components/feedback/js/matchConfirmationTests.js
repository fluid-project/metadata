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
    fluid.registerNamespace("fluid.tests.matchConfirmation");

    $(document).ready(function () {
        jqUnit.asyncTest("Test matchConfirmation", function () {
            jqUnit.expect(2);

            var that = gpii.metadata.feedback.matchConfirmation(".gpiic-panel", {
                resources: {
                    template: {
                        url: "../../../../src/components/feedback/html/matchConfirmationTemplate.html",
                    }
                },
                listeners: {
                    afterRender: function (that) {
                        jqUnit.assertEquals("The correct content is rendered", that.options.strings.header, that.locate("header").text());
                        jqUnit.assertEquals("The correct content is rendered", that.options.strings.content, that.locate("content").text());
                        jqUnit.start();
                    }
                }
            });
        });
    });
})(jQuery);
