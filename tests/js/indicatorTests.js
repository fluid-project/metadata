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

    fluid.tests.addIndicatorListener = function (that, state) {
        var expected = fluid.get(that.options.tooltipContent, state);

        that.tooltip.events.afterOpen.addListener(function () {
            jqUnit.assertEquals("The tooltip content has been applied to the tooltip element", expected, $("[id^=ui-tooltip]").text());
            that.tooltip.events.afterOpen.removeListener("checkContent");
        }, "checkContent", null, "last");
    };

    fluid.tests.checkInitial = function (that) {
        var tooltip = $("[id^=ui-tooltip]");
        jqUnit.assertTrue("The initial circle css has been applied", that.container.hasClass(that.options.styles.circle));
        jqUnit.assertTrue("The tooltip css has been applied to the tooltip element", tooltip.hasClass(that.options.tooltipOptions.styles.tooltip));
        that.tooltip.open();
        that.tooltip.close();
    };

    fluid.tests.checkState = function (that, previousState, currentState) {
        var previousStateCss = fluid.get(that.options.styles.indicatorState, previousState);
        var currentStateCss = fluid.get(that.options.styles.indicatorState, currentState);
        jqUnit.assertFalse("The previous color css has been removed", that.container.hasClass(previousStateCss));
        jqUnit.assertTrue("The color to indicate 'available' state has been applied", that.container.hasClass(currentStateCss));
        that.tooltip.open();
        that.tooltip.close();
    };

    jqUnit.test("Test metadata indicator", function () {
        var that = fluid.metadata.indicator(".flc-indicator");

        jqUnit.expect(3);
        fluid.tests.addIndicatorListener(that, "unknown");
        fluid.tests.checkInitial(that);

        jqUnit.expect(3);
        var currentState = "available";
        fluid.tests.addIndicatorListener(that, currentState);
        that.applier.requestChange("value", currentState);
        fluid.tests.checkState(that, "unknown", currentState);

        jqUnit.expect(3);
        currentState = "unavailable";
        fluid.tests.addIndicatorListener(that, currentState);
        that.applier.requestChange("value", currentState);
        fluid.tests.checkState(that, "available", currentState);
    });

})(jQuery);
