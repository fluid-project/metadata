/*!
Copyright 2014 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/gpii/universal/LICENSE.txt
*/

(function ($) {
    "use strict";

    fluid.registerNamespace("gpii.tests.bindDialog");

    gpii.tests.bindDialog.assertInit = function (that) {
        jqUnit.assertEquals("The aria button role is set", "button", that.container.attr("role"));
        jqUnit.assertEquals("The aria label is set", that.options.strings.buttonLabel, that.container.attr("aria-label"));
        var containerEvents = ["click"];
        var iconEvents = ["focus", "blur", "mouseover", "mouseout" /* jQuery records mouseleave as mouseout */];
        var boundContainerEvents = $._data(that.container[0], "events"); // retrieve the set of events bound to the container element.
        var boundIconEvents = $._data(that.locate("icon")[0], "events"); // retrieve the set of events bound to the container element.
        fluid.each(containerEvents, function (eventName) {
            jqUnit.assertTrue("The " + eventName + " event should be bound on the container", boundContainerEvents[eventName]);
        });
        fluid.each(iconEvents, function (eventName) {
            jqUnit.assertTrue("The " + eventName + " event should be bound on the icon", boundIconEvents[eventName]);
        });
    };

    gpii.tests.bindDialog.assertState = function (msg, expectedState, actualState) {
        jqUnit[expectedState ? "assertTrue" : "assertFalse"](msg, actualState);
    };

    gpii.tests.bindDialog.assertActiveState = function (isActive, buttonDom, activeCSS) {
        gpii.tests.bindDialog.assertState("The active css is only applied when isActive is true", isActive, buttonDom.hasClass(activeCSS));
        gpii.tests.bindDialog.assertState("aria-pressed is set correctly", isActive, buttonDom.attr("aria-pressed") === "true");
    };

    gpii.tests.bindDialog.onDialogReadyChecker = function (dialog) {
        jqUnit.assertTrue("The dialog should be open", dialog.dialog("isOpen"));
    };

    gpii.tests.bindDialog.makeIndicatorChecker = function (elm, style, expectedValue) {
        return function () {
            gpii.tests.bindDialog.assertState("The indiator css should be set correctly", expectedValue, elm.hasClass(style));
        };
    };

    gpii.tests.bindDialog.makeChangeChecker = function (that, modelPath, expectedValue) {
        return function () {
            jqUnit.assertTrue("The container for rendering the dialog content should have been created", that.dialogContainer);
            jqUnit.assertEquals("The model path '" + modelPath + "'' is updated correctly.", expectedValue, fluid.get(that.model, modelPath));
        };
    };

    gpii.tests.bindDialog.makeEventChecker = function (eventName) {
        jqUnit.assert("The " + eventName + " event was fired.");
    };

    gpii.tests.bindDialog.simulateKeyEvent = function (elm, eventType, keyCode) {
        $(elm).simulate(eventType, {keyCode: keyCode});
    };

    fluid.defaults("gpii.tests.bindDialogInitTree", {
        gradeNames: ["fluid.test.testEnvironment", "autoInit"],
        markupFixture: ".gpiic-bindDialog-testFixture",
        components: {
            bindDialog: {
                type: "gpii.metadata.feedback.bindDialog",
                container: ".gpiic-button"
            },
            bindDialogTester: {
                type: "gpii.tests.bindDialogInitTester"
            }
        }
    });

    fluid.defaults("gpii.tests.bindDialogInitTester", {
        gradeNames: ["fluid.test.testCaseHolder", "autoInit"],
        modules: [{
            name: "Initialization",
            tests: [{
                expect: 7,
                name: "onCreate set values",
                type: "test",
                func: "gpii.tests.bindDialog.assertInit",
                args: "{bindDialog}"
            }, {
                expect: 2,
                name: "state",
                type: "test",
                func: "gpii.tests.bindDialog.assertActiveState",
                args: ["{bindDialog}.model.isActive", "{bindDialog}.container", "{bindDialog}.options.styles.active"]
            }, {
                expect: 1,
                name: "tooltip created",
                type: "test",
                func: "jqUnit.assertTrue",
                args: ["The tooltip component should be created", "{bindDialog}.tooltip"]
            }]
        }, {
            name: "Dialog State Changes",
            tests: [{
                name: "Mouse Interaction",
                expect: 8,
                sequence: [{
                    jQueryTrigger: "click",
                    element: "{bindDialog}.container"
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isActive", true],
                    spec: {path: "isActive", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "{bindDialog}.events.onDialogContentReady.fire"
                }, {
                    listener: "gpii.tests.bindDialog.makeEventChecker",
                    args: ["onBindDialogHandlers"],
                    priority: "last",
                    event: "{bindDialog}.events.onBindDialogHandlers"
                }, {
                    listener: "gpii.tests.bindDialog.onDialogReadyChecker",
                    event: "{bindDialog}.events.onDialogReady"
                }, {
                    jQueryTrigger: "click",
                    element: "body"
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isDialogOpen", false],
                    spec: {path: "isDialogOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    jQueryTrigger: "click",
                    element: "{bindDialog}.container"
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isActive", false],
                    spec: {path: "isActive", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }]
            }, {
                name: "Keyboard Interaction",
                expect: 7,
                sequence: [{
                    func: "gpii.tests.bindDialog.simulateKeyEvent",
                    args: ["{bindDialog}.container", "keydown", $.ui.keyCode.ENTER]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isActive", true],
                    spec: {path: "isActive", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "{bindDialog}.events.onDialogContentReady.fire"
                }, {
                    listener: "gpii.tests.bindDialog.onDialogReadyChecker",
                    event: "{bindDialog}.events.onDialogReady"
                }, {
                    func: "gpii.tests.bindDialog.simulateKeyEvent",
                    args: ["{bindDialog}.dialog", "keydown", $.ui.keyCode.ESCAPE]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isDialogOpen", false],
                    spec: {path: "isDialogOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "gpii.tests.bindDialog.simulateKeyEvent",
                    args: ["{bindDialog}.container", "keydown", $.ui.keyCode.SPACE]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeChangeChecker",
                    makerArgs: ["{bindDialog}", "isActive", false],
                    spec: {path: "isActive", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }]
            }]
        }, {
            name: "Indicator State Changes",
            tests: [{
                name: "Add/Remove Indicator",
                expect: 4,
                sequence: [{
                    func: "{bindDialog}.applier.change",
                    args: ["isDialogOpen", true]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeIndicatorChecker",
                    makerArgs: ["{bindDialog}.container", "{bindDialog}.options.styles.openIndicator", true],
                    spec: {path: "isDialogOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "{bindDialog}.applier.change",
                    args: ["isTooltipOpen", true]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeIndicatorChecker",
                    makerArgs: ["{bindDialog}.container", "{bindDialog}.options.styles.openIndicator", true],
                    spec: {path: "isTooltipOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "{bindDialog}.applier.change",
                    args: ["isDialogOpen", false]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeIndicatorChecker",
                    makerArgs: ["{bindDialog}.container", "{bindDialog}.options.styles.openIndicator", true],
                    spec: {path: "isDialogOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }, {
                    func: "{bindDialog}.applier.change",
                    args: ["isTooltipOpen", false]
                }, {
                    listenerMaker: "gpii.tests.bindDialog.makeIndicatorChecker",
                    makerArgs: ["{bindDialog}.container", "{bindDialog}.options.styles.openIndicator", false],
                    spec: {path: "isTooltipOpen", priority: "last"},
                    changeEvent: "{bindDialog}.applier.modelChanged"
                }]
            }]
        }]
    });

    $(document).ready(function () {
        fluid.test.runTests([
            "gpii.tests.bindDialogInitTree"
        ]);
    });
})(jQuery);
