import{j as d}from"./vendor-motion-CP_rp1gz.js";import{d as g,i as y,c as p,v as u,a as $}from"./ToolEngine-6pw_elVv.js";import"./vendor-ui-hUu0nIou.js";import{v as j}from"./index-BEzoZwSO.js";import"./zod-BG0VYgA8.js";import"./ToolDetailPage-clslUbYm.js";import"./seo.config-j3Bty0Pv.js";import"./useRecentTools-CaEHhbRw.js";import"./vendor-router-DIk1Y-Yj.js";import"./vendor-query-Bsei7Dhf.js";function f(t,l=0){const r="  ".repeat(l);if(t===null||t===void 0)return"null";if(typeof t=="boolean")return t?"true":"false";if(typeof t=="number")return isFinite(t)?String(t):"null";if(typeof t=="string")return t===""||t==="null"||t==="true"||t==="false"||/^\s/.test(t)||/\s$/.test(t)||t.includes(":")||t.includes("#")||t.includes(`
`)||/^[-?|>!'"{}[\],&*#@`]/.test(t)||/^\d/.test(t)||/^0x/i.test(t)?`"${t.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n/g,"\\n")}"`:t;if(Array.isArray(t))return t.length===0?"[]":`
`+t.map(n=>{const s=f(n,l+1);return s.includes(`
`)?`${r}- ${s.replace(/\n/g,`
${r}  `)}`:`${r}- ${s}`}).join(`
`);if(typeof t=="object"){const i=t,n=Object.keys(i);return n.length===0?"{}":n.map(e=>{const o=i[e],c=/[:#[\]{},&*?|<>=!%@`]/.test(e)||e.includes(" ")||e===""?`"${e}"`:e,a=f(o,l+1);if(typeof o=="object"&&o!==null){if(Array.isArray(o)&&o.length>0)return`${r}${c}:${a}`;if(!Array.isArray(o)&&Object.keys(o).length>0)return`${r}${c}:
${a}`}return`${r}${c}: ${a}`}).join(`
`)}return JSON.stringify(t)}function h(t,l,r){r(20);let i;try{i=JSON.parse(t)}catch(e){throw p("validation-error",`Invalid JSON: ${e.message}`,{retryable:!1})}r(70);const n=f(i,0),s=n.startsWith(`
`)?n.slice(1):n;return r(100),s}const m=j("json-to-yaml");if(!m)throw new Error("[ToolEngine] json-to-yaml not found in registry");const b=g({tool:m,processingMode:"browser",input:{type:"text",placeholder:`Paste JSON here to convert to YAML...

Example: {"name":"Alice","age":30,"tags":["admin","user"]}`,maxLength:5e5,validate:t=>t.trim()?u(t):y(p("validation-error","Please enter some JSON to convert.",{retryable:!1}))},process:h,resultType:"code",layoutMode:"split"});function I(){return d.jsx($,{config:b})}export{I as default};
