if(!self.define){let e,s={};const i=(i,c)=>(i=new URL(i+".js",c).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(c,r)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let d={};const t=e=>i(e,n),o={module:{uri:n},exports:d,require:t};s[n]=Promise.all(c.map((e=>o[e]||t(e)))).then((e=>(r(...e),d)))}}define(["./workbox-4723e66c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"31422d244442a9378983b4c6524c9f7b"},{url:"registerSW.js",revision:"5cddde0a7bf060fed30974c2c942872f"},{url:"static/assets/index.EtwAGqgv.css",revision:"df6970821ddd29bf4e1e2b6e407630cb"},{url:"static/js/bundle-legacy.D74vq31D.js",revision:"8b8e81e6964cc6615061e6635b4ef534"},{url:"static/js/bundle-legacy.P_nmUAek.js",revision:"79e09456c53c748482c95e40a3dc527b"},{url:"static/js/bundle.D3qllD9i.js",revision:"df93998e40e59c24ec53744f20ce4880"},{url:"static/js/model-legacy.CoC4cdjn.js",revision:"de38d711a394bf1ac4f6d953632ae707"},{url:"static/js/model.DaCadZ_c.js",revision:"7d5d674b86305ab17d19892f0340afb7"},{url:"static/js/view-legacy.C_dqJ15r.js",revision:"85cbb29c82f9d48891f1948e809ec705"},{url:"static/js/view.DOe3sm4-.js",revision:"9581087e6e47a8388f739d909342d957"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"04499e5e41a17c5a9755949209c17081"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
