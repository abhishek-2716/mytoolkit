import{j as n}from"./vendor-motion-CP_rp1gz.js";import{d as t,i,c as a,v as l,a as s}from"./ToolEngine-6pw_elVv.js";import"./vendor-ui-hUu0nIou.js";import{v as m}from"./index-BEzoZwSO.js";import"./zod-BG0VYgA8.js";import"./ToolDetailPage-clslUbYm.js";import"./seo.config-j3Bty0Pv.js";import"./useRecentTools-CaEHhbRw.js";import"./vendor-router-DIk1Y-Yj.js";import"./vendor-query-Bsei7Dhf.js";const o=m("markdown-preview");if(!o)throw new Error("[ToolEngine] markdown-preview not found in registry");const p=t({tool:o,processingMode:"browser",input:{type:"text",placeholder:`# Hello World

Write your **markdown** here and see it rendered live.

- Item 1
- Item 2

\`\`\`js
console.log("Hello!")
\`\`\``,maxLength:5e5,validate:e=>e.trim()?l(e):i(a("validation-error","Please enter some markdown text.",{retryable:!1}))},process:(e,d,r)=>(r(50),r(100),e),resultType:"markdown",layoutMode:"split"});function E(){return n.jsx(s,{config:p})}export{E as default};
