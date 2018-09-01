!function(e){function t(a){if(l[a])return l[a].exports;var n=l[a]={i:a,l:!1,exports:{}};return e[a].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var l={};t.m=e,t.c=l,t.d=function(e,l,a){t.o(e,l)||Object.defineProperty(e,l,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var l=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(l,"a",l),l},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,l){"use strict";Object.defineProperty(t,"__esModule",{value:!0});l(1)},function(e,t,l){"use strict";var a=l(2),n=(l.n(a),l(3)),o=(l.n(n),wp.blocks.registerBlockType),r=wp.i18n.__,u=wp.components,m=(u.withState,u.PanelColor),c=u.RangeControl,i=(u.TextControl,u.SelectControl),p=wp.editor.InspectorControls?wp.editor:wp.blocks,d=p.InspectorControls,s=(p.BlockControls,p.ColorPalette),g=function(e){var t=e.isSelected,l=e.setAttributes,a=e.className,n=e.attributes,o=n.type,u=n.sm,p=n.md,g=n.lg,b=n.textColor,v=n.color,f=n.margin,w=n.padding,C=[{value:"manual",label:r("Manueel")},{value:"auto",label:r("Automatisch")},{value:"auto-sm",label:r("Small device wide, Medium and large automatic")},{value:"auto-md",label:r("Small and medium wide, large automatic")}],y=[{value:"12",label:r("Full width")},{value:"11",label:r("11/12de")},{value:"10",label:r("10/12de")},{value:"9",label:r("9/12de")},{value:"8",label:r("8/12de")},{value:"7",label:r("7/12de")},{value:"6",label:r("6/12de")},{value:"5",label:r("5/12de")},{value:"4",label:r("4/12de")},{value:"3",label:r("3/12de")},{value:"2",label:r("2/12de")},{value:"1",label:r("1/12de")}],x="";return"auto"===o?x="col":"auto-sm"===o?x="col-12 col-md":"auto-md"===o&&(x="col-12 col-lg"),void 0!==a&&(x+=" "+a),"manual"===o&&(x+=" col-"+u+" col-md-"+p+" col-lg-"+g),[wp.element.createElement("div",null,wp.element.createElement("div",{className:x,style:{color:b,backgroundColor:v,paddingTop:w+"px",paddingBottom:w+"px",marginTop:f+"px",marginBottom:f+"px"}},wp.element.createElement(wp.editor.InnerBlocks,{templateLock:!1})),t&&wp.element.createElement(d,{key:"inspector"},wp.element.createElement(i,{label:r("Type"),value:o,options:C.map(function(e){return{value:e.value,label:e.label}}),onChange:function(e){l({type:e})}}),"manual"===o&&wp.element.createElement(i,{label:r("Small devices (Smartphones, tablets)"),value:u,options:y.map(function(e){return{value:e.value,label:e.label}}),onChange:function(e){l({sm:e})}}),"manual"===o&&wp.element.createElement(i,{label:r("Medium devices (tablets)"),value:p,options:y.map(function(e){return{value:e.value,label:e.label}}),onChange:function(e){l({md:e})}}),"manual"===o&&wp.element.createElement(i,{label:r("Large devices (Laptops, desktops)"),value:g,options:y.map(function(e){return{value:e.value,label:e.label}}),onChange:function(e){l({lg:e})}}),wp.element.createElement(c,{label:r("Margin"),value:f,min:"0",max:"100",onChange:function(e){return l({margin:e})}}),wp.element.createElement(c,{label:r("Padding"),value:w,min:"0",max:"100",onChange:function(e){return l({padding:e})}}),wp.element.createElement(m,{title:r("Text Color"),colorValue:b,initialOpen:!1},wp.element.createElement(s,{value:b,onChange:function(e){return l({textColor:e})}})),wp.element.createElement(m,{title:r("Background Color"),colorValue:v,initialOpen:!1},wp.element.createElement(s,{value:v,onChange:function(e){return l({color:e})}}))))]},b=function(e){var t=e.attributes,l=t.type,a=t.sm,n=t.md,o=t.lg,r=t.textColor,u=t.color,m=t.margin,c=t.padding,i=e.className,p="";return"auto"===l?p="col":"auto-sm"===l?p="col-12 col-md":"auto-md"===l&&(p="col-12 col-lg"),void 0!==i&&(p+=" "+i),"manual"===l&&(p+=" col-"+a+" col-md-"+n+" col-lg-"+o),wp.element.createElement("div",{className:p,style:{color:r,backgroundColor:u,paddingTop:c+"px",paddingBottom:c+"px",marginTop:m+"px",marginBottom:m+"px"}},wp.element.createElement(wp.editor.InnerBlocks.Content,null))};o("madeit/block-column-simple",{title:r("Column - Simple"),icon:"align-center",category:"common",parent:["madeit/block-row-simple"],keywords:[r("column"),r("Made IT"),r("Made I.T.")],attributes:{type:{type:"string",default:"auto-sm"},textColor:{type:"string"},color:{type:"string"},margin:{type:"number",default:0},padding:{type:"number",default:0},sm:{type:"number",default:12},md:{type:"number",default:6},lg:{type:"number",default:6}},getEditWrapperProps:function(e){var t=e.sm,l=e.md,a=e.lg;return"auto"===e.type?(t="auto",l="auto",a="auto"):"auto-sm"===e.type?(t="12",l="auto",a="auto"):"auto-md"===e.type&&(t="12",l="12",a="auto"),{"data-column-xs":t,"data-column-md":l,"data-column-lg":a}},deprecated:[{save:function(e){var t=e.attributes,l=t.type,a=(t.sm,t.md,t.lg,t.textColor),n=t.color,o=t.margin,r=t.padding,u=e.className,m="";return"auto"===l?m="col":"auto-sm"===l?m="col-12 col-md":"auto-md"===l&&(m="col-12 col-lg"),void 0!==u&&(m+=" "+u),wp.element.createElement("div",{className:m,style:{color:a,backgroundColor:n,paddingTop:r+"px",paddingBottom:r+"px",marginTop:o+"px",marginBottom:o+"px"}},wp.element.createElement(wp.editor.InnerBlocks.Content,null))}}],edit:g,save:b})},function(e,t){},function(e,t){}]);