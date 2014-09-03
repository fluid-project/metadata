/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.matchConfirmation");

    $(document).ready(function () {
        jqUnit.asyncTest("Test matchConfirmation", function () {
            jqUnit.expect(2);

            gpii.metadata.feedback.matchConfirmation(".gpiic-panel", {
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
