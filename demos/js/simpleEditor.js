/*

Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid*/

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

(function ($, fluid) {

    fluid.registerNamespace("fluid.simpleEditor");

    fluid.simpleEditor.preventDefault = function (event) {
        event.preventDefault();
    };

    fluid.defaults("fluid.simpleEditor", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        selectors: {
            controls: ".gpiic-metadataDemo-resourceEditor-toolbar-button",
            content: "#gpiic-metadataDemo-resourceEditor-textEditor"
        },
        events: {
            afterVideoInserted: null
        },
        listeners: {
            "onCreate.makeEditable": {
                "this": "{that}.dom.content",
                "method": "attr",
                "args": [{contentEditable: true}]
            },
            "onCreate.setFocus": {
                listener: "fluid.simpleEditor.setFocus",
                args: "{that}.dom.content"
            }
        },
        modelListeners: {
            "markup": {
                func: "fluid.simpleEditor.saveMarkup",
                args: ["{dataSource}.set", "{change}.value"]
            }
        },
        invokers: {
            setContent: {
                funcName: "fluid.simpleEditor.setContent",
                args: ["{that}.dom.content", "{arguments}.0"]
            },
            updateModelMarkup: {
                funcName: "fluid.simpleEditor.updateModelMarkup",
                args: ["{that}"]
            },
            setURL: {
                funcName: "fluid.simpleEditor.setURL",
                args: ["{that}", "{arguments}.0"]
            }
        },
        components: {
            insertVideo: {
                type: "fluid.simpleEditor.insertVideo",
                container: "{that}.container",
                options: {
                    model: {
                        url: "{simpleEditor}.model.url",
                        markup: "{simpleEditor}.model.markup"
                    },
                    selectors: {
                        content: "{simpleEditor}.options.selectors.content"
                    },
                    listeners: {
                        "afterInsert.updateEditor": "{simpleEditor}.updateModelMarkup",
                        "afterInsert.escalateEvent": "{simpleEditor}.events.afterVideoInserted"
                    }
                }
            }
        },
        dynamicComponents: {
            controls: {
                sources: "{that}.dom.controls",
                type: "fluid.simpleEditor.button",
                container: "{source}",
                options: {
                    ariaOptions: {
                        editorToControl: "{simpleEditor}.options.selectors.content"
                    },
                    listeners: {
                        "onCreate.attachKeyboardShortcut": {
                            listener: "{that}.attachKeyboardShortcut",
                            args: ["{simpleEditor}.dom.content", "{that}.events.click.fire"]
                        },
                        "onCreate.focus": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "focus",
                            "args": ["{that}.updateActiveState"]
                        },
                        "onCreate.input": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "on",
                            "args": ["input", "{that}.updateActiveState"]
                        },
                        "onCreate.keyup": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "keyup",
                            "args": ["{that}.updateActiveStateForKeys"]
                        },
                        "onCreate.mouseup": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "mouseup",
                            "args": ["{that}.updateActiveState"]
                        },
                        "onCreate.input_updateModelMarkup": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "on",
                            "args": ["input", "{simpleEditor}.updateModelMarkup"]
                        },
                        "click.updateModelMarkup": {
                            listener: "{simpleEditor}.updateModelMarkup"
                        }
                    }
                }
            }
        }
    });

    fluid.simpleEditor.saveMarkup = function (setFunc, newValue) {
        setFunc({id: "markup", model: newValue});
    };

    fluid.simpleEditor.setFocus = function (contentEditor) {
        contentEditor.get(0).focus();
    };

    fluid.simpleEditor.setContent = function (elm, content) {
        if (content || content === "") {
            elm.html(content);
        }
    };

    fluid.simpleEditor.setURL = function (that, url) {
        that.applier.requestChange("url", url);
    };

    fluid.simpleEditor.updateModelMarkup = function (that) {
        that.applier.requestChange("markup", that.locate("content").html());
    };

    fluid.registerNamespace("fluid.simpleEditor.button");

    fluid.simpleEditor.button.keyCodes = {
        B: 66,
        I: 73,
        U: 85,
        CTRL: "ctrlKey",
        ALT: "altKey",
        META: "metaKey",
        COMMAND: "metaKey"
    };

    fluid.simpleEditor.button.isMacOS = function () {
        var MAC = "MAC";
        var os = navigator.platform;

        return os.toUpperCase().indexOf(MAC) >= 0;
    };

    fluid.enhance.check({
        "fluid.macOS": "fluid.simpleEditor.button.isMacOS"
    });

    fluid.defaults("fluid.simpleEditor.button.macOSModifier", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        members: {
            modifierKey: "META"
        }
    });

    fluid.defaults("fluid.simpleEditor.button", {
        gradeNames: ["fluid.viewRelayComponent", "fluid.progressiveCheckerForComponent", "autoInit"],
        componentName: "fluid.simpleEditor.button",
        progressiveCheckerOptions: {
            checks: [{
                feature: "{fluid.macOS}",
                contextName: "fluid.simpleEditor.button.macOSModifier"
            }]
        },
        members: {
            controlType: {
                expander: {
                    "this": "{that}.container",
                    "method": "data",
                    "args": "control"
                }
            },
            modifierKey: "CTRL",
            shortCutKey: {
                expander: {
                    "this": "{that}.container",
                    "method": "data",
                    "args": "keycode"
                }
            }
        },
        ariaOptions: {
            labelIdPrefix: "gpiic-metadataDemo-resourceEditor-toolbar-button-"
        },
        styles: {
            active: "active"
        },
        events: {
            click: null
        },
        listeners: {
            "onCreate.addAria": "{that}.addAria",
            "onCreate.tabIndex": {
                "this": "{that}.container",
                "method": "attr",
                "args": ["tabindex", 0]
            },
            "onCreate.bindClick": {
                "this": "{that}.container",
                "method": "click",
                "args": ["{that}.events.click.fire"]
            },
            "onCreate.activatable": {
                listener: "fluid.activatable",
                args: ["{that}.container", "{that}.events.click.fire"]
            },
            "click.handle": {
                func: "{that}.handleCommand"
            },
            "click.updateActiveState": {
                func: "{that}.updateActiveState"
            }
        },
        invokers: {
            handleCommand: {
                funcName: "fluid.simpleEditor.button.command",
                args: ["{arguments}.0", "{that}.controlType"]
            },
            attachKeyboardShortcut: {
                funcName: "fluid.simpleEditor.button.attachKeyboardShortcut",
                args: ["{arguments}.0", "{arguments}.1", "{that}.shortCutKey", "{that}.modifierKey"]
            },
            updateActiveState: {
                funcName: "fluid.simpleEditor.button.updateActiveState",
                args: ["{that}.controlType", "{that}.container", "{that}.options.styles.active"]
            },
            updateActiveStateForKeys: {
                funcName: "fluid.simpleEditor.button.filterKeys",
                args: ["{arguments}.0", [37, 38, 39, 40], "{that}.updateActiveState"]
            },
            addAria: {
                funcName: "fluid.simpleEditor.button.addAria",
                args: ["{that}.container", "{that}.controlType", "{that}.options.ariaOptions.labelIdPrefix", "{that}.options.ariaOptions.editorToControl"]
            }
        }
    });

    fluid.simpleEditor.button.command = function (event, command) {
        document.execCommand(command, false, null);
        event.preventDefault();
    };

    fluid.simpleEditor.button.updateActiveState = function (command, elm, activeStyle) {
        var isActive = document.queryCommandState(command);
        elm.toggleClass(activeStyle, isActive);
        elm.attr("aria-pressed", isActive);
    };

    fluid.simpleEditor.button.filterKeys = function (event, keys, handler) {
        keys = fluid.makeArray(keys);
        if ($.inArray(event.keyCode, keys) >= 0 || $.inArray(event.which, keys) >= 0) {
            handler();
        }
    };

    fluid.simpleEditor.button.attachKeyboardShortcut = function (elm, callback, shortCutKey, modifierKey) {
        var key = fluid.simpleEditor.button.keyCodes[shortCutKey.toUpperCase()];
        var modifier = modifierKey && fluid.simpleEditor.button.keyCodes[modifierKey.toUpperCase()];

        // needed to use keydown instead of keyup to prevent browser default actions
        $(elm).keydown(function (event) {
            var modified = modifier ? event[modifier] : true;
            if(modified && event.which === key) {
                callback(event);
            }
        });

    };

    fluid.simpleEditor.button.addAria = function (container, controlType, labelIdPrefix, editorToControl) {
        container.attr("role", "button");
        container.attr("aria-pressed", false);
        container.attr("aria-controls", editorToControl.replace("#", ""));

        var labelId = labelIdPrefix + controlType;
        container.after("<p class=\"hide\" id=\"" + labelId + "\">" + controlType + "</p>");
        container.attr("aria-labelledby", labelId);
    };

    fluid.defaults("fluid.simpleEditor.insertVideo", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        disableVideoInput: false,    // boolean. Default value: false. At true, disable the input field and button for video url input.
        selectors: {
            url: ".gpiic-metadataDemo-resourceEditor-toolbar-url",
            urlLabel: ".gpiic-metadataDemo-resourceEditor-toolbar-url-label",
            submit: ".gpiic-metadataDemo-resourceEditor-toolbar-url-submit",
            content: ".gpiic-metadataDemo-resourceEditor-toolbar-url-content"
        },
        strings: {
            urlLabel: "Web address for video: ",
            urlPlaceHolder: "www.example.com/video.mp4",
            submit: "OK"
        },
        styles: {
            placeHolder: "someStyle"
        },
        model: {
            url: ""
        },
        modelListeners: {
            "url": "{that}.setURLText"
        },
        placeHolderID: "#videoPlaceHolder",
        events: {
            placeHolderFocused: null,
            afterInsert: null
        },
        listeners: {
            "onCreate.urlLabel": {
                "this": "{that}.dom.urlLabel",
                "method": "text",
                "args": ["{that}.options.strings.urlLabel"]
            },
            "onCreate.urlPlaceHolder": {
                "this": "{that}.dom.url",
                "method": "attr",
                "args": ["placeholder", "{that}.options.strings.urlPlaceHolder"]
            },
            "onCreate.setInitialSubmitActiveState": "{that}.updateActiveState",
            "onCreate.applyVideoInputState": {
                listener: "fluid.simpleEditor.insertVideo.applyVideoInputState",
                args: ["{that}.options.disableVideoInput", "{that}.disableVideoInputField", "{that}.disableSubmitButton"]
            },
            "onCreate.submit": {
                "this": "{that}.dom.submit",
                "method": "click",
                "args": ["{that}.insertPlaceHolder"]
            },
            "onCreate.submitPreventDefault": {
                "this": "{that}.dom.submit",
                "method": "click",
                "args": [fluid.simpleEditor.preventDefault]
            },
            "onCreate.updateSubmitActiveState": {
                "this": "{that}.dom.url",
                "method": "on",
                "args": ["input", "{that}.updateActiveState"]
            },
            "onCreate.bindEnter": {
                listener: "fluid.simpleEditor.insertVideo.bindEnter",
                args: ["{that}.dom.url", "{that}.dom.submit"]
            },
            "afterInsert.updateModelUrl": "{that}.updateModelUrl"
        },
        invokers: {
            insertPlaceHolder: {
                funcName: "fluid.simpleEditor.insertVideo.insertPlaceHolder",
                args: ["{that}.dom.content", "{that}.options.placeHolderID", "{that}.options.markup.placeHolder", "{that}.options.styles.placeHolder", "{that}.events.afterInsert.fire"]
            },
            updateModelUrl: {
                funcName: "fluid.simpleEditor.insertVideo.updateModelUrl",
                args: ["{that}"]
            },
            updateActiveState: {
                funcName: "fluid.simpleEditor.insertVideo.updateActiveState",
                args: ["{that}.dom.url", "{that}.enableSubmitButton", "{that}.disableSubmitButton"]
            },
            setURLText: {
                funcName: "fluid.simpleEditor.insertVideo.setURLText",
                args: ["{that}.dom.url", "{that}.model.url"],
                dynamic: true
            },
            disableVideoInputField: {
                funcName: "fluid.simpleEditor.insertVideo.disableVideoInputField",
                args: "{that}.dom.url"
            },
            disableSubmitButton: {
                funcName: "fluid.simpleEditor.insertVideo.disableSubmitButton",
                args: "{that}.dom.submit"
            },
            enableSubmitButton: {
                funcName: "fluid.simpleEditor.insertVideo.enableSubmitButton",
                args: "{that}.dom.submit"
            }
        },
        markup: {
            placeHolder: "<section contentEditable='false'><div class='gpii-metadataDemo-resourceEditor-insertVideo-placeHolder'><div class='gpii-metadataDemo-resourceEditor-insertVideo-placeHolder-playCircle'><div class='gpii-metadataDemo-resourceEditor-insertVideo-placeHolder-playTriangle'></div></div></div></section>"
        }

    });

    fluid.simpleEditor.insertVideo.insertPlaceHolder = function (content, placeHolderID, markup, styles, callback) {
        var placeHolder = content.find(placeHolderID);
        if (!placeHolder.length) {
            $(markup).attr({
                "id": placeHolderID.substr(1),
                "class": styles || ""
            }).appendTo(content);
        }
        if (callback) {
            callback();
        }
    };

    fluid.simpleEditor.insertVideo.updateModelUrl = function (that) {
        that.applier.requestChange("url", that.locate("url").val());
    };

    fluid.simpleEditor.insertVideo.setURLText = function (urlElm, url) {
        urlElm.val(url);
    };

    fluid.simpleEditor.insertVideo.updateActiveState = function (urlField, enableButtonFunc, disableButtonFunc) {
        if (!urlField.val()) {
            disableButtonFunc();
        } else {
            enableButtonFunc();
        }
    };

    fluid.simpleEditor.insertVideo.disableVideoInputField = function (urlElm) {
        urlElm.attr("disabled", "disabled");
    };

    fluid.simpleEditor.insertVideo.disableSubmitButton = function (buttonElm) {
        buttonElm.addClass("disabled");
    };

    fluid.simpleEditor.insertVideo.enableSubmitButton = function (buttonElm) {
        buttonElm.removeClass("disabled");
    };

    fluid.simpleEditor.insertVideo.applyVideoInputState = function (disableVideoInput, disableInputFieldFunc, disableButtonFunc) {
        if (disableVideoInput) {
            disableInputFieldFunc();
            disableButtonFunc();
        }
    };

    fluid.simpleEditor.insertVideo.bindEnter = function (urlElm, submitElm) {
        fluid.activatable(urlElm, null, {
            additionalBindings: {
                key: $.ui.keyCode.ENTER,
                activateHandler:  function () {
                    submitElm.click();
                }
            }
        });
    };

})(jQuery, fluid);
