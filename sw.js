if(!self.define){let e,s={};const c=(c,i)=>(c=new URL(c+".js",i).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,d)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let t={};const a=e=>c(e,r),n={module:{uri:r},exports:t,require:a};s[r]=Promise.all(i.map((e=>n[e]||a(e)))).then((e=>(d(...e),t)))}}define(["./workbox-4723e66c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"a24053d622d6c6e4bcc70547f6957e0c"},{url:"registerSW.js",revision:"5cddde0a7bf060fed30974c2c942872f"},{url:"static/assets/index.g9SdtzNt.css",revision:"6de3b981bcf9aef65b5196fd8fcc908c"},{url:"static/js/bundle-legacy.BY3v1P39.js",revision:"03ac098c6c48f6f00c3d021a7d9a32e7"},{url:"static/js/bundle-legacy.lCJSax6W.js",revision:"aaccda5f524cdd4e0141e2a33bde7341"},{url:"static/js/bundle.B5xWFY92.js",revision:"98dd08cd92d5cf8e261d361815856ea7"},{url:"static/js/model-legacy.mZX33VoV.js",revision:"7362db4ac3ba09142474806d6c6205d9"},{url:"static/js/model.C1S_F5m0.js",revision:"e98b3911d1801481dc08d38b68c4ed7b"},{url:"static/js/view-legacy.C1_pPIhy.js",revision:"7aedab9ae9499ab69e68a495a7c3c189"},{url:"static/js/view.Gw5RSB_R.js",revision:"e811cd2572e7e5ea7e07af8905340188"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"04499e5e41a17c5a9755949209c17081"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
