var CSSinJSON=function(e){"use strict";let t=/\{(\^*)([0-9a-z]+)\}/i,r=/&/g,n=Array.isArray,l=e=>e!=e,a=(e,t)=>(typeof e)[0]===(t=t||"s"),c=e=>n(e)?e:[e],p=e=>e.reduce((e,t)=>e.concat(t),[]),o=(e,t,r)=>{(t=t||{})._=t._||[],r=!a(r,"b")||r,a(e)&&(e=JSON.parse(e));let l=[];if(n(e)){if(a(e[0]))return u(e,t);for(let r=0;r<e.length;r++)l[r]=o(e[r],t,!1)}else if(e.$){let r=[],n={};for(let l=0;l<e.$.length;l++){let a=u(e.$[l][0],t),i=f(t,{_:t._.concat([e.$[l]])}),h=o(c(e._),i,!1).reduce((e,t)=>(e[~~s(t)].push(t),e),[[],[]]);r.push.apply(r,p(h[0])),h[1].length&&(n[a]=(n[a]||[]).concat(h[1]))}l=Object.entries(n).concat(r)}else{let r=[t];Object.keys(e).forEach(t=>{"_"!==t&&(a(e[t])&&(e[t]=_(e[t])),r=p(e[t].map(e=>r.map(r=>((r=f(r))[t]=e,r)))))});for(let t=0;t<r.length;t++)l[t]=o(c(e._),r[t],!1)}return r?h(l):l},i=e=>e.map(e=>`${e[0]} { ${e[1].map(e=>n(e[1])?i([e]):`${e[0]}: ${e[1]}`).join("; ")} }`).join("\n"),u=(e,l,c)=>{if((l=l||{})._=l._||[],c=!a(c,"b")||c,n(e))return e.map(e=>u(e,l,!1));let p=(e+="").match(t);for(;p;){let r=l._.length-p[1].length-1,n=parseInt(p[2]),c=n==n&&r>=0?n:p[2];p=(e=e.replace(p[0],(a(c,"n")?l._[r]:l)[c])).match(t)}if(c&&l._.length){let t=l._[l._.length-1][0];return~e.indexOf("&")?e.replace(r,t):`${t}${e}`}return e},f=(e,t)=>{t=t||{};for(let r in e){let n=e[r];t[r]=t[r]||(n&&a(n,"o")?f(n.constructor(),n):n)}return t},s=e=>a(e[0])&&a(e[1]),h=e=>{let t=(e=>{if(!a(e[0])||!n(e[1]))return!1;let t=1;for(let r=0;r<e[1].length;r++)s(e[1][r])||(t=2);return t})(e);return 2===t&&(e[1]=h(e[1])),t?[e]:p(e.map(e=>h(e)))},_=e=>{let t=e.split(":").map(e=>parseInt(e));if(l(t[0])||l(t[1])||l(t[2]))return[e];let r=t[0],n=t[~~a(t[1],"n")],c=t[2]||1,p=[],o=r;for(;r<=o&&o<=n;)p.push(o),o+=c;return p};return e.compile=(e,t,r)=>i(o(e,t,r)),e.deepClone=f,e.expand=o,e.generate=i,e.inject=u,e}({});