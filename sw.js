if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,c)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let t={};const d=e=>i(e,n),o={module:{uri:n},exports:t,require:d};s[n]=Promise.all(r.map((e=>o[e]||d(e)))).then((e=>(c(...e),t)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/timer-worker-1EJ-NBO1.js",revision:null},{url:"index.html",revision:"d1a402533753205807586b3ce377fcd8"},{url:"registerSW.js",revision:"76b7d4f2bd1986df2b2cfbfaa0df783a"},{url:"static/assets/index.qPH_WQZq.css",revision:"60cf1d40a814302eff621b4c9c081ae1"},{url:"static/js/entry-legacy.B6bTIgax.js",revision:"31803c22be516ec662f7b40c46cfc0eb"},{url:"static/js/entry-legacy.ox-PmGGC.js",revision:"34bd35690e73d2c4689279b26dbd5cc6"},{url:"static/js/entry.G5pIKs05.js",revision:"e6b36abd659adba40a2b9a2b9176336d"},{url:"static/js/entry.lMpmmIQ9.js",revision:"e2e0340d32043756120ecf5d82e85f05"},{url:"static/js/index-legacy.VkurPl4m.js",revision:"de86d2ffe14a838349496d1882ea3a12"},{url:"static/js/index.jTElqnSh.js",revision:"cb3de4fa0f63b4177b28488a1ea9e98c"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"a3460c270e5d711e05c38b585301ff56"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
