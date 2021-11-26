!function(){var e,t={80:function(e,t,n){"use strict";var o=window.wp.element,r=window.wp.blocks,l=window.wp.i18n,i=n(184),c=n.n(i),a=window.lodash,s=window.wp.blockEditor,u=window.wp.components,d=window.wp.data,p=window.wp.compose,m=n(762);n.n(m)()((e=>void 0===e?null:(0,a.times)(e,(()=>["madeit/block-content-column"]))));const g=e=>Number.isFinite(e)?parseFloat(e.toFixed(2)):void 0;function v(e,t){const{width:n=100/t}=e.attributes;return g(n)}function f(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.length;return(0,a.sumBy)(e,(e=>v(e,t)))}function h(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.length;return e.reduce(((e,n)=>{const o=v(n,t);return Object.assign(e,{[n.clientId]:o})}),{})}function b(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e.length;const o=f(e,n),r=t-o,l=r/e.length;return(0,a.mapValues)(h(e,n),(e=>g(e+l)))}var k=(0,p.compose)((0,s.withColors)("backgroundColor","textColor"),(0,d.withSelect)(((e,t)=>{const{clientId:n}=t,{getBlockOrder:o}=e("core/block-editor");return{hasChildBlocks:o(n).length>0}})),(0,d.withDispatch)(((e,t,n)=>({updateAlignment(o){const{clientId:r,setAttributes:l}=t,{updateBlockAttributes:i}=e("core/block-editor"),{getBlockRootClientId:c}=n.select("core/block-editor");l({verticalAlignment:o}),i(c(r),{verticalAlignment:null})},updateWidth(o){const{clientId:r}=t,{updateBlockAttributes:l}=e("core/block-editor"),{getBlockRootClientId:i,getBlocks:c}=n.select("core/block-editor"),s=c(i(r)),u=function(e,t){const n=(0,a.findIndex)(e,{clientId:t});return n===e.length-1?e.slice(0,n):e.slice(n+1)}(s,r),d=o+f((0,a.difference)(s,[(0,a.find)(s,{clientId:r}),...u])),p={...h(s,s.length),[r]:g(o),...b(u,12-d,s.length)};(0,a.forEach)(p,((e,t)=>{l(t,{width:e})}))}}))))((function(e){const{attributes:t,updateAlignment:n,updateWidth:r,hasChildBlocks:i,backgroundColor:a,setBackgroundColor:d,textColor:p,setTextColor:m,className:g}=e,{verticalAlignment:v,width:f}=t,h=c()(g,c()("block-core-columns",{[`is-vertically-aligned-${v}`]:v}));var b={backgroundColor:a.color,color:p.color};const k=(0,s.useBlockProps)({className:h,style:b});return(0,o.createElement)("div",k,(0,o.createElement)(s.BlockControls,null,(0,o.createElement)(s.BlockVerticalAlignmentToolbar,{onChange:n,value:v})),(0,o.createElement)(s.InspectorControls,null,(0,o.createElement)(u.PanelBody,{title:(0,l.__)("Column Settings")},(0,o.createElement)(u.RangeControl,{label:(0,l.__)("Percentage width"),value:f||"",onChange:r,min:1,max:12,required:!0,allowReset:!0})),(0,o.createElement)(s.PanelColorSettings,{title:(0,l.__)("Column Color Settings"),initialOpen:!1,colorSettings:[{value:a.color,onChange:e=>d(e),label:(0,l.__)("Background Color")},{value:p.color,onChange:e=>m(e),label:(0,l.__)("Text Color")}]},(0,o.createElement)(s.ContrastChecker,{textColor:p.color,backgroundColor:a.color,fallbackTextColor:"#FFFFFF",fallbackBackgroundColor:"#000000"}))),(0,o.createElement)(s.InnerBlocks,{templateLock:!1,renderAppender:i?void 0:()=>(0,o.createElement)(s.InnerBlocks.ButtonBlockAppender,null)}))})),C=JSON.parse('{"$schema":"https://json.schemastore.org/block.json","apiVersion":2,"name":"madeit/block-content-column","version":"0.1.0","title":"Content Column by Made I.T.","category":"madeit","icon":"smiley","description":"Example block written with ESNext standard and JSX support – build step required.","supports":{"html":false},"textdomain":"content-column","editorScript":"file:./build/index.js","editorStyle":"file:./build/index.css","style":"file:./build/style-index.css"}');const{Path:w,SVG:x}=wp.components;var y=(0,o.createElement)(x,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,o.createElement)(w,{fill:"none",d:"M0 0h24v24H0V0z"}),(0,o.createElement)(w,{d:"M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z"}));(0,r.registerBlockType)(C,{title:(0,l.__)("Content Column by Made I.T."),icon:y,category:"madeit",keywords:[(0,l.__)("content — Made I.T."),(0,l.__)("columns"),(0,l.__)("Made I.T.")],supports:{inserter:!1,reusable:!1,html:!1},getEditWrapperProps(e){const{width:t}=e;if(Number.isFinite(t))return{style:{flexBasis:t*(100/12)+"%"}}},attributes:{verticalAlignment:{type:"string"},width:{type:"number",min:0,max:12},backgroundColor:{type:"string"},customBackgroundColor:{type:"string"},textColor:{type:"string"},customTextColor:{type:"string"}},edit:k,save:function(e){const{verticalAlignment:t,width:n,customBackgroundColor:r,backgroundColor:l,customTextColor:i,textColor:a}=e.attributes,{className:u}=e,d=l?(0,s.getColorClassName)("background-color",l):void 0,p=a?(0,s.getColorClassName)("color",a):void 0;var m=c()(u,{[`is-vertically-aligned-${t}`]:t,"col-12":!0,[`col-lg-${n}`]:n});m=c()(m,{"has-text-color":p,"has-background":d,[d]:d,[p]:p});var g={backgroundColor:d?void 0:r,color:p?void 0:i};const v=s.useBlockProps.save({className:m,style:g});return(0,o.createElement)("div",v,(0,o.createElement)(s.InnerBlocks.Content,null))},deprecated:[{save:function(e){let{attributes:t}=e;const{verticalAlignment:n,width:r}=t;var l=classnames("col",{[`is-vertically-aligned-${n}`]:n,[`col-md-${r}`]:r});return(0,o.createElement)("div",{className:l,style:void 0},(0,o.createElement)(InnerBlocks.Content,null))}}]})},184:function(e,t){var n;!function(){"use strict";var o={}.hasOwnProperty;function r(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var l=typeof n;if("string"===l||"number"===l)e.push(n);else if(Array.isArray(n)){if(n.length){var i=r.apply(null,n);i&&e.push(i)}}else if("object"===l)if(n.toString===Object.prototype.toString)for(var c in n)o.call(n,c)&&n[c]&&e.push(c);else e.push(n.toString())}}return e.join(" ")}e.exports?(r.default=r,e.exports=r):void 0===(n=function(){return r}.apply(t,[]))||(e.exports=n)}()},762:function(e){e.exports=function(e,t){var n,o,r=0;function l(){var l,i,c=n,a=arguments.length;e:for(;c;){if(c.args.length===arguments.length){for(i=0;i<a;i++)if(c.args[i]!==arguments[i]){c=c.next;continue e}return c!==n&&(c===o&&(o=c.prev),c.prev.next=c.next,c.next&&(c.next.prev=c.prev),c.next=n,c.prev=null,n.prev=c,n=c),c.val}c=c.next}for(l=new Array(a),i=0;i<a;i++)l[i]=arguments[i];return c={args:l,val:e.apply(null,l)},n?(n.prev=c,c.next=n):o=c,r===t.maxSize?(o=o.prev).next=null:r++,n=c,c.val}return t=t||{},l.clear=function(){n=null,o=null,r=0},l}}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var l=n[e]={exports:{}};return t[e](l,l.exports,o),l.exports}o.m=t,e=[],o.O=function(t,n,r,l){if(!n){var i=1/0;for(u=0;u<e.length;u++){n=e[u][0],r=e[u][1],l=e[u][2];for(var c=!0,a=0;a<n.length;a++)(!1&l||i>=l)&&Object.keys(o.O).every((function(e){return o.O[e](n[a])}))?n.splice(a--,1):(c=!1,l<i&&(i=l));if(c){e.splice(u--,1);var s=r();void 0!==s&&(t=s)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[n,r,l]},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,{a:t}),t},o.d=function(e,t){for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={826:0,46:0};o.O.j=function(t){return 0===e[t]};var t=function(t,n){var r,l,i=n[0],c=n[1],a=n[2],s=0;if(i.some((function(t){return 0!==e[t]}))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(a)var u=a(o)}for(t&&t(n);s<i.length;s++)l=i[s],o.o(e,l)&&e[l]&&e[l][0](),e[i[s]]=0;return o.O(u)},n=self.webpackChunkcontent_column=self.webpackChunkcontent_column||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var r=o.O(void 0,[46],(function(){return o(80)}));r=o.O(r)}();