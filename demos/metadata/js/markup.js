/*

Copyright 2013-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/* global markup_beauty */

(function ($, fluid) {
    "use strict";

    fluid.defaults("gpii.markup", {
        gradeNames: ["fluid.viewRelayComponent", "autoInit"],
        invokers: {
            generateMarkup: {
                funcName: "gpii.markup.generate",
                args: ["{that}.model", "{that}.options.markup"],
                dynamic: true
            },
            updateModelMarkup: {
                func: "{that}.applier.requestChange",
                args: ["markup", "{arguments}.0"]
            },
            updateModelMetadata: {
                func: "{that}.applier.requestChange",
                args: ["metadata", "{arguments}.0"]
            }
        },
        markup: {
            videoContainer: "<div></div>",
            captionsContainer: "<span></span>",
            contentContainer: "<article>%content</article>"
        }
    });

    gpii.markup.transformToVideoMetadata = function (metadata) {
        //TODO: Update to use model transformations framework
        var videoMetatdata = {
            contentUrl: [metadata.url]
        };

        if (metadata.metadata) {
            videoMetatdata = $.extend(true, null, fluid.copy(metadata.metadata), videoMetatdata);

            if ($.inArray("visual", videoMetatdata.accessMode) === -1) {
                videoMetatdata.accessMode.push("visual");
            }

            if ($.inArray("audio", videoMetatdata.accessMode) === -1) {
                delete videoMetatdata.keywords;
            }
        }

        if (metadata.captions && metadata.captions.length) {
            videoMetatdata.accessibilityFeature.push("captions");
        }

        return videoMetatdata;
    };

    gpii.markup.generateVideoElm = function (metadata, videoContainerMarkup, captionsContainerMarkup, videoElm) {
        if (!videoElm) {
            videoElm = $("<video controls></video>");
            $("<source>").attr({
                src: metadata.url,
                type: "video/" + metadata.url.split(".").pop()
            }).appendTo(videoElm);
        }

        var videoContainer = $(videoContainerMarkup);
        gpii.metadata.writer(videoContainer, gpii.markup.transformToVideoMetadata(metadata), {
            itemprop: "video",
            itemtype: gpii.metadata.itemtype.VIDEO_OBJECT
        });
        fluid.each(metadata.captions, function (caption) {
            var captionContainer = $(captionsContainerMarkup);
            gpii.metadata.writer(captionContainer, {inLanguage: caption.language});
            $("<track>").attr({
                type: "captions",
                src: caption.src,
                srclang: caption.language
            }).appendTo(captionContainer);
            captionContainer.appendTo(videoElm);
        });
        videoContainer.append(videoElm);
        return videoContainer;
    };

    gpii.markup.addVideoMetadata = function (content, placeholderID, metadata, replacementMarkup) {
        metadata = metadata || {url: ""};
        var placeholder = content.find(placeholderID);
        var existingVideo = content.find("video");
        if (placeholder.length) {
            placeholder = placeholder.replaceWith(gpii.markup.generateVideoElm(metadata, replacementMarkup.videoContainer, replacementMarkup.captionsContainer));
        } else if (existingVideo.length) {
            existingVideo.replaceWith(gpii.markup.generateVideoElm(metadata, replacementMarkup.videoContainer, replacementMarkup.captionsContainer, existingVideo.clone()));
        }
    };

    gpii.markup.generate = function (model, replacementMarkup) {
        // Creating a jQuery element with the markup. The wrapping is to allow retrieving all of the relavent markup
        // later with a call to html()
        var content = $("<section>" + model.markup + "</section>");
        gpii.markup.addVideoMetadata(content, "#videoPlaceHolder", model.metadata, replacementMarkup);
        // the call to markup_beauty requires that textnodes be wrapped in a tag, or they will be stripped out.
        var markup = replacementMarkup.contentContainer ? fluid.stringTemplate(replacementMarkup.contentContainer, {content: content.html()}) : content.html();
        var formatted = markup_beauty({
            source: markup,
            force_indent: true,
            mode: "beautify",
            html: true
        });

        return formatted;
    };

})(jQuery, fluid);
