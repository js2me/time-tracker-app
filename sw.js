if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,t)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let c={};const d=e=>i(e,n),f={module:{uri:n},exports:c,require:d};s[n]=Promise.all(r.map((e=>f[e]||d(e)))).then((e=>(t(...e),c)))}}define(["./workbox-7cfec069"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"assets/timer-worker-1EJ-NBO1.js",revision:null},{url:"index.html",revision:"dc846ac3d1e46bf3e3a914e32a37b771"},{url:"registerSW.js",revision:"76b7d4f2bd1986df2b2cfbfaa0df783a"},{url:"static/assets/index.aTDTGnvO.css",revision:"4256605538c033c93c28b863c3fe4f57"},{url:"static/js/entry-legacy.h_Atiseb.js",revision:"7a1d2ff6a06de263e53c90eec7ef88b8"},{url:"static/js/entry-legacy.ox-PmGGC.js",revision:"34bd35690e73d2c4689279b26dbd5cc6"},{url:"static/js/entry.G5pIKs05.js",revision:"e6b36abd659adba40a2b9a2b9176336d"},{url:"static/js/entry.Jf_LroVC.js",revision:"c85f4da71f95385fbeaedfb7ad7a1533"},{url:"static/js/index-legacy.dA2qjLd_.js",revision:"3afadf363ff501647d20a6478f093892"},{url:"static/js/index.ctSofCgk.js",revision:"0bb97dd4299398fe49218d6e4d6f27e2"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"a3460c270e5d711e05c38b585301ff56"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
