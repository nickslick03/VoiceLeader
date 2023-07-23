(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(s){if(s.ep)return;s.ep=!0;const i=n(s);fetch(s.href,i)}})();const O={};function gt(e){O.context=e}const pt=(e,t)=>e===t,V=Symbol("solid-proxy"),fe=Symbol("solid-track"),z={equals:pt};let Oe=Ve;const q=1,Z=2,Ie={owned:null,cleanups:null,context:null,owner:null};var S=null;let R=null,y=null,C=null,D=null,be=0;function Y(e,t){const n=y,r=S,s=e.length===0,i=s?Ie:{owned:null,cleanups:null,context:null,owner:t===void 0?r:t},o=s?e:()=>e(()=>P(()=>le(i)));S=i,y=null;try{return G(o,!0)}finally{y=n,S=r}}function M(e,t){t=t?Object.assign({},z,t):z;const n={value:e,observers:null,observerSlots:null,comparator:t.equals||void 0},r=s=>(typeof s=="function"&&(s=s(n.value)),Re(n,s));return[qe.bind(n),r]}function _(e,t,n){const r=ye(e,t,!1,q);W(r)}function ee(e,t,n){Oe=St;const r=ye(e,t,!1,q);r.user=!0,D?D.push(r):W(r)}function E(e,t,n){n=n?Object.assign({},z,n):z;const r=ye(e,t,!0,0);return r.observers=null,r.observerSlots=null,r.comparator=n.equals||void 0,W(r),qe.bind(r)}function bt(e){return G(e,!1)}function P(e){if(y===null)return e();const t=y;y=null;try{return e()}finally{y=t}}function yt(e){ee(()=>P(e))}function vt(e){return S===null||(S.cleanups===null?S.cleanups=[e]:S.cleanups.push(e)),e}function ke(){return y}function De(e,t){const n=Symbol("context");return{id:n,Provider:xt(n),defaultValue:e}}function Pe(e){let t;return(t=Ge(S,e.id))!==void 0?t:e.defaultValue}function Le(e){const t=E(e),n=E(()=>de(t()));return n.toArray=()=>{const r=n();return Array.isArray(r)?r:r!=null?[r]:[]},n}function qe(){const e=R;if(this.sources&&(this.state||e))if(this.state===q||e)W(this);else{const t=C;C=null,G(()=>ne(this),!1),C=t}if(y){const t=this.observers?this.observers.length:0;y.sources?(y.sources.push(this),y.sourceSlots.push(t)):(y.sources=[this],y.sourceSlots=[t]),this.observers?(this.observers.push(y),this.observerSlots.push(y.sources.length-1)):(this.observers=[y],this.observerSlots=[y.sources.length-1])}return this.value}function Re(e,t,n){let r=e.value;return(!e.comparator||!e.comparator(r,t))&&(e.value=t,e.observers&&e.observers.length&&G(()=>{for(let s=0;s<e.observers.length;s+=1){const i=e.observers[s],o=R&&R.running;o&&R.disposed.has(i),(o&&!i.tState||!o&&!i.state)&&(i.pure?C.push(i):D.push(i),i.observers&&Fe(i)),o||(i.state=q)}if(C.length>1e6)throw C=[],new Error},!1)),t}function W(e){if(!e.fn)return;le(e);const t=S,n=y,r=be;y=S=e,$t(e,e.value,r),y=n,S=t}function $t(e,t,n){let r;try{r=e.fn(t)}catch(s){e.pure&&(e.state=q,e.owned&&e.owned.forEach(le),e.owned=null),Be(s)}(!e.updatedAt||e.updatedAt<=n)&&(e.updatedAt!=null&&"observers"in e?Re(e,r):e.value=r,e.updatedAt=n)}function ye(e,t,n,r=q,s){const i={fn:e,state:r,updatedAt:null,owned:null,sources:null,sourceSlots:null,cleanups:null,value:t,owner:S,context:null,pure:n};return S===null||S!==Ie&&(S.owned?S.owned.push(i):S.owned=[i]),i}function te(e){const t=R;if(e.state===0||t)return;if(e.state===Z||t)return ne(e);if(e.suspense&&P(e.suspense.inFallback))return e.suspense.effects.push(e);const n=[e];for(;(e=e.owner)&&(!e.updatedAt||e.updatedAt<be);)(e.state||t)&&n.push(e);for(let r=n.length-1;r>=0;r--)if(e=n[r],e.state===q||t)W(e);else if(e.state===Z||t){const s=C;C=null,G(()=>ne(e,n[0]),!1),C=s}}function G(e,t){if(C)return e();let n=!1;t||(C=[]),D?n=!0:D=[],be++;try{const r=e();return mt(n),r}catch(r){n||(D=null),C=null,Be(r)}}function mt(e){if(C&&(Ve(C),C=null),e)return;const t=D;D=null,t.length&&G(()=>Oe(t),!1)}function Ve(e){for(let t=0;t<e.length;t++)te(e[t])}function St(e){let t,n=0;for(t=0;t<e.length;t++){const r=e[t];r.user?e[n++]=r:te(r)}for(O.context&&gt(),t=0;t<n;t++)te(e[t])}function ne(e,t){const n=R;e.state=0;for(let r=0;r<e.sources.length;r+=1){const s=e.sources[r];s.sources&&(s.state===q||n?s!==t&&te(s):(s.state===Z||n)&&ne(s,t))}}function Fe(e){const t=R;for(let n=0;n<e.observers.length;n+=1){const r=e.observers[n];(!r.state||t)&&(r.state=Z,r.pure?C.push(r):D.push(r),r.observers&&Fe(r))}}function le(e){let t;if(e.sources)for(;e.sources.length;){const n=e.sources.pop(),r=e.sourceSlots.pop(),s=n.observers;if(s&&s.length){const i=s.pop(),o=n.observerSlots.pop();r<s.length&&(i.sourceSlots[o]=r,s[r]=i,n.observerSlots[r]=o)}}if(e.owned){for(t=0;t<e.owned.length;t++)le(e.owned[t]);e.owned=null}if(e.cleanups){for(t=0;t<e.cleanups.length;t++)e.cleanups[t]();e.cleanups=null}e.state=0,e.context=null}function wt(e){return e instanceof Error||typeof e=="string"?e:new Error("Unknown error")}function Be(e){throw e=wt(e),e}function Ge(e,t){return e?e.context&&e.context[t]!==void 0?e.context[t]:Ge(e.owner,t):void 0}function de(e){if(typeof e=="function"&&!e.length)return de(e());if(Array.isArray(e)){const t=[];for(let n=0;n<e.length;n++){const r=de(e[n]);Array.isArray(r)?t.push.apply(t,r):t.push(r)}return t}return e}function xt(e,t){return function(r){let s;return _(()=>s=P(()=>(S.context={[e]:r.value},Le(()=>r.children))),void 0),s}}const _t=Symbol("fallback");function Ce(e){for(let t=0;t<e.length;t++)e[t]()}function Ct(e,t,n={}){let r=[],s=[],i=[],o=0,l=t.length>1?[]:null;return vt(()=>Ce(i)),()=>{let u=e()||[],a,c;return u[fe],P(()=>{let p=u.length,v,m,T,k,L,w,A,N,j;if(p===0)o!==0&&(Ce(i),i=[],r=[],s=[],o=0,l&&(l=[])),n.fallback&&(r=[_t],s[0]=Y(ce=>(i[0]=ce,n.fallback())),o=1);else if(o===0){for(s=new Array(p),c=0;c<p;c++)r[c]=u[c],s[c]=Y(h);o=p}else{for(T=new Array(p),k=new Array(p),l&&(L=new Array(p)),w=0,A=Math.min(o,p);w<A&&r[w]===u[w];w++);for(A=o-1,N=p-1;A>=w&&N>=w&&r[A]===u[N];A--,N--)T[N]=s[A],k[N]=i[A],l&&(L[N]=l[A]);for(v=new Map,m=new Array(N+1),c=N;c>=w;c--)j=u[c],a=v.get(j),m[c]=a===void 0?-1:a,v.set(j,c);for(a=w;a<=A;a++)j=r[a],c=v.get(j),c!==void 0&&c!==-1?(T[c]=s[a],k[c]=i[a],l&&(L[c]=l[a]),c=m[c],v.set(j,c)):i[a]();for(c=w;c<p;c++)c in T?(s[c]=T[c],i[c]=k[c],l&&(l[c]=L[c],l[c](c))):s[c]=Y(h);s=s.slice(0,o=p),r=u.slice(0)}return s});function h(p){if(i[c]=p,l){const[v,m]=M(c);return l[c]=m,t(u[c],v)}return t(u[c])}}}function d(e,t){return P(()=>e(t||{}))}function I(e){const t="fallback"in e&&{fallback:()=>e.fallback};return E(Ct(()=>e.each,e.children,t||void 0))}function B(e){let t=!1;const n=e.keyed,r=E(()=>e.when,void 0,{equals:(s,i)=>t?s===i:!s==!i});return E(()=>{const s=r();if(s){const i=e.children,o=typeof i=="function"&&i.length>0;return t=n||o,o?P(()=>i(s)):i}return e.fallback},void 0,void 0)}function Ae(e){let t=!1,n=!1;const r=(o,l)=>o[0]===l[0]&&(t?o[1]===l[1]:!o[1]==!l[1])&&o[2]===l[2],s=Le(()=>e.children),i=E(()=>{let o=s();Array.isArray(o)||(o=[o]);for(let l=0;l<o.length;l++){const u=o[l].when;if(u)return n=!!o[l].keyed,[l,u,o[l]]}return[-1]},void 0,{equals:r});return E(()=>{const[o,l,u]=i();if(o<0)return e.fallback;const a=u.children,c=typeof a=="function"&&a.length>0;return t=n||c,c?P(()=>a(l)):a},void 0,void 0)}function X(e){return e}function At(e,t,n){let r=n.length,s=t.length,i=r,o=0,l=0,u=t[s-1].nextSibling,a=null;for(;o<s||l<i;){if(t[o]===n[l]){o++,l++;continue}for(;t[s-1]===n[i-1];)s--,i--;if(s===o){const c=i<r?l?n[l-1].nextSibling:n[i-l]:u;for(;l<i;)e.insertBefore(n[l++],c)}else if(i===l)for(;o<s;)(!a||!a.has(t[o]))&&t[o].remove(),o++;else if(t[o]===n[i-1]&&n[l]===t[s-1]){const c=t[--s].nextSibling;e.insertBefore(n[l++],t[o++].nextSibling),e.insertBefore(n[--i],c),t[s]=n[i]}else{if(!a){a=new Map;let h=l;for(;h<i;)a.set(n[h],h++)}const c=a.get(t[o]);if(c!=null)if(l<c&&c<i){let h=o,p=1,v;for(;++h<s&&h<i&&!((v=a.get(t[h]))==null||v!==c+p);)p++;if(p>c-l){const m=t[o];for(;l<c;)e.insertBefore(n[l++],m)}else e.replaceChild(n[l++],t[o++])}else o++;else t[o++].remove()}}}const Ne="_$DX_DELEGATE";function Nt(e,t,n,r={}){let s;return Y(i=>{s=i,t===document?e():f(t,e(),t.firstChild?null:void 0,n)},r.owner),()=>{s(),t.textContent=""}}function b(e,t,n){const r=document.createElement("template");r.innerHTML=e;let s=r.content.firstChild;return n&&(s=s.firstChild),s}function Q(e,t=window.document){const n=t[Ne]||(t[Ne]=new Set);for(let r=0,s=e.length;r<s;r++){const i=e[r];n.has(i)||(n.add(i),t.addEventListener(i,Et))}}function Ke(e,t,n){n==null?e.removeAttribute(t):e.setAttribute(t,n)}function ve(e,t){t==null?e.removeAttribute("class"):e.className=t}function f(e,t,n,r){if(n!==void 0&&!r&&(r=[]),typeof t!="function")return re(e,t,r,n);_(s=>re(e,t(),s,n),r)}function Et(e){const t=`$$${e.type}`;let n=e.composedPath&&e.composedPath()[0]||e.target;for(e.target!==n&&Object.defineProperty(e,"target",{configurable:!0,value:n}),Object.defineProperty(e,"currentTarget",{configurable:!0,get(){return n||document}}),O.registry&&!O.done&&(O.done=!0,document.querySelectorAll("[id^=pl-]").forEach(r=>{for(;r&&r.nodeType!==8&&r.nodeValue!=="pl-"+e;){let s=r.nextSibling;r.remove(),r=s}r&&r.remove()}));n;){const r=n[t];if(r&&!n.disabled){const s=n[`${t}Data`];if(s!==void 0?r.call(n,s,e):r.call(n,e),e.cancelBubble)return}n=n._$host||n.parentNode||n.host}}function re(e,t,n,r,s){for(O.context&&!n&&(n=[...e.childNodes]);typeof n=="function";)n=n();if(t===n)return n;const i=typeof t,o=r!==void 0;if(e=o&&n[0]&&n[0].parentNode||e,i==="string"||i==="number"){if(O.context)return n;if(i==="number"&&(t=t.toString()),o){let l=n[0];l&&l.nodeType===3?l.data=t:l=document.createTextNode(t),n=F(e,n,r,l)}else n!==""&&typeof n=="string"?n=e.firstChild.data=t:n=e.textContent=t}else if(t==null||i==="boolean"){if(O.context)return n;n=F(e,n,r)}else{if(i==="function")return _(()=>{let l=t();for(;typeof l=="function";)l=l();n=re(e,l,n,r)}),()=>n;if(Array.isArray(t)){const l=[],u=n&&Array.isArray(n);if(he(l,t,n,s))return _(()=>n=re(e,l,n,r,!0)),()=>n;if(O.context){if(!l.length)return n;for(let a=0;a<l.length;a++)if(l[a].parentNode)return n=l}if(l.length===0){if(n=F(e,n,r),o)return n}else u?n.length===0?Ee(e,l,r):At(e,n,l):(n&&F(e),Ee(e,l));n=l}else if(t instanceof Node){if(O.context&&t.parentNode)return n=o?[t]:t;if(Array.isArray(n)){if(o)return n=F(e,n,r,t);F(e,n,null,t)}else n==null||n===""||!e.firstChild?e.appendChild(t):e.replaceChild(t,e.firstChild);n=t}}return n}function he(e,t,n,r){let s=!1;for(let i=0,o=t.length;i<o;i++){let l=t[i],u=n&&n[i];if(l instanceof Node)e.push(l);else if(!(l==null||l===!0||l===!1))if(Array.isArray(l))s=he(e,l,u)||s;else if(typeof l=="function")if(r){for(;typeof l=="function";)l=l();s=he(e,Array.isArray(l)?l:[l],Array.isArray(u)?u:[u])||s}else e.push(l),s=!0;else{const a=String(l);u&&u.nodeType===3&&u.data===a?e.push(u):e.push(document.createTextNode(a))}}return s}function Ee(e,t,n=null){for(let r=0,s=t.length;r<s;r++)e.insertBefore(t[r],n)}function F(e,t,n,r){if(n===void 0)return e.textContent="";const s=r||document.createTextNode("");if(t.length){let i=!1;for(let o=t.length-1;o>=0;o--){const l=t[o];if(s!==l){const u=l.parentNode===e;!i&&!o?u?e.replaceChild(s,l):e.insertBefore(s,n):u&&l.remove()}else i=!0}}else e.insertBefore(s,n);return[s]}const Mt=b('<div class="flex justify-center"><div></div></div>');let ue=1;function Tt(e,t,n){t.staves.forEach((r,s)=>{r.measures.forEach((i,o)=>{const{measures:l}=n.staves[s];i.noteSets.some((u,a)=>u.notes.length!=l[o].noteSets[a].notes.length)&&e.pasteNoteSets(i.noteSets,s,o,0)})})}function jt(e,t,n){t.staves.forEach((r,s)=>{r.measures.forEach((i,o)=>{e.pasteNoteSets(i.noteSets,s,o,0)})}),n.staves[0].measures.length>2&&(e.selectMeasures(2,-1),e.deleteSelection())}const Ot=e=>{const[t,n]=M();return yt(()=>{NFClient.init();const r=new NFClient.ScoreView("score"+ue,"241f3b52f9ea0927019af4137fd88839fe056c26",{width:window.innerWidth,height:400,viewParams:{role:"template"}});e.setScoreView(r),ue++,r.addEventListener("scoreDataLoaded",()=>{r.getScore().done(s=>{n(s)}),r.addEventListener("selectionChange",()=>{r.getScore().done(s=>{s.staves[0].measures.length!=2?(jt(r,t(),s),r.getScore().done(i=>{n(i)})):JSON.stringify(t())!=JSON.stringify(s)&&(Tt(r,t(),s),r.getScore().done(i=>{n(i)}))})})})}),(()=>{const r=Mt.cloneNode(!0),s=r.firstChild;return Ke(s,"id","score"+ue),r})()},It=b("<sup></sup>"),kt=b('<span class="relative"><sup></sup><sub class="absolute -translate-x-full bottom-1/4"></sub></span>'),Dt=b('<div class="pb-1"><span></span><sup></sup></div>'),Me=["I","II","III","IV","V","VI","VII"],Pt=["","6","64"],Lt=["7","65","43","42"],Ue=e=>{const t=E(()=>e.chord.isSeventh?Lt[e.chord.inversion??0]:Pt[e.chord.inversion??0]);return(()=>{const n=Dt.cloneNode(!0),r=n.firstChild,s=r.nextSibling;return f(r,(()=>{const i=E(()=>e.chord.quality.match("major")!==null);return()=>i()?Me[e.chord.numeral-1]:Me[e.chord.numeral-1].toLowerCase()})()),f(s,d(Ae,{get children(){return[d(X,{get when(){return e.chord.quality==="halfDiminished"},children:"ø"}),d(X,{get when(){return e.chord.quality==="diminished"},children:"o"})]}})),f(n,d(Ae,{get children(){return[d(X,{get when(){return t().length===1},get children(){const i=It.cloneNode(!0);return f(i,t),i}}),d(X,{get when(){return t().length===2},get children(){const i=kt.cloneNode(!0),o=i.firstChild,l=o.nextSibling;return f(o,()=>t()[0]),f(l,()=>t()[1]),i}})]}}),null),n})()},ge=Symbol("store-raw"),U=Symbol("store-node"),qt=Symbol("store-name");function He(e,t){let n=e[V];if(!n&&(Object.defineProperty(e,V,{value:n=new Proxy(e,Ft)}),!Array.isArray(e))){const r=Object.keys(e),s=Object.getOwnPropertyDescriptors(e);for(let i=0,o=r.length;i<o;i++){const l=r[i];s[l].get&&Object.defineProperty(e,l,{enumerable:s[l].enumerable,get:s[l].get.bind(n)})}}return n}function se(e){let t;return e!=null&&typeof e=="object"&&(e[V]||!(t=Object.getPrototypeOf(e))||t===Object.prototype||Array.isArray(e))}function H(e,t=new Set){let n,r,s,i;if(n=e!=null&&e[ge])return n;if(!se(e)||t.has(e))return e;if(Array.isArray(e)){Object.isFrozen(e)?e=e.slice(0):t.add(e);for(let o=0,l=e.length;o<l;o++)s=e[o],(r=H(s,t))!==s&&(e[o]=r)}else{Object.isFrozen(e)?e=Object.assign({},e):t.add(e);const o=Object.keys(e),l=Object.getOwnPropertyDescriptors(e);for(let u=0,a=o.length;u<a;u++)i=o[u],!l[i].get&&(s=e[i],(r=H(s,t))!==s&&(e[i]=r))}return e}function $e(e){let t=e[U];return t||Object.defineProperty(e,U,{value:t={}}),t}function pe(e,t,n){return e[t]||(e[t]=Qe(n))}function Rt(e,t){const n=Reflect.getOwnPropertyDescriptor(e,t);return!n||n.get||!n.configurable||t===V||t===U||t===qt||(delete n.value,delete n.writable,n.get=()=>e[V][t]),n}function We(e){if(ke()){const t=$e(e);(t._||(t._=Qe()))()}}function Vt(e){return We(e),Reflect.ownKeys(e)}function Qe(e){const[t,n]=M(e,{equals:!1,internal:!0});return t.$=n,t}const Ft={get(e,t,n){if(t===ge)return e;if(t===V)return n;if(t===fe)return We(e),n;const r=$e(e),s=r.hasOwnProperty(t);let i=s?r[t]():e[t];if(t===U||t==="__proto__")return i;if(!s){const o=Object.getOwnPropertyDescriptor(e,t);ke()&&(typeof i!="function"||e.hasOwnProperty(t))&&!(o&&o.get)&&(i=pe(r,t,i)())}return se(i)?He(i):i},has(e,t){return t===ge||t===V||t===fe||t===U||t==="__proto__"?!0:(this.get(e,t,e),t in e)},set(){return!0},deleteProperty(){return!0},ownKeys:Vt,getOwnPropertyDescriptor:Rt};function ie(e,t,n,r=!1){if(!r&&e[t]===n)return;const s=e[t],i=e.length;n===void 0?delete e[t]:e[t]=n;let o=$e(e),l;(l=pe(o,t,s))&&l.$(()=>n),Array.isArray(e)&&e.length!==i&&(l=pe(o,"length",i))&&l.$(e.length),(l=o._)&&l.$()}function Xe(e,t){const n=Object.keys(t);for(let r=0;r<n.length;r+=1){const s=n[r];ie(e,s,t[s])}}function Bt(e,t){if(typeof t=="function"&&(t=t(e)),t=H(t),Array.isArray(t)){if(e===t)return;let n=0,r=t.length;for(;n<r;n++){const s=t[n];e[n]!==s&&ie(e,n,s)}ie(e,"length",r)}else Xe(e,t)}function K(e,t,n=[]){let r,s=e;if(t.length>1){r=t.shift();const o=typeof r,l=Array.isArray(e);if(Array.isArray(r)){for(let u=0;u<r.length;u++)K(e,[r[u]].concat(t),n);return}else if(l&&o==="function"){for(let u=0;u<e.length;u++)r(e[u],u)&&K(e,[u].concat(t),n);return}else if(l&&o==="object"){const{from:u=0,to:a=e.length-1,by:c=1}=r;for(let h=u;h<=a;h+=c)K(e,[h].concat(t),n);return}else if(t.length>1){K(e[r],t,[r].concat(n));return}s=e[r],n=[r].concat(n)}let i=t[0];typeof i=="function"&&(i=i(s,n),i===s)||r===void 0&&i==null||(i=H(i),r===void 0||se(s)&&se(i)&&!Array.isArray(i)?Xe(s,i):ie(e,r,i))}function Je(...[e,t]){const n=H(e||{}),r=Array.isArray(n),s=He(n);function i(...o){bt(()=>{r&&o.length===1?Bt(n,o[0]):K(n,o)})}return[s,i]}const Ye=De();function Gt(e){const t=Je(Array(7).fill(0).map((n,r)=>({numeral:1,quality:"major",isSeventh:!1,inversion:0})));return d(Ye.Provider,{value:t,get children(){return e.children}})}function oe(){return Pe(Ye)}const Kt=b('<option value="majorMinor">Major-Minor</option>'),Ut=b('<option value="halfDiminished">Half-Diminished</option>'),Ht=b('<div><div class="text-center bg-white px-8 py-4"><h2 class="text-2xl font-bold mb-8">Change Chord</h2><div class="flex justify-center flex-wrap mb-8"><div class="text-6xl pr-8 self-center"></div><div class="text-left flex flex-col gap-4"><label>Scale degree:<select name="scale-degree" id="scale-degree" class="ml-1"></select></label><div class="flex gap-5"></div><label class="block">Qualtiy:&nbsp;<select name="quality" id="quality"><option value="major">Major</option><option value="minor">Minor</option><option value="diminished">Diminished</option></select></label><label>Inversion:&nbsp;<select name="inversion" id="inversion"></select></label></div></div><div class="flex justify-center gap-4"><button class="text-white px-2 py-1 bg-red-600 hover:bg-red-400">Cancel</button><button class="text-white px-2 py-1 bg-green-600 hover:bg-green-400">Save</button></div></div></div>'),Te=b("<option></option>"),Wt=b('<label><input type="radio" name="harmony">&nbsp;</label>'),Qt=e=>{const[t,n]=Je({numeral:1,quality:"major",isSeventh:!1,inversion:0,secondary:1});ee(()=>{e.getCurrentIndex()>-1&&n(Object.assign({},oe()[0][e.getCurrentIndex()]))});const r=o=>{o||((t.quality==="majorMinor"||t.quality==="halfDiminished")&&n("quality","major"),t.inversion===3&&n("inversion",0)),n("isSeventh",o)},s=oe()[1],i=()=>s(e.getCurrentIndex(),{...t});return(()=>{const o=Ht.cloneNode(!0),l=o.firstChild,u=l.firstChild,a=u.nextSibling,c=a.firstChild,h=c.nextSibling,p=h.firstChild,v=p.firstChild,m=v.nextSibling,T=p.nextSibling,k=T.nextSibling,L=k.firstChild,w=L.nextSibling,A=w.firstChild,N=A.nextSibling,j=N.nextSibling,ce=k.nextSibling,at=ce.firstChild,ft=at.nextSibling,we=a.nextSibling,dt=we.firstChild,ht=dt.nextSibling;return f(c,d(Ue,{chord:t})),f(m,d(I,{get each(){return Array(7)},children:(g,x)=>(()=>{const $=Te.cloneNode(!0);return $.$$click=()=>n("numeral",x()+1),f($,()=>x()+1),_(()=>$.selected=x()+1===t.numeral),_(()=>$.value=x()+1),$})()})),f(T,d(I,{each:["Triad","Seventh"],children:g=>(()=>{const x=Wt.cloneNode(!0),$=x.firstChild;return $.nextSibling,$.$$click=()=>r(g==="Seventh"),Ke($,"id",g),f(x,g,null),_(()=>$.checked=g==="Seventh"===t.isSeventh),x})()})),A.$$click=()=>n("quality","major"),f(w,d(B,{get when(){return t.isSeventh},get children(){const g=Kt.cloneNode(!0);return g.$$click=()=>n("quality","majorMinor"),_(()=>g.selected=t.quality==="majorMinor"),g}}),N),N.$$click=()=>n("quality","minor"),f(w,d(B,{get when(){return t.isSeventh},get children(){const g=Ut.cloneNode(!0);return g.$$click=()=>n("quality","halfDiminished"),_(()=>g.selected=t.quality==="halfDiminished"),g}}),j),j.$$click=()=>n("quality","diminished"),f(ft,d(I,{each:["root","1st","2nd","3rd"],children:(g,x)=>d(B,{get when(){return x()!==3||t.isSeventh},get children(){const $=Te.cloneNode(!0);return $.$$click=()=>n("inversion",x()),f($,g),_(()=>$.selected=t.inversion===x()),_(()=>$.value=x()),$}})})),we.$$click=g=>{g.target.nodeName==="BUTTON"&&(e.setShowModal(!1),e.setCurrentIndex(-1))},ht.$$click=i,_(g=>{const x=`fixed top-0 w-screen h-screen z-10
        bg-gray-700 bg-opacity-50 
        flex justify-center items-center`+(e.getShowModal()?"":" hidden"),$=t.quality==="major",xe=t.quality==="minor",_e=t.quality==="diminished";return x!==g._v$&&ve(o,g._v$=x),$!==g._v$2&&(A.selected=g._v$2=$),xe!==g._v$3&&(N.selected=g._v$3=xe),_e!==g._v$4&&(j.selected=g._v$4=_e),g},{_v$:void 0,_v$2:void 0,_v$3:void 0,_v$4:void 0}),o})()};Q(["click"]);const Xt=b('<div class="flex justify-center gap-2 flex-wrap"></div>'),Jt=b('<div class="bg-gray-400 p-2"><div class="flex justify-center gap-2"></div><div class="text-center pt-1">Measure </div></div>'),Yt=b('<div class="bg-white p-2"></div>'),zt=()=>{const e=E(()=>oe()[0]),[t,n]=M(!1),[r,s]=M(-1),i=o=>{s(o),n(!0)};return[(()=>{const o=Xt.cloneNode(!0);return f(o,d(I,{get each(){return Array(2)},children:(l,u)=>(()=>{const a=Jt.cloneNode(!0),c=a.firstChild,h=c.nextSibling;return h.firstChild,f(c,d(I,{get each(){return Array(u()===0?4:3)},children:(p,v)=>(()=>{const m=Yt.cloneNode(!0);return m.$$click=()=>i(u()*4+v()),f(m,d(Ue,{get chord(){return e()[u()*4+v()]}})),m})()})),f(h,()=>u()+1,null),a})()})),o})(),d(Qt,{getShowModal:t,setShowModal:n,getCurrentIndex:r,setCurrentIndex:s})]};Q(["click"]);const Zt=b('<div class="py-3 flex flex-col gap-5"><div class="text-lg text-center">To change the key signature and mode, go to <br><span class="text-orange-600 font-bold">Palettes </span>&gt; Measure &gt; Change Key Signature.</div><div class="text-center">Chords:</div></div>'),en=()=>(()=>{const e=Zt.cloneNode(!0),t=e.firstChild,n=t.nextSibling;return n.firstChild,f(n,d(zt,{}),null),e})(),tn=b("<li></li>"),nn=b("<ul></ul>"),rn=b('<li class="list-disc ml-4"></li>'),je=e=>(()=>{const t=tn.cloneNode(!0);return f(t,()=>e.message()?.message,null),f(t,(()=>{const n=E(()=>typeof e.message()?.list=="object");return()=>n()?(()=>{const r=nn.cloneNode(!0);return f(r,d(I,{get each(){return e.message()?.list},children:s=>(()=>{const i=rn.cloneNode(!0);return f(i,s),i})()})),r})():""})(),null),_(()=>ve(t,"mb-1 "+(e.message()?.isCorrect?"list-['✅']":"list-['🚫']"))),t})(),sn=b('<span class="font-bold float-right">+ <!> point</span>'),on=b('<div><ul class="mt-1 [&amp;>li]:ml-4 flex flex-col gap-1"></ul><button class="block underline">see </button></div>'),ln=b("<span>chord </span>"),cn=e=>{const[t,n]=M(!1),r=E(()=>e.result.messages?.findIndex(({isCorrect:i})=>!i)),s=E(()=>r()===-1?{message:"Everything's correct!",points:0,isCorrect:!0}:e.result.messages?.[r()]);return(()=>{const i=on.cloneNode(!0),o=i.firstChild,l=o.nextSibling;return l.firstChild,f(i,d(I,{get each(){return e.indicies},children:(u,a)=>(()=>{const c=ln.cloneNode(!0);return c.firstChild,f(c,u+1,null),f(c,()=>e.indicies.length-1===a()?"":" -> ",null),c})()}),o),f(i,d(B,{get when(){return e.indicies.length!==1||e.indicies[0]!==0},get children(){const u=sn.cloneNode(!0),a=u.firstChild,c=a.nextSibling;return c.nextSibling,f(u,()=>e.result.points??0,c),f(u,()=>e.result.points===1?"":"s",null),u}}),o),f(o,d(B,{get when(){return t()},get fallback(){return d(je,{message:s})},get children(){return d(I,{get each(){return e.result.messages},children:u=>d(je,{message:()=>u})})}})),l.$$click=()=>n(!t()),f(l,()=>t()?"less":"more...",null),_(()=>ve(i,`${r()===-1?"bg-green-500":"bg-red-500"} bg-opacity-40
        border-black border-b-[1px] last:border-b-0
        py-2 px-2`)),i})()};Q(["click"]);const un=b('<div><div class="bg-white px-4 py-2 cursor-pointer"><button class="font-bold float-right">▲</button></div></div>'),an=e=>{const[t,n]=M(!0),r=E(()=>oe()[0]),[s,i]=M();return ee(()=>{const o=e.voiceLead();i(o?.bass.map((l,u)=>e.graderFunction([l,o.tenor[u],o.alto[u],o.soprano[u]],r()[u],P(e.isKeyMajor)??!0)))}),ee(()=>{e.setTotalPoints(o=>o+(s()?.reduce((l,u,a)=>a===0?0:u.points+l,0)??0))}),(()=>{const o=un.cloneNode(!0),l=o.firstChild,u=l.firstChild;return l.$$click=()=>n(!t()),f(l,()=>e.children,u),f(o,d(B,{get when(){return t()},get children(){return d(I,{get each(){return s()},children:(a,c)=>d(cn,{get indicies(){return[c()]},result:a})})}}),null),_(()=>u.style.setProperty("transform",`rotate(${t()?180:0}deg)`)),o})()};Q(["click"]);const ze=De();function fn(e){const t=M();return d(ze.Provider,{value:t,get children(){return e.children}})}function Ze(){return Pe(ze)}const me=[0,2,4,5,7,9,11],Se=[0,2,3,5,7,8,10],dn={flat:-1,sharp:1,doubleFlat:-2,doubleSharp:2,natural:0},hn={majorTriad:[0,4,7],minorTriad:[0,3,7],diminishedTriad:[0,3,6],majorSeventh:[0,4,7,11],majorMinorSeventh:[0,4,7,10],minorSeventh:[0,3,7,10],halfDiminishedSeventh:[0,3,6,10],diminishedSeventh:[0,3,6,9]};function gn({accidental:e,pitch:t},n){const r=dn[e??"natural"],s=(t+(n.mode=="minor"?3:0)+n.fifths*5-r)%12;return{degree:n.mode=="major"?me.findIndex(o=>o==s)+1:Se.findIndex(o=>o==s)+1,accidental:r}}function pn(e,t){return((t?me:Se)[e.degree-1]+e.accidental)%12}function bn(e,t){const n=[[],[],[],[]];return e.staves.forEach((r,s)=>{r.measures.forEach(i=>{i.noteSets.forEach(o=>{(s==0?[1,0]:[3,2]).forEach((u,a)=>{n[u].push({note:o.notes[a],scaleDegree:gn(o.notes[a],t)})})})})}),{keySignature:t,soprano:n[0],alto:n[1],tenor:n[2],bass:n[3]}}function yn(e,t){const n=hn[e.quality+(e.isSeventh?"Seventh":"Triad")],r=t?me:Se;return n.map(s=>(r[e.numeral-1]+s)%12)}const vn=[1,3,5,7],J=["bass part","tenor part","alto part","soprano part"],$n=["1st","3rd","5th","7th"],ae=[{function:et,points:1,correctMessage:"The chord is spelled correctly",errorMessage:"The chord is misspelled in the:",array:J},{function:tt,points:1,correctMessage:"The chord is spelled correctly enharmonically",errorMessage:"The chord is enharmonically misspelled in the:",array:J},{function:nt,points:1,correctMessage:"The chord spelling is in the correct inversion",errorMessage:"The chord spelling is not in the correct inversion",array:null},{function:rt,points:1,correctMessage:"The chord spelling has no ommitted notes",errorMessage:"The chord spelling has the following scale degrees ommitted:",array:$n},{function:it,points:.5,correctMessage:"The leading tone is not doubled",errorMessage:"The leading tone is doubled in the:",array:J},{function:ot,points:.5,correctMessage:"The chordal seventh is not doubled",errorMessage:"The chordal seventh is doubled in the:",array:J},{function:lt,points:.5,correctMessage:"The fifth in the 6 4 chord is doubled",errorMessage:"The fifth in the 6 4 chord is not doubled",array:null},{function:ct,points:.5,correctMessage:"All adjacent upper voices are within an octave apart",errorMessage:"These adjacent upper voices are more than an octave apart:",array:["tenor to alto","alto to soprano"]},{function:ut,points:.5,correctMessage:"There are no voice crossings",errorMessage:"There are voice crossings between these voice parts",array:["bass to alto","bass to soprano","tenor to alto","tenor to soprano"]}];function et(e,t){return e.reduce((n,r,s)=>(t.includes(r)||n.push(s),n),[])}function tt(e,t,n){return e.reduce((r,s,i)=>{const o=(s.degree+(7-t))%7+1;return(vn.indexOf(o)===-1||!n&&o===7||o===1&&s.accidental!==0)&&r.push(i),r},[])}function nt(e,t,n){return e==t[n]}function rt(e,t,n){return t.reduce((r,s,i)=>{const o=e.includes(s),l=s==t[2];return o||n&&l||r.push(i),r},[])}function st(e,t){const n=e.map((r,s)=>r===t?s:-1).filter(r=>r>-1);return n.length>=2?n:[]}function it(e){return st(e,11)}function ot(e,t){return st(e,t)}function lt(e,t){return e.indexOf(t)!==e.lastIndexOf(t)}function ct(e,t,n){return[t-e>12?0:-1,n-t>12?1:-1].filter(r=>r!==-1)}function ut(e,t,n,r){return[e>n?0:-1,e>r?1:-1,t>n?2:-1,t>r?3:-1].filter(s=>s!==-1)}function mn(e,t,n){const r=e.map(({scaleDegree:a})=>pn(a,n)),s=yn(t,n),i=e.map(({scaleDegree:a})=>a),o=e.map(({note:a})=>a.pitch);let l=1;return{messages:[et(r,s),tt(i,t.numeral,t.isSeventh),nt(r[0],s,t.inversion),rt(r,s,t.inversion===0),it(r),t.isSeventh?ot(r,s[3]):[],t.inversion===2&&!t.isSeventh?lt(r,s[2]):!0,ct(o[1],o[2],o[3]),ut(o[0],o[1],o[2],o[3])].map((a,c)=>{const h=typeof a=="object"?a.length===0:a;h||(l-=ae[c].points);const p=ae[c][`${h?"correct":"error"}Message`],v=!h&&typeof a=="object"?a.map(m=>ae[c].array[m]):void 0;return{isCorrect:h,message:p,list:v}}),points:l<0?0:l}}const Sn=b(`<button class="fixed top-8 right-4 px-4 py-2 text-white
                bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400">Grade</button>`),wn=b(`<div class="fixed top-0 left-full w-96 text-center
                h-screen bg-gray-200 px-4 py-8 shadow-lg shadow-gray-400
                transition-transform duration-500
                flex flex-col gap-6
                overflow-scroll"><h2 class="text-2xl font-bold">Points: <!> / 18</h2><div class="sticky bottom-0 flex-1 
                    flex justify-center gap-4 items-end"><button class="text-white px-4 py-2 bg-red-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-red-400">Close</button><button class="text-white px-4 py-2 bg-green-600 shadow-md shadow-[rgba(0,0,0,.3)] hover:bg-green-400">Grade Again</button></div></div>`),xn=b('<div class="text-left"></div>'),_n=()=>{const[e,t]=M(!1),n=Ze()[0],[r,s]=M(),[i,o]=M(),[l,u]=M(0),a=()=>{u(0),n()?.getScore().done(c=>{n()?.getKeySignature().done(h=>{s(bn(c,h)),o(h.mode==="major")})})};return[(()=>{const c=Sn.cloneNode(!0);return c.$$click=()=>{a(),t(!0)},c})(),(()=>{const c=wn.cloneNode(!0),h=c.firstChild,p=h.firstChild,v=p.nextSibling;v.nextSibling;const m=h.nextSibling,T=m.firstChild,k=T.nextSibling;return f(h,l,v),f(c,d(I,{each:["Chord Spelling"],children:L=>(()=>{const w=xn.cloneNode(!0);return f(w,d(an,{voiceLead:r,graderFunction:mn,isKeyMajor:i,setTotalPoints:u,children:L})),w})()}),m),T.$$click=()=>t(!1),k.$$click=()=>a(),_(()=>c.style.setProperty("transform",`translateX(-${e()?"100":"0"}%)`)),c})()]};Q(["click"]);const Cn=b('<hgroup class="text-center my-8 flex flex-col items-center gap-4"><h1 class="text-4xl font-bold pb-4 border-b-2">Voice Leader</h1><p>Grader for AP Music Theory Question 6</p></hgroup>'),An=()=>[Cn.cloneNode(!0),d(Ot,{get setScoreView(){return Ze()[1]}}),d(en,{}),d(_n,{})],Nn=document.getElementById("root");Nt(()=>d(Gt,{get children(){return d(fn,{get children(){return d(An,{})}})}}),Nn);