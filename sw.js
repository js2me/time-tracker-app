if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let n={};const t=e=>i(e,d),o={module:{uri:d},exports:n,require:t};s[d]=Promise.all(c.map((e=>o[e]||t(e)))).then((e=>(r(...e),n)))}}define(["./workbox-4723e66c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"62acce5f0f018e0ed0f0a9187fabe419"},{url:"registerSW.js",revision:"5cddde0a7bf060fed30974c2c942872f"},{url:"static/assets/index.EtwAGqgv.css",revision:"df6970821ddd29bf4e1e2b6e407630cb"},{url:"static/js/bundle-legacy.BX6gJu2p.js",revision:"f6611c3470d76b8841183c262721c472"},{url:"static/js/bundle-legacy.P_nmUAek.js",revision:"79e09456c53c748482c95e40a3dc527b"},{url:"static/js/bundle.CFNrt52u.js",revision:"3068534520dda3f1e66f0243f943e7bc"},{url:"static/js/model-legacy.qO2XP2yU.js",revision:"34cbe4dff01d0eb01152b6a2ae39fde3"},{url:"static/js/model.CsFdRUne.js",revision:"4f0369eff67530d538775e555d9d30c5"},{url:"static/js/view-legacy.BgazH9KZ.js",revision:"9a747231928a89e9d5db05149bc3d4f8"},{url:"static/js/view.DsK-u9K9.js",revision:"e8d71b8ae0495573f761a6aa7835f2ec"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"04499e5e41a17c5a9755949209c17081"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
