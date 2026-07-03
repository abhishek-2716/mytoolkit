import{j as f}from"./vendor-motion-CP_rp1gz.js";import{d as p,i as u,c,v as m,a as d}from"./ToolEngine-6pw_elVv.js";import"./vendor-ui-hUu0nIou.js";import{v as g}from"./index-BEzoZwSO.js";import"./zod-BG0VYgA8.js";import"./ToolDetailPage-clslUbYm.js";import"./seo.config-j3Bty0Pv.js";import"./useRecentTools-CaEHhbRw.js";import"./vendor-router-DIk1Y-Yj.js";import"./vendor-query-Bsei7Dhf.js";function h(o){let i=o.replace(/\/\*[\s\S]*?\*\//g,"");i=i.replace(/\s+/g," ").trim();let e="",r=0;const a="  ";let t=0;for(;t<i.length;){const n=i[t];if(n==="{")e+=` {
`,r++,e+=a.repeat(r),t++;else if(n==="}")e=e.trimEnd(),e+=`
`,r=Math.max(0,r-1),e+=a.repeat(r)+`}
`,r===0&&(e+=`
`),t++;else if(n===";"){e+=`;
`;let s=t+1;for(;s<i.length&&i[s]===" ";)s++;i[s]!=="}"&&(e+=a.repeat(r)),t++}else n===":"&&t+1<i.length&&i[t+1]!==":"?(e+=": ",t++,t<i.length&&i[t]===" "&&t++):(n===" "&&e.endsWith(`
`)||(e+=n),t++)}return e.trim()}const l=g("css-beautifier");if(!l)throw new Error("[ToolEngine] css-beautifier not found in registry");const y=p({tool:l,processingMode:"browser",input:{type:"text",placeholder:"Paste CSS code to beautify and format...",maxLength:5e5,validate:o=>o.trim()?m(o):u(c("validation-error","Enter CSS to beautify.",{retryable:!1}))},process:(o,i,e)=>{e(50);const r=h(o);return e(100),r},resultType:"code",layoutMode:"split"});function I(){return f.jsx(d,{config:y})}export{I as default};
