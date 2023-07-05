// ==UserScript==
// @name         Open Reddit post in new tab
// @namespace    http://smalls.online
// @version      0.1
// @description  Make post links on Reddit open in a new tab, instead of in the current window.
// @author       Smalls
// @match        https://*.reddit.com/*
// @match        https://reddit.com/*
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @updateURL    https://github.com/Smalls1652/reddit-userscripts/raw/main/post-links_new-tab.user.js
// @downloadURL  https://github.com/Smalls1652/reddit-userscripts/raw/main/post-links_new-tab.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the element with the 'App' class.
    const appNode = document.querySelector(".App");

    // Define the callback for the mutation observer.
    const mutationObserverCallback = (mutationList, observer) => {
        // Find all 'a' elements in the document and filter out links that don't:
        // - Have the 'Post__link' class
        // - Have the 'target' property set to '_blank'.
        let foundLinks = Array.from(document.getElementsByTagName("a"))
            .filter(item => item.className == "Post__link" && item.target !== "_blank");


        for (const item of foundLinks) {
            let targetAttr = item.getAttribute("target");
            let relAttr = item.getAttribute("rel");

            // Set the 'target' attribute to '_blank' if it's null.
            if (targetAttr === null) {
                item.setAttribute("target", "_blank");
            }

            // Set the 'rel' attribute to 'noopener noreferrer' if it's null.
            if (relAttr === null) {
                item.setAttribute("rel", "noopener noreferrer");
            }

            // Find any keys for the element that start with '__reactEventHandlers'.
            // For any key found, delete it.
            // Note: This is to remove the event handler for React to intercept the 'onclick' events.
            Object.keys(item)
                .filter(itemKey => itemKey.startsWith("__reactEventHandlers"))
                .map(itemKey => delete item[itemKey]);
        }

        console.log(`Configured ${foundLinks.length} links to open in a new tab.`);
    };


    const mutationObserverConfig = {
        "attributes": false,
        "childList": true,
        "subtree": true
    };

    const observer = new MutationObserver(mutationObserverCallback);

    observer.observe(appNode, mutationObserverConfig);
})();