/*

Copyright 2013 OCAD University

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

    fluid.defaults("fluid.simpleEditor", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            controls: ".flc-simpleEditor-control",
            content: ".flc-simpleEditor-content"
        },
        events: {
            afterReset: null
        },
        listeners: {
            "onCreate.makeEditable": {
                "this": "{that}.dom.content",
                "method": "attr",
                "args": [{contentEditable: true}]
            }
        },
        modelListeners: {
            "markup": {
                func: "{dataSource}.set",
                args: [{id: "markup", model: "{that}.model.markup"}]
            }
        },
        invokers: {
            setContent: {
                funcName: "fluid.simpleEditor.setContent",
                args: ["{that}.dom.content", "{arguments}.0"]
            },
            updateModel: {
                funcName: "fluid.simpleEditor.updateModel",
                args: ["{that}"]
            },
            reset: {
                funcName: "fluid.simpleEditor.reset",
                args: ["{that}"]
            }
        },
        components: {
            dataSource: {
                type: "fluid.pouchdb.dataSource",
                options: {
                    databaseName: "simpleEditor",
                    listeners: {
                        "onCreate.fetch": {
                            listener: "{that}.get",
                            args: [{id: "markup"}, "{simpleEditor}.setContent"]
                        }
                    }
                }
            },
            insertVideo: {
                type: "fluid.simpleEditor.insertVideo",
                container: "{that}.container",
                options: {
                    selectors: {
                        content: "{simpleEditor}.options.selectors.content"
                    },
                    listeners: {
                        "afterInsert.updateModel": "{simpleEditor}.updateModel"
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
                    listeners: {
                        "{simpleEditor}.events.afterReset": "{that}.updateActiveState",
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
                        "onCreate.input_updateModel": {
                            "this": "{simpleEditor}.dom.content",
                            "method": "on",
                            "args": ["input", "{simpleEditor}.updateModel"]
                        },
                        "click.updateModel": {
                            listener: "{simpleEditor}.updateModel"
                        }
                    }
                }
            }
        }
    });

    fluid.simpleEditor.setContent = function (elm, content) {
        if (content || content === "") {
            elm.html(content);
        }
    };

    fluid.simpleEditor.updateModel = function (that) {
        that.applier.requestChange("markup", that.locate("content").html());
    };

    fluid.simpleEditor.reset = function (that) {
        that.setContent("");
        that.updateModel();
        that.events.afterReset.fire();
    };

    fluid.defaults("fluid.simpleEditor.button", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        members: {
            controlType: {
                expander: {
                    "this": "{that}.container",
                    "method": "data",
                    "args": "control"
                }
            }
        },
        styles: {
            active: "active"
        },
        events: {
            click: null
        },
        listeners: {
            "onCreate.bindClick": {
                "this": "{that}.container",
                "method": "click",
                "args": ["{that}.events.click.fire"]
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
            updateActiveState: {
                funcName: "fluid.simpleEditor.button.updateActiveState",
                args: ["{that}.controlType", "{that}.container", "{that}.options.styles.active"]
            },
            updateActiveStateForKeys: {
                funcName: "fluid.simpleEditor.button.filterKeys",
                args: ["{arguments}.0", [37, 38, 39, 40], "{that}.updateActiveState"]
            }
        }
    });

    fluid.simpleEditor.button.command = function (event, command) {
        var elm = $(event.target);
        document.execCommand(command, false, null);
        event.preventDefault();
    };

    fluid.simpleEditor.button.updateActiveState = function (command, elm, activeStyle) {
        var isActive = document.queryCommandState(command);
        elm.toggleClass(activeStyle, isActive);
    };

    fluid.simpleEditor.button.filterKeys = function (event, keys, handler) {
        keys = fluid.makeArray(keys);
        if ($.inArray(event.keyCode, keys) >= 0 || $.inArray(event.which, keys) >= 0) {
            handler();
        }
    };

    fluid.defaults("fluid.simpleEditor.insertVideo", {
        gradeNames: ["fluid.viewComponent", "autoInit"],
        selectors: {
            url: ".flc-simpleEditor-insertVideo-url",
            urlLabel: ".flc-simpleEditor-insertVideo-urlLabel",
            submit: ".flc-simpleEditor-insertVideo-submit",
            content: ".flc-simpleEditor-insertVideo-content"
        },
        strings: {
            urlLabel: "Enter web address for video: ",
            urlPlaceHolder: "www.example.com/video.mp4",
            submit: "OK"
        },
        styles: {
            placeHolder: "someStyle"
        },
        model: {
            url: ""
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
            "onCreate.submit": {
                "this": "{that}.dom.submit",
                "method": "click",
                "args": ["{that}.insertPlaceHolder"]
            }
        },
        invokers: {
            insertPlaceHolder: {
                funcName: "fluid.simpleEditor.insertVideo.insertPlaceHolder",
                args: ["{that}.dom.content", "{that}.options.placeHolderID", "{that}.options.markup.placeHolder", "{that}.options.styles.placeHolder", "{that}.events.afterInsert.fire"]
            }
        },
        markup: {
            placeHolder: "<a href='#_'>VIDEO PLACEHOLDER</a>"
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

})(jQuery, fluid);
