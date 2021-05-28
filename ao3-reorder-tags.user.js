// ==UserScript==
// @name         AO3 Drag to Reorder Tags
// @namespace    https://archiveofourown.org
// @version      0.01
// @description  Reorder tags on your AO3 works by clicking and dragging
// @author       ahiijny
// @match        http*://archiveofourown.org/*
// @match        http*://localhost:3000/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// ==/UserScript==

/* globals $ */

// See also:
// - https://github.com/otwcode/otwarchive/blob/master/public/javascripts/jquery.tokeninput.js
// - https://github.com/otwcode/otwarchive/blob/master/public/javascripts/application.js

// We can assume that AO3 tags will not contain any commas (https://github.com/otwcode/otwarchive/blob/40fb60907f998e86424c097b4a4edfca1ca3e0f5/app/models/tag.rb#L176)

// In the AO3 backend, the order of tags on a work is implicitly encoded in the sort order of the id of the corresponding `tagging` association object.
// Here, `tagging` is an M:M association table between taggables (i.e. works) and tags.

(function() {
    'use strict';
    const $reorderSelector = $(".fandom,.relationship,.character,.freeform").find("ul.autocomplete");
    $reorderSelector.sortable({
        items: "li:not(.input)",
        revert: 100, // revert animation duration in ms
        change: function(i) { // https://stackoverflow.com/questions/31591348/jquery-ui-sortable-with-fixed-elements-on-the-end
            const list = $(this).closest('ul');
            const input = $(list).find('.input');
            $(list).append($(input).detach());
        },
    });

    $("form").submit(function(e) {
        overrideHiddenInputs();
    });

    const overrideHiddenInputs = function() {
        $reorderSelector.each(function(i, a) {
            const $a = $(a);
            const $hiddenInput = $a.siblings("input:hidden").first();
            const tagList = [];
            $a.children(".added.tag").each(function(i, li) {
                let tagName = li.childNodes[0].nodeValue.trim();
                tagList.push(tagName);
            });
            const tagListStr = tagList.join(", ");
            $hiddenInput.val(tagListStr);
            console.log("[ao3-reorder-tags] Overwriting " + $hiddenInput.attr("name") + " with: [ " + tagListStr + " ]");
        });
    }
 })();
 