/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-7e5eb42b'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "1872c500de691dce40960bb85481de07"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "7ba8c910e3b37a7ca954631ac88a308b"
  }, {
    "url": "pwa-512x512.png",
    "revision": "0694a15f8d99e229149dfe89ac8d9a68"
  }, {
    "url": "pwa-192x192.png",
    "revision": "51830458b485f93178b3ce18801a7653"
  }, {
    "url": "index.html",
    "revision": "509d871e82d0771cc8f93f1d9bfda4f5"
  }, {
    "url": "icon.svg",
    "revision": "1842ad7a3e7e4e625965e739251befd5"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5dcd9075ac3e7c63ab94bc0ae7fc5625"
  }, {
    "url": "assets/web-DAVcE8Su.js",
    "revision": null
  }, {
    "url": "assets/web-B4kJBWdA.js",
    "revision": null
  }, {
    "url": "assets/web-7aqd7jsG.js",
    "revision": null
  }, {
    "url": "assets/index-DnnOnefc.css",
    "revision": null
  }, {
    "url": "assets/index-BCTrwZNr.js",
    "revision": null
  }, {
    "url": "assets/aistudio/pwa-512x512_618dd407.png",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "5dcd9075ac3e7c63ab94bc0ae7fc5625"
  }, {
    "url": "icon.svg",
    "revision": "1842ad7a3e7e4e625965e739251befd5"
  }, {
    "url": "pwa-192x192.png",
    "revision": "51830458b485f93178b3ce18801a7653"
  }, {
    "url": "pwa-512x512.png",
    "revision": "0694a15f8d99e229149dfe89ac8d9a68"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "7ba8c910e3b37a7ca954631ac88a308b"
  }, {
    "url": "manifest.webmanifest",
    "revision": "6dddb904f640f2e98ea0dbcf2227fa28"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));

}));
