if(!self.define){let e,s={};const c=(c,i)=>(c=new URL(c+".js",i).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(i,r)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let a={};const d=e=>c(e,t),n={module:{uri:t},exports:a,require:d};s[t]=Promise.all(i.map((e=>n[e]||d(e)))).then((e=>(r(...e),a)))}}define(["./workbox-4723e66c"],(function(e){"use strict";self.addEventListener("message",(e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()})),e.precacheAndRoute([{url:"index.html",revision:"871c543133d4950eeb78808e7f35ebf3"},{url:"registerSW.js",revision:"5cddde0a7bf060fed30974c2c942872f"},{url:"static/assets/index.g9SdtzNt.css",revision:"6de3b981bcf9aef65b5196fd8fcc908c"},{url:"static/js/bundle-legacy.BY3v1P39.js",revision:"03ac098c6c48f6f00c3d021a7d9a32e7"},{url:"static/js/bundle-legacy.DeeCc4qL.js",revision:"9f1867be08ab311ea3b627b3cbba8a20"},{url:"static/js/bundle.Ba4_tmKH.js",revision:"ce449038572e2d1e434a3177d0022cf4"},{url:"static/js/model-legacy.DacofFJe.js",revision:"ee850c041a5429fd30676dc0a7716c2d"},{url:"static/js/model.-mKqGdTo.js",revision:"b91a1dc58c97dea24da0c29d2f5f9ae8"},{url:"static/js/view-legacy.BgQdmLfr.js",revision:"5923cc5c34aea3da7eb121332d5845b0"},{url:"static/js/view.BijFg6of.js",revision:"bb61da985abe19718fc26f4bff7421c2"},{url:"favicon.png",revision:"ab0fd13712d9b0d436cd21df5274b183"},{url:"logo.png",revision:"32a61327661f6d50a0780d16421cf67e"},{url:"logo-512x512.png",revision:"b21c1a3a630ac8cec4c17b8bc77ae17f"},{url:"manifest.webmanifest",revision:"04499e5e41a17c5a9755949209c17081"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
