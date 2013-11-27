/*!
Copyright 2013 OCAD University

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

    // jqUnit.asyncTest("Test metadata indicator", function () {
    jqUnit.test("Test metadata indicator", function () {
        var that = fluid.metadata.indicator(".flc-indicator");
        var tooltip = $("[id^=ui-tooltip]");

        jqUnit.expect(4);
        that.tooltip.events.afterOpen.addListener(function () {
            jqUnit.assertEquals("The tooltip content has been applied to the tooltip element", that.options.tooltipContent.unknown, $("[id^=ui-tooltip]").text());
            that.tooltip.events.afterOpen.removeListener("checkContent");
        }, "checkContent", null, "last");
        jqUnit.assertTrue("The initial circle css has been applied", that.container.hasClass(that.options.styles.circle));
        jqUnit.assertTrue("The initial color css has been applied", that.container.hasClass(that.options.styles.indicatorColors.unknown));
        jqUnit.assertTrue("The tooltip css has been applied to the tooltip element", tooltip.hasClass(that.options.tooltipOptions.styles.tooltip));
        that.tooltip.open();
        that.tooltip.close();

        jqUnit.expect(3);
        that.tooltip.events.afterOpen.addListener(function () {
            jqUnit.assertEquals("The tooltip content has been applied to the tooltip element", that.options.tooltipContent.available, $("[id^=ui-tooltip]").text());
            that.tooltip.events.afterOpen.removeListener("checkContent");
        }, "checkContent", null, "last");
        that.applier.requestChange("value", "available");

        jqUnit.assertFalse("The previous color css has been removed", that.container.hasClass(that.options.styles.indicatorColors.unknown));
        jqUnit.assertTrue("The color to indicate 'available' state has been applied", that.container.hasClass(that.options.styles.indicatorColors.available));
        that.tooltip.open();
        that.tooltip.close();

        jqUnit.expect(3);
        that.tooltip.events.afterOpen.addListener(function () {
            jqUnit.assertEquals("The tooltip content has been applied to the tooltip element", that.options.tooltipContent.unavailable, $("[id^=ui-tooltip]").text());
            that.tooltip.events.afterOpen.removeListener("checkContent");
        }, "checkContent", null, "last");
        that.applier.requestChange("value", "unavailable");
        jqUnit.assertFalse("The previous color css has been removed", that.container.hasClass(that.options.styles.indicatorColors.available));
        jqUnit.assertTrue("The color to indicate 'unavailable' state has been applied", that.container.hasClass(that.options.styles.indicatorColors.unavailable));
        that.tooltip.open();
        that.tooltip.close();
    });

})(jQuery);
