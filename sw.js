if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(i[d])return;let c={};const t=e=>s(e,d),a={module:{uri:d},exports:c,require:t};i[d]=Promise.all(n.map((e=>a[e]||t(e)))).then((e=>(r(...e),c)))}}define(["./workbox-4723e66c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"5269532c52f0d3e01ad43f2098ad4811"},{url:"registerSW.js",revision:"76b7d4f2bd1986df2b2cfbfaa0df783a"},{url:"static/assets/index.BV_PNSSG.css",revision:"2eaa6445d788d215a895429c666f73e3"},{url:"static/js/bundle-legacy.BPIircMW.js",revision:"859cb44a934df3d884a11df312e5a07f"},{url:"static/js/bundle-legacy.Dk9hiYMs.js",revision:"7443ccddb34f866945a3555e48aaa111"},{url:"static/js/bundle.Chlv4zXQ.js",revision:"511927fad1e009f8a2d2d967a5abc4db"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"a3460c270e5d711e05c38b585301ff56"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
