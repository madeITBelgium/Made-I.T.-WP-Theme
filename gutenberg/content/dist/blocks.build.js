!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,n){var o,r;!function(){"use strict";function n(){for(var e=[],t=0;t<arguments.length;t++){var o=arguments[t];if(o){var r=typeof o;if("string"===r||"number"===r)e.push(o);else if(Array.isArray(o)&&o.length){var i=n.apply(null,o);i&&e.push(i)}else if("object"===r)for(var a in o)l.call(o,a)&&o[a]&&e.push(a)}}return e.join(" ")}var l={}.hasOwnProperty;"undefined"!==typeof e&&e.exports?(n.default=n,e.exports=n):(o=[],void 0!==(r=function(){return n}.apply(t,o))&&(e.exports=r))}()},function(e,t){e.exports=lodash},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object(s.findIndex)(e,{clientId:t});return n===e.length-1?e.slice(0,n):e.slice(n+1)}function l(e,t){var n=e.attributes.width;return p(void 0===n?100/t:n)}function i(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.length;return Object(s.sumBy)(e,function(e){return l(e,t)})}function a(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:e.length;return e.reduce(function(e,n){var r=l(n,t);return Object.assign(e,o({},n.clientId,r))},{})}function c(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:e.length,o=i(e,n),r=t-o,l=r/e.length;return Object(s.mapValues)(a(e,n),function(e){return p(e+l)})}function u(e,t){return e.map(function(e){return Object(s.merge)({},e,{attributes:{width:t[e.clientId]}})})}n.d(t,"f",function(){return p}),t.a=r,t.e=i,t.b=a,t.d=c,t.c=u;var d=n(8),m=n.n(d),s=n(1),p=(n.n(s),m()(function(e){return void 0===e?null:Object(s.times)(e,function(){return["madeit/block-content-column"]})}),function(e){return Number.isFinite(e)?parseFloat(e.toFixed(2)):void 0})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});n(4),n(14)},function(e,t,n){"use strict";var o=n(5),r=(n.n(o),n(6)),l=(n.n(r),n(7)),i=n(10),a=n(11),c=n(12),__=wp.i18n.__;(0,wp.blocks.registerBlockType)("madeit/block-content",{title:__("Content by Made I.T."),icon:a.a,category:"common",keywords:[__("content \u2014 Made I.T."),__("columns"),__("Made I.T.")],variations:c.a,supports:{html:!1},attributes:{verticalAlignment:{type:"string"},containerBackgroundColor:{type:"string"},customContainerBackgroundColor:{type:"string"},size:{type:"string",default:"container"},containerMarginBottom:{type:"number",default:0},containerMarginTop:{type:"number",default:0},containerPaddingTop:{type:"number",default:0},containerPaddingBottom:{type:"number",default:0},containerPaddingLeft:{type:"number",default:0},containerPaddingRight:{type:"number",default:0},rowBackgroundColor:{type:"string"},customRowBackgroundColor:{type:"string"},rowTextColor:{type:"string"},customRowTextColor:{type:"string"},rowMarginBottom:{type:"number",default:0},rowMarginTop:{type:"number",default:0},rowPaddingTop:{type:"number",default:0},rowPaddingBottom:{type:"number",default:0},rowPaddingLeft:{type:"number",default:0},rowPaddingRight:{type:"number",default:0}},getEditWrapperProps:function(e){var t=e.size;return"container-fluid"===t||"container-content-boxed"===t?{"data-align":"full"}:{"data-align":"container"}},edit:l.a,save:i.a})},function(e,t){},function(e,t){},function(e,t,n){"use strict";function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e){var t,n,o=e.attributes,l=e.setAttributes,i=e.className,c=e.updateAlignment,u=e.updateColumns,d=e.clientId,m=e.containerBackgroundColor,s=e.setContainerBackgroundColor,f=e.rowBackgroundColor,b=e.setRowBackgroundColor,v=e.rowTextColor,E=e.setRowTextColor,T=o.verticalAlignment,P=o.size,V=o.containerMarginTop,O=o.containerMarginBottom,j=o.containerPaddingTop,R=o.containerPaddingBottom,H=o.containerPaddingLeft,I=o.containerPaddingRight,F=o.rowMarginTop,S=o.rowMarginBottom,L=o.rowPaddingTop,z=o.rowPaddingBottom,N=o.rowPaddingLeft,_=o.rowPaddingRight,Z=[{value:"container",label:__("Boxed")},{value:"container-content-boxed",label:__("Full width - Content boxed")},{value:"container-fluid",label:__("Full width")}],G=M(function(e){return{count:e("core/block-editor").getBlockCount(d)}}),q=G.count,D=a()(i,r({},"are-vertically-aligned-"+T,T));D=a()(D,(t={},r(t,"container","container"===P),r(t,"container-fluid","container-fluid"===P||"container-content-boxed"===P),t));var W=a()("",(n={},r(n,"container","container"===P||"container-content-boxed"===P),r(n,"container-fluid","container-fluid"===P),n)),J={backgroundColor:m.color};V>0&&(J.marginTop=V+28+"px"),O>0&&(J.marginBottom=O+28+"px"),j>0&&(J.paddingTop=j+"px"),R>0&&(J.paddingBottom=R+"px"),H>0&&(J.paddingLeft=H+"px"),I>0&&(J.paddingRight=I+"px");var K={};return"container-content-boxed"===P?(K={backgroundColor:f.color,color:v.color},F>0&&(K.marginTop=F+"px"),S>0&&(K.marginBottom=S+"px"),L>0&&(K.paddingTop=L+"px"),z>0&&(K.paddingBottom=z+"px"),N>0&&(K.paddingLeft=N+"px"),_>0&&(K.paddingRight=_+"px")):J.color=v.color,[wp.element.createElement(h,null,wp.element.createElement(p,{title:__("Container settings"),initialOpen:!0},wp.element.createElement(w,{label:__("Size"),value:P,options:Z.map(function(e){return{value:e.value,label:e.label}}),onChange:function(e){return l({size:e})}}),wp.element.createElement(p,{title:__("Margin"),initialOpen:!1},wp.element.createElement(g,{label:__("Top"),value:V,min:"0",max:"100",onChange:function(e){l({containerMarginTop:e})}}),wp.element.createElement(g,{label:__("Bottom"),value:O,min:"0",max:"100",onChange:function(e){l({containerMarginBottom:e})}})),wp.element.createElement(p,{title:__("Padding"),initialOpen:!1},wp.element.createElement(g,{label:__("Top"),value:j,min:"0",max:"100",onChange:function(e){l({containerPaddingTop:e})}}),wp.element.createElement(g,{label:__("Bottom"),value:R,min:"0",max:"100",onChange:function(e){l({containerPaddingBottom:e})}}),wp.element.createElement(g,{label:__("Left"),value:H,min:"0",max:"100",onChange:function(e){l({containerPaddingLeft:e})}}),wp.element.createElement(g,{label:__("Right"),value:I,min:"0",max:"100",onChange:function(e){l({containerPaddingRight:e})}})),"container-content-boxed"!==P&&wp.element.createElement(y,{title:__("Container Color Settings"),initialOpen:!1,colorSettings:[{value:m.color,onChange:function(e){return s(e)},label:__("Background Color")},{value:v.color,onChange:function(e){return E(e)},label:__("Text Color")}]},wp.element.createElement(B,{textColor:v.color,backgroundColor:m.color,fallbackTextColor:"#FFFFFF",fallbackBackgroundColor:"#000000"})),"container-content-boxed"===P&&wp.element.createElement(y,{title:__("Container Color Settings"),initialOpen:!1,colorSettings:[{value:m.color,onChange:function(e){return s(e)},label:__("Background Color")}]},wp.element.createElement(B,{textColor:v.color,backgroundColor:m.color,fallbackTextColor:"#FFFFFF",fallbackBackgroundColor:"#000000"}))),wp.element.createElement(p,{title:__("Row settings"),initialOpen:!0},wp.element.createElement(g,{label:__("Columns"),value:q,onChange:function(e){return u(q,e)},min:1,max:6}),"container-content-boxed"===P&&wp.element.createElement("div",null,wp.element.createElement(p,{title:__("Margin"),initialOpen:!1},wp.element.createElement(g,{label:__("Top"),value:F,min:"0",max:"100",onChange:function(e){l({rowMarginTop:e})}}),wp.element.createElement(g,{label:__("Bottom"),value:S,min:"0",max:"100",onChange:function(e){l({rowMarginBottom:e})}})),wp.element.createElement(p,{title:__("Padding"),initialOpen:!1},wp.element.createElement(g,{label:__("Top"),value:L,min:"0",max:"100",onChange:function(e){l({rowPaddingTop:e})}}),wp.element.createElement(g,{label:__("Bottom"),value:z,min:"0",max:"100",onChange:function(e){l({rowPaddingBottom:e})}}),wp.element.createElement(g,{label:__("Left"),value:N,min:"0",max:"100",onChange:function(e){l({rowPaddingLeft:e})}}),wp.element.createElement(g,{label:__("Right"),value:_,min:"0",max:"100",onChange:function(e){l({rowPaddingRight:e})}})),wp.element.createElement(y,{title:__("Row Color Settings"),initialOpen:!1,colorSettings:[{value:f.color,onChange:function(e){return b(e)},label:__("Background Color")},{value:v.color,onChange:function(e){return E(e)},label:__("Text Color")}]},wp.element.createElement(B,{textColor:v.color,backgroundColor:f.color,fallbackTextColor:"#FFFFFF",fallbackBackgroundColor:"#000000"}))))),wp.element.createElement(C,null,wp.element.createElement(x,{onChange:c,value:T})),wp.element.createElement("div",{className:D,style:J},wp.element.createElement("div",{className:W,style:K},wp.element.createElement(k,{orientation:"horizontal",allowedBlocks:A})))]}var i=n(0),a=n.n(i),c=n(1),u=(n.n(c),n(2)),d=function(){function e(e,t){var n=[],_n=!0,o=!1,r=void 0;try{for(var l,i=e[Symbol.iterator]();!(_n=(l=i.next()).done)&&(n.push(l.value),!t||n.length!==t);_n=!0);}catch(e){o=!0,r=e}finally{try{!_n&&i.return&&i.return()}finally{if(o)throw r}}return n}return function(t,n){if(Array.isArray(t))return t;if(Symbol.iterator in Object(t))return e(t,n);throw new TypeError("Invalid attempt to destructure non-iterable instance")}}(),__=wp.i18n.__,m=wp.blocks.createBlock,s=wp.components,p=s.PanelBody,g=s.RangeControl,w=(s.SVG,s.Path,s.SelectControl),f=wp.element,b=(f.useState,f.useEffect,wp.compose.compose),v=wp.blockEditor,h=v.InspectorControls,k=v.InnerBlocks,C=v.BlockControls,x=v.BlockVerticalAlignmentToolbar,B=v.ContrastChecker,y=v.PanelColorSettings,E=v.withColors,T=v.__experimentalBlockVariationPicker,P=wp.data,V=P.withDispatch,O=P.useDispatch,M=P.useSelect,A=["madeit/block-content-column"],j=V(function(e,t,n){return{updateAlignment:function(o){var r=t.clientId,l=t.setAttributes,i=e("core/block-editor"),a=i.updateBlockAttributes,c=n.select("core/block-editor"),u=c.getBlockOrder;l({verticalAlignment:o}),u(r).forEach(function(e){a(e,{verticalAlignment:o})})},updateColumns:function(r,l){var i=t.clientId,a=e("core/block-editor"),d=a.replaceInnerBlocks,s=n.select("core/block-editor"),p=s.getBlocks,g=p(i),w=l>r;if(w){var f=Object(u.f)(12/l),b=Object(u.d)(g,12-f);g=[].concat(o(Object(u.c)(g,b)),o(Object(c.times)(l-r,function(){return m("madeit/block-content-column",{width:f})})))}else if(w)g=[].concat(o(g),o(Object(c.times)(l-r,function(){return m("madeit/block-content-column")})));else{g=Object(c.dropRight)(g,r-l);var v=Object(u.d)(g,12);g=Object(u.c)(g,v)}d(i,g,!1)}}})(l),R=function e(t){return Object(c.map)(t,function(t){var n=d(t,3),o=n[0],r=n[1],l=n[2];return m(o,r,e(void 0===l?[]:l))})},H=function(e){var t=e.clientId,n=e.name,o=M(function(e){var o=e("core/blocks"),r=o.getBlockVariations,l=o.getBlockType,i=o.getDefaultBlockVariation;return{blockType:l(n),defaultVariation:i(n,"block"),hasInnerBlocks:e("core/block-editor").getBlocks(t).length>0,variations:r(n,"block")}},[t,n]),r=o.blockType,l=o.defaultVariation,i=o.hasInnerBlocks,a=o.variations,u=O("core/block-editor"),d=u.replaceInnerBlocks;return i?wp.element.createElement(j,e):wp.element.createElement("div",null,wp.element.createElement(T,{icon:Object(c.get)(r,["icon","src"]),label:Object(c.get)(r,["title"]),variations:a,onSelect:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:l;t.attributes&&e.setAttributes(t.attributes),t.innerBlocks&&d(e.clientId,R(t.innerBlocks))},allowSkip:!0}))};t.a=b([E("containerBackgroundColor","rowTextColor","rowBackgroundColor")])(H)},function(e,t,n){(function(t){function n(e,n){function o(){var t,o,a=r,c=arguments.length;e:for(;a;){if(a.args.length===arguments.length){for(o=0;o<c;o++)if(a.args[o]!==arguments[o]){a=a.next;continue e}return a!==r&&(a===l&&(l=a.prev),a.prev.next=a.next,a.next&&(a.next.prev=a.prev),a.next=r,a.prev=null,r.prev=a,r=a),a.val}a=a.next}for(t=new Array(c),o=0;o<c;o++)t[o]=arguments[o];return a={args:t,val:e.apply(null,t)},r?(r.prev=a,a.next=r):l=a,i===n.maxSize?(l=l.prev,l.next=null):i++,r=a,a.val}var r,l,i=0;return n=n||{},o.clear=function(){r=null,l=null,i=0},"test"===t.env.NODE_ENV&&(o.getCache=function(){return[r,l,i]}),o}e.exports=n}).call(t,n(9))},function(e,t){function n(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function r(e){if(d===setTimeout)return setTimeout(e,0);if((d===n||!d)&&setTimeout)return d=setTimeout,setTimeout(e,0);try{return d(e,0)}catch(t){try{return d.call(null,e,0)}catch(t){return d.call(this,e,0)}}}function l(e){if(m===clearTimeout)return clearTimeout(e);if((m===o||!m)&&clearTimeout)return m=clearTimeout,clearTimeout(e);try{return m(e)}catch(t){try{return m.call(null,e)}catch(t){return m.call(this,e)}}}function i(){w&&p&&(w=!1,p.length?g=p.concat(g):f=-1,g.length&&a())}function a(){if(!w){var e=r(i);w=!0;for(var t=g.length;t;){for(p=g,g=[];++f<t;)p&&p[f].run();f=-1,t=g.length}p=null,w=!1,l(e)}}function c(e,t){this.fun=e,this.array=t}function u(){}var d,m,s=e.exports={};!function(){try{d="function"===typeof setTimeout?setTimeout:n}catch(e){d=n}try{m="function"===typeof clearTimeout?clearTimeout:o}catch(e){m=o}}();var p,g=[],w=!1,f=-1;s.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];g.push(new c(e,t)),1!==g.length||w||r(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},s.title="browser",s.browser=!0,s.env={},s.argv=[],s.version="",s.versions={},s.on=u,s.addListener=u,s.once=u,s.off=u,s.removeListener=u,s.removeAllListeners=u,s.emit=u,s.prependListener=u,s.prependOnceListener=u,s.listeners=function(e){return[]},s.binding=function(e){throw new Error("process.binding is not supported")},s.cwd=function(){return"/"},s.chdir=function(e){throw new Error("process.chdir is not supported")},s.umask=function(){return 0}},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){var t,n,r,l=e.attributes,a=l.verticalAlignment,d=l.containerBackgroundColor,m=l.customContainerBackgroundColor,s=l.size,p=l.containerMarginTop,g=l.containerMarginBottom,w=l.containerPaddingTop,f=l.containerPaddingBottom,b=l.containerPaddingLeft,v=l.containerPaddingRight,h=l.rowMarginTop,k=l.rowMarginBottom,C=l.rowPaddingTop,x=l.rowPaddingBottom,B=l.rowPaddingLeft,y=l.rowPaddingRight,E=l.rowBackgroundColor,T=l.rowTextColor,P=(l.customRowBackgroundColor,l.customRowTextColor,e.className),V=d?u("background-color",d):void 0,O=E?u("background-color",E):void 0,M=T?u("color",T):void 0,A=P,j="";A=i()(A,(t={},o(t,"container","container"===s),o(t,"container-fluid","container-fluid"===s||"container-content-boxed"===s),t)),"container-content-boxed"!==s&&(A=i()(A,o({},"are-vertically-aligned-"+a,a&&"container-content-boxed"!==s))),j=i()(j,(n={},o(n,"are-vertically-aligned-"+a,a&&"container-content-boxed"===s),o(n,"container","container"===s||"container-content-boxed"===s),o(n,"container-fluid","container-fluid"===s),n)),A=i()(A,(r={"has-text-color":M,"has-background":V},o(r,V,V),o(r,M,M),r));var R={backgroundColor:V?void 0:m};p>0&&(R.marginTop=p+"px"),g>0&&(R.marginBottom=g+"px"),w>0&&(R.paddingTop=w+"px"),f>0&&(R.paddingBottom=f+"px"),b>0&&(R.paddingLeft=b+"px"),v>0&&(R.paddingRight=v+"px");var H={};if("container-content-boxed"===s){var I;j=i()(j,(I={"has-text-color":void 0!==T,"has-background":void 0!==E},o(I,O,void 0!==E),o(I,M,void 0!==T),I)),H={backgroundColor:O?void 0:E,color:M?void 0:M},h>0&&(H.marginTop=h+"px"),k>0&&(H.marginBottom=k+"px"),C>0&&(H.paddingTop=C+"px"),x>0&&(H.paddingBottom=x+"px"),B>0&&(H.paddingLeft=B+"px"),y>0&&(H.paddingRight=y+"px")}else R.color=M?void 0:M;return"container-content-boxed"===s?wp.element.createElement("div",{className:A,style:R},wp.element.createElement("div",{className:"row"},wp.element.createElement("div",{className:"col"},wp.element.createElement("div",{className:j,style:H},wp.element.createElement("div",{className:"row"},wp.element.createElement(c.Content,null)))))):wp.element.createElement("div",{className:A,style:R},wp.element.createElement("div",{class:"row"},wp.element.createElement(c.Content,null)))}t.a=r;var l=n(0),i=n.n(l),a=wp.blockEditor,c=a.InnerBlocks,u=a.getColorClassName},function(e,t,n){"use strict";var o=wp.components,r=o.G,l=o.Path,i=o.SVG;t.a=wp.element.createElement(i,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(l,{fill:"none",d:"M0 0h24v24H0V0z"}),wp.element.createElement(r,null,wp.element.createElement(l,{d:"M4,4H20a2,2,0,0,1,2,2V18a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4ZM4 6V18H8V6Zm6 0V18h4V6Zm6 0V18h4V6Z"})))},function(e,t,n){"use strict";var o=n(13),__=(n.n(o),wp.i18n.__),r=[{name:"one-column-equal",title:__("100"),description:__("One column"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H9V34H39ZM23"})),isDefault:!0,innerBlocks:[["madeit/block-content-column",{width:12}]],scope:["block"]},{name:"two-columns-equal",title:__("50 / 50"),description:__("Two columns; equal split"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z"})),innerBlocks:[["madeit/block-content-column",{width:6}],["madeit/block-content-column",{width:6}]],scope:["block"]},{name:"two-columns-one-third-two-thirds",title:__("30 / 70"),description:__("Two columns; one-third, two-thirds split"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H20V34H39ZM18 34H9V14H18V34Z"})),innerBlocks:[["madeit/block-content-column",{width:4}],["madeit/block-content-column",{width:8}]],scope:["block"]},{name:"two-columns-two-thirds-one-third",title:__("70 / 30"),description:__("Two columns; two-thirds, one-third split"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",clipRule:"evenodd",d:"M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H30V34H39ZM28 34H9V14H28V34Z"})),innerBlocks:[["madeit/block-content-column",{width:8}],["madeit/block-content-column",{width:4}]],scope:["block"]},{name:"three-columns-equal",title:__("33 / 33 / 33"),description:__("Three columns; equal split"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",d:"M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM28.5 34h-9V14h9v20zm2 0V14H39v20h-8.5zm-13 0H9V14h8.5v20z"})),innerBlocks:[["madeit/block-content-column"],["madeit/block-content-column"],["madeit/block-content-column"]],scope:["block"]},{name:"three-columns-wider-center",title:__("25 / 50 / 25"),description:__("Three columns; wide center column"),icon:wp.element.createElement(o.SVG,{width:"48",height:"48",viewBox:"0 0 48 48",xmlns:"http://www.w3.org/2000/svg"},wp.element.createElement(o.Path,{fillRule:"evenodd",d:"M41 14a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h30a2 2 0 0 0 2-2V14zM31 34H17V14h14v20zm2 0V14h6v20h-6zm-18 0H9V14h6v20z"})),innerBlocks:[["madeit/block-content-column",{width:3}],["madeit/block-content-column",{width:6}],["madeit/block-content-column",{width:3}]],scope:["block"]}];t.a=r},function(e,t){e.exports=wp.components},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var r=n(15),l=n(16),i=n(17),a=n(0),c=n.n(a),__=wp.i18n.__,u=wp.blocks.registerBlockType,d=wp.blockEditor.InnerBlocks;u("madeit/block-content-column",{title:__("Content Column by Made I.T."),icon:i.a,category:"common",keywords:[__("content \u2014 Made I.T."),__("columns"),__("Made I.T.")],supports:{inserter:!1,reusable:!1,html:!1},getEditWrapperProps:function(e){var t=e.width;if(Number.isFinite(t))return{style:{flexBasis:t*(100/12)+"%"}}},attributes:{verticalAlignment:{type:"string"},width:{type:"number",min:0,max:12},backgroundColor:{type:"string"},customBackgroundColor:{type:"string"},textColor:{type:"string"},customTextColor:{type:"string"}},edit:r.a,save:l.a,deprecated:[{save:function(e){var t,n=e.attributes,r=n.verticalAlignment,l=n.width,i=c()("col",(t={},o(t,"is-vertically-aligned-"+r,r),o(t,"col-md-"+l,l),t));return wp.element.createElement("div",{className:i,style:void 0},wp.element.createElement(d.Content,null))}}]})},function(e,t,n){"use strict";function o(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e){var t=e.attributes,n=e.updateAlignment,o=e.updateWidth,l=e.hasChildBlocks,i=e.backgroundColor,c=e.setBackgroundColor,u=e.textColor,d=e.setTextColor,b=e.className,v=t.verticalAlignment,C=t.width,x=a()(b,a()("block-core-columns",r({},"is-vertically-aligned-"+v,v))),B={backgroundColor:i.color,color:u.color};return wp.element.createElement("div",{className:x,style:B},wp.element.createElement(s,null,wp.element.createElement(p,{onChange:n,value:v})),wp.element.createElement(g,null,wp.element.createElement(h,{title:__("Column Settings")},wp.element.createElement(k,{label:__("Percentage width"),value:C||"",onChange:o,min:1,max:12,required:!0,allowReset:!0})),wp.element.createElement(f,{title:__("Column Color Settings"),initialOpen:!1,colorSettings:[{value:i.color,onChange:function(e){return c(e)},label:__("Background Color")},{value:u.color,onChange:function(e){return d(e)},label:__("Text Color")}]},wp.element.createElement(w,{textColor:u.color,backgroundColor:i.color,fallbackTextColor:"#FFFFFF",fallbackBackgroundColor:"#000000"}))),wp.element.createElement(m,{templateLock:!1,renderAppender:l?void 0:function(){return wp.element.createElement(m.ButtonBlockAppender,null)}}))}var i=n(0),a=n.n(i),c=n(1),u=(n.n(c),n(2)),d=wp.blockEditor,m=d.InnerBlocks,s=d.BlockControls,p=d.BlockVerticalAlignmentToolbar,g=d.InspectorControls,w=d.ContrastChecker,f=d.PanelColorSettings,b=d.withColors,v=wp.components,h=v.PanelBody,k=v.RangeControl,C=wp.data,x=C.withDispatch,B=C.withSelect,y=wp.compose.compose,__=wp.i18n.__;t.a=y(b("backgroundColor","textColor"),B(function(e,t){var n=t.clientId;return{hasChildBlocks:(0,e("core/block-editor").getBlockOrder)(n).length>0}}),x(function(e,t,n){return{updateAlignment:function(o){var r=t.clientId,l=t.setAttributes,i=e("core/block-editor"),a=i.updateBlockAttributes,c=n.select("core/block-editor"),u=c.getBlockRootClientId;l({verticalAlignment:o}),a(u(r),{verticalAlignment:null})},updateWidth:function(l){var i=t.clientId,a=e("core/block-editor"),d=a.updateBlockAttributes,m=n.select("core/block-editor"),s=m.getBlockRootClientId,p=m.getBlocks,g=p(s(i)),w=Object(u.a)(g,i),f=l+Object(u.e)(Object(c.difference)(g,[Object(c.find)(g,{clientId:i})].concat(o(w)))),b=Object.assign({},Object(u.b)(g,g.length),r({},i,Object(u.f)(l)),Object(u.d)(w,12-f,g.length));Object(c.forEach)(b,function(e,t){d(t,{width:e})})}}}))(l)},function(e,t,n){"use strict";function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e){var t,n,r=e.attributes,l=r.verticalAlignment,a=r.width,d=r.customBackgroundColor,m=r.backgroundColor,s=r.customTextColor,p=r.textColor,g=e.className,w=m?u("background-color",m):void 0,f=p?u("color",p):void 0,b=i()(g,(t={},o(t,"is-vertically-aligned-"+l,l),o(t,"col-12",!0),o(t,"col-lg-"+a,a),t));b=i()(b,(n={"has-text-color":f,"has-background":w},o(n,w,w),o(n,f,f),n));var v={backgroundColor:w?void 0:d,color:f?void 0:s};return wp.element.createElement("div",{className:b,style:v},wp.element.createElement(c.Content,null))}t.a=r;var l=n(0),i=n.n(l),a=wp.blockEditor,c=a.InnerBlocks,u=a.getColorClassName},function(e,t,n){"use strict";var o=wp.components,r=o.Path,l=o.SVG;t.a=wp.element.createElement(l,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},wp.element.createElement(r,{fill:"none",d:"M0 0h24v24H0V0z"}),wp.element.createElement(r,{d:"M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.63-1.27zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16zm0-11.47L17.74 9 12 13.47 6.26 9 12 4.53z"}))}]);