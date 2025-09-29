var e=Object.defineProperty,__name=(t,n)=>e(t,"name",{value:n,configurable:!0}),__publicField=(t,n,i)=>((t,n,i)=>n in t?e(t,n,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[n]=i)(t,"symbol"!=typeof n?n+"":n,i);import{r as t,bD as n,bE as i,R as r,bF as o,a2 as l,j as s}from"./index-BJD_Eh7D.js";import{_ as a,a as u,s as p,u as c,g as d,i as h,t as m,b as f}from"./Portal-DJYEuDbz.js";import{_ as g,h as b,k as v,j as y}from"./Grow-C1PU_sf4.js";function getChildMapping(e,n){var i=__name((function mapper2(e){return n&&t.isValidElement(e)?n(e):e}),"mapper"),r=Object.create(null);return e&&t.Children.map(e,(function(e){return e})).forEach((function(e){r[e.key]=i(e)})),r}function mergeChildMappings(e,t){function getValueForKey(n){return n in t?t[n]:e[n]}e=e||{},t=t||{},__name(getValueForKey,"getValueForKey");var n,i=Object.create(null),r=[];for(var o in e)o in t?r.length&&(i[o]=r,r=[]):r.push(o);var l={};for(var s in t){if(i[s])for(n=0;n<i[s].length;n++){var a=i[s][n];l[i[s][n]]=getValueForKey(a)}l[s]=getValueForKey(s)}for(n=0;n<r.length;n++)l[r[n]]=getValueForKey(r[n]);return l}function getProp(e,t,n){return null!=n[t]?n[t]:e.props[t]}function getInitialChildMapping(e,n){return getChildMapping(e.children,(function(i){return t.cloneElement(i,{onExited:n.bind(null,i),in:!0,appear:getProp(i,"appear",e),enter:getProp(i,"enter",e),exit:getProp(i,"exit",e)})}))}function getNextChildMapping(e,n,i){var r=getChildMapping(e.children),o=mergeChildMappings(n,r);return Object.keys(o).forEach((function(l){var s=o[l];if(t.isValidElement(s)){var a=l in n,u=l in r,p=n[l],c=t.isValidElement(p)&&!p.props.in;!u||a&&!c?u||!a||c?u&&a&&t.isValidElement(p)&&(o[l]=t.cloneElement(s,{onExited:i.bind(null,s),in:p.props.in,exit:getProp(s,"exit",e),enter:getProp(s,"enter",e)})):o[l]=t.cloneElement(s,{in:!1}):o[l]=t.cloneElement(s,{onExited:i.bind(null,s),in:!0,exit:getProp(s,"exit",e),enter:getProp(s,"enter",e)})}})),o}__name(getChildMapping,"getChildMapping"),__name(mergeChildMappings,"mergeChildMappings"),__name(getProp,"getProp"),__name(getInitialChildMapping,"getInitialChildMapping"),__name(getNextChildMapping,"getNextChildMapping");var M=Object.values||function(e){return Object.keys(e).map((function(t){return e[t]}))},R={component:"div",childFactory:__name((function childFactory(e){return e}),"childFactory")},x=function(e){function TransitionGroup2(t,n){var i,r=(i=e.call(this,t,n)||this).handleExited.bind(g(i));return i.state={contextValue:{isMounting:!0},handleExited:r,firstRender:!0},i}n(TransitionGroup2,e),__name(TransitionGroup2,"TransitionGroup2");var t=TransitionGroup2.prototype;return t.componentDidMount=__name((function componentDidMount(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})}),"componentDidMount"),t.componentWillUnmount=__name((function componentWillUnmount(){this.mounted=!1}),"componentWillUnmount"),TransitionGroup2.getDerivedStateFromProps=__name((function getDerivedStateFromProps(e,t){var n=t.children,i=t.handleExited;return{children:t.firstRender?getInitialChildMapping(e,i):getNextChildMapping(e,n,i),firstRender:!1}}),"getDerivedStateFromProps"),t.handleExited=__name((function handleExited(e,t){var n=getChildMapping(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState((function(t){var n=a({},t.children);return delete n[e.key],{children:n}})))}),"handleExited"),t.render=__name((function render(){var e=this.props,t=e.component,n=e.childFactory,l=i(e,["component","childFactory"]),s=this.state.contextValue,a=M(this.state.children).map(n);return delete l.appear,delete l.enter,delete l.exit,null===t?r.createElement(o.Provider,{value:s},a):r.createElement(o.Provider,{value:s},r.createElement(t,l,a))}),"render"),TransitionGroup2}(r.Component);function isFocusVisible(e){try{return e.matches(":focus-visible")}catch(t){}return!1}x.propTypes={},x.defaultProps=R,__name(isFocusVisible,"isFocusVisible");const C=class _LazyRipple{constructor(){__publicField(this,"mountEffect",__name((()=>{this.shouldMount&&!this.didMount&&null!==this.ref.current&&(this.didMount=!0,this.mounted.resolve())}),"mountEffect")),this.ref={current:null},this.mounted=null,this.didMount=!1,this.shouldMount=!1,this.setShouldMount=null}static create(){return new _LazyRipple}static use(){const e=b(_LazyRipple.create).current,[n,i]=t.useState(!1);return e.shouldMount=n,e.setShouldMount=i,t.useEffect(e.mountEffect,[n]),e}mount(){return this.mounted||(this.mounted=createControlledPromise(),this.shouldMount=!0,this.setShouldMount(this.shouldMount)),this.mounted}start(...e){this.mount().then((()=>{var t;return null==(t=this.ref.current)?void 0:t.start(...e)}))}stop(...e){this.mount().then((()=>{var t;return null==(t=this.ref.current)?void 0:t.stop(...e)}))}pulsate(...e){this.mount().then((()=>{var t;return null==(t=this.ref.current)?void 0:t.pulsate(...e)}))}};__name(C,"LazyRipple");let E=C;function useLazyRipple(){return E.use()}function createControlledPromise(){let e,t;const n=new Promise(((n,i)=>{e=n,t=i}));return n.resolve=e,n.reject=t,n}function Ripple(e){const{className:n,classes:i,pulsate:r=!1,rippleX:o,rippleY:a,rippleSize:u,in:p,onExited:c,timeout:d}=e,[h,m]=t.useState(!1),f=l(n,i.ripple,i.rippleVisible,r&&i.ripplePulsate),g={width:u,height:u,top:-u/2+a,left:-u/2+o},b=l(i.child,h&&i.childLeaving,r&&i.childPulsate);return p||h||m(!0),t.useEffect((()=>{if(!p&&null!=c){const e=setTimeout(c,d);return()=>{clearTimeout(e)}}}),[c,p,d]),s.jsx("span",{className:f,style:g,children:s.jsx("span",{className:b})})}__name(useLazyRipple,"useLazyRipple"),__name(createControlledPromise,"createControlledPromise"),__name(Ripple,"Ripple");const P=u("MuiTouchRipple",["root","ripple","rippleVisible","ripplePulsate","child","childLeaving","childPulsate"]),V=v`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`,T=v`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`,B=v`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`,k=p("span",{name:"MuiTouchRipple",slot:"Root"})({overflow:"hidden",pointerEvents:"none",position:"absolute",zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:"inherit"}),F=p(Ripple,{name:"MuiTouchRipple",slot:"Ripple"})`
  opacity: 0;
  position: absolute;

  &.${P.rippleVisible} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${V};
    animation-duration: ${550}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  &.${P.ripplePulsate} {
    animation-duration: ${({theme:e})=>e.transitions.duration.shorter}ms;
  }

  & .${P.child} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${P.childLeaving} {
    opacity: 0;
    animation-name: ${T};
    animation-duration: ${550}ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
  }

  & .${P.childPulsate} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${B};
    animation-duration: 2500ms;
    animation-timing-function: ${({theme:e})=>e.transitions.easing.easeInOut};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,S=t.forwardRef(__name((function TouchRipple2(e,n){const i=c({props:e,name:"MuiTouchRipple"}),{center:r=!1,classes:o={},className:a,...u}=i,[p,d]=t.useState([]),h=t.useRef(0),m=t.useRef(null);t.useEffect((()=>{m.current&&(m.current(),m.current=null)}),[p]);const f=t.useRef(!1),g=y(),b=t.useRef(null),v=t.useRef(null),M=t.useCallback((e=>{const{pulsate:t,rippleX:n,rippleY:i,rippleSize:r,cb:a}=e;d((e=>[...e,s.jsx(F,{classes:{ripple:l(o.ripple,P.ripple),rippleVisible:l(o.rippleVisible,P.rippleVisible),ripplePulsate:l(o.ripplePulsate,P.ripplePulsate),child:l(o.child,P.child),childLeaving:l(o.childLeaving,P.childLeaving),childPulsate:l(o.childPulsate,P.childPulsate)},timeout:550,pulsate:t,rippleX:n,rippleY:i,rippleSize:r},h.current)])),h.current+=1,m.current=a}),[o]),R=t.useCallback(((e={},t={},n=()=>{})=>{const{pulsate:i=!1,center:o=r||t.pulsate,fakeElement:l=!1}=t;if("mousedown"===(null==e?void 0:e.type)&&f.current)return void(f.current=!1);"touchstart"===(null==e?void 0:e.type)&&(f.current=!0);const s=l?null:v.current,a=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0};let u,p,c;if(o||void 0===e||0===e.clientX&&0===e.clientY||!e.clientX&&!e.touches)u=Math.round(a.width/2),p=Math.round(a.height/2);else{const{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;u=Math.round(t-a.left),p=Math.round(n-a.top)}if(o)c=Math.sqrt((2*a.width**2+a.height**2)/3),c%2==0&&(c+=1);else{const e=2*Math.max(Math.abs((s?s.clientWidth:0)-u),u)+2,t=2*Math.max(Math.abs((s?s.clientHeight:0)-p),p)+2;c=Math.sqrt(e**2+t**2)}(null==e?void 0:e.touches)?null===b.current&&(b.current=()=>{M({pulsate:i,rippleX:u,rippleY:p,rippleSize:c,cb:n})},g.start(80,(()=>{b.current&&(b.current(),b.current=null)}))):M({pulsate:i,rippleX:u,rippleY:p,rippleSize:c,cb:n})}),[r,M,g]),C=t.useCallback((()=>{R({},{pulsate:!0})}),[R]),E=t.useCallback(((e,t)=>{if(g.clear(),"touchend"===(null==e?void 0:e.type)&&b.current)return b.current(),b.current=null,void g.start(0,(()=>{E(e,t)}));b.current=null,d((e=>e.length>0?e.slice(1):e)),m.current=t}),[g]);return t.useImperativeHandle(n,(()=>({pulsate:C,start:R,stop:E})),[C,R,E]),s.jsx(k,{className:l(P.root,o.root,a),ref:v,...u,children:s.jsx(x,{component:null,exit:!0,children:p})})}),"TouchRipple2"));function getButtonBaseUtilityClass(e){return d("MuiButtonBase",e)}__name(getButtonBaseUtilityClass,"getButtonBaseUtilityClass");const j=u("MuiButtonBase",["root","disabled","focusVisible"]),L=__name((e=>{const{disabled:t,focusVisible:n,focusVisibleClassName:i,classes:r}=e,o=f({root:["root",t&&"disabled",n&&"focusVisible"]},getButtonBaseUtilityClass,r);return n&&i&&(o.root+=` ${i}`),o}),"useUtilityClasses"),w=p("button",{name:"MuiButtonBase",slot:"Root",overridesResolver:__name(((e,t)=>t.root),"overridesResolver")})({display:"inline-flex",alignItems:"center",justifyContent:"center",position:"relative",boxSizing:"border-box",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none",textDecoration:"none",color:"inherit","&::-moz-focus-inner":{borderStyle:"none"},[`&.${j.disabled}`]:{pointerEvents:"none",cursor:"default"},"@media print":{colorAdjust:"exact"}}),z=t.forwardRef(__name((function ButtonBase2(e,n){const i=c({props:e,name:"MuiButtonBase"}),{action:r,centerRipple:o=!1,children:a,className:u,component:p="button",disabled:d=!1,disableRipple:f=!1,disableTouchRipple:g=!1,focusRipple:b=!1,focusVisibleClassName:v,LinkComponent:y="a",onBlur:M,onClick:R,onContextMenu:x,onDragLeave:C,onFocus:E,onFocusVisible:P,onKeyDown:V,onKeyUp:T,onMouseDown:B,onMouseLeave:k,onMouseUp:F,onTouchEnd:j,onTouchMove:z,onTouchStart:D,tabIndex:H=0,TouchRippleProps:N,touchRippleRef:$,type:I,...U}=i,K=t.useRef(null),O=useLazyRipple(),G=h(O.ref,$),[X,Y]=t.useState(!1);d&&X&&Y(!1),t.useImperativeHandle(r,(()=>({focusVisible:__name((()=>{Y(!0),K.current.focus()}),"focusVisible")})),[]);const W=O.shouldMount&&!f&&!d;function useRippleHandler(e,t,n=g){return m((i=>{t&&t(i);return n||O[e](i),!0}))}t.useEffect((()=>{X&&b&&!f&&O.pulsate()}),[f,b,X,O]),__name(useRippleHandler,"useRippleHandler");const A=useRippleHandler("start",B),_=useRippleHandler("stop",x),q=useRippleHandler("stop",C),J=useRippleHandler("stop",F),Q=useRippleHandler("stop",(e=>{X&&e.preventDefault(),k&&k(e)})),Z=useRippleHandler("start",D),ee=useRippleHandler("stop",j),te=useRippleHandler("stop",z),ne=useRippleHandler("stop",(e=>{isFocusVisible(e.target)||Y(!1),M&&M(e)}),!1),ie=m((e=>{K.current||(K.current=e.currentTarget),isFocusVisible(e.target)&&(Y(!0),P&&P(e)),E&&E(e)})),re=__name((()=>{const e=K.current;return p&&"button"!==p&&!("A"===e.tagName&&e.href)}),"isNonNativeButton"),oe=m((e=>{b&&!e.repeat&&X&&" "===e.key&&O.stop(e,(()=>{O.start(e)})),e.target===e.currentTarget&&re()&&" "===e.key&&e.preventDefault(),V&&V(e),e.target===e.currentTarget&&re()&&"Enter"===e.key&&!d&&(e.preventDefault(),R&&R(e))})),le=m((e=>{b&&" "===e.key&&X&&!e.defaultPrevented&&O.stop(e,(()=>{O.pulsate(e)})),T&&T(e),R&&e.target===e.currentTarget&&re()&&" "===e.key&&!e.defaultPrevented&&R(e)}));let se=p;"button"===se&&(U.href||U.to)&&(se=y);const ae={};"button"===se?(ae.type=void 0===I?"button":I,ae.disabled=d):(U.href||U.to||(ae.role="button"),d&&(ae["aria-disabled"]=d));const ue=h(n,K),pe={...i,centerRipple:o,component:p,disabled:d,disableRipple:f,disableTouchRipple:g,focusRipple:b,tabIndex:H,focusVisible:X},ce=L(pe);return s.jsxs(w,{as:se,className:l(ce.root,u),ownerState:pe,onBlur:ne,onClick:R,onContextMenu:_,onFocus:ie,onKeyDown:oe,onKeyUp:le,onMouseDown:A,onMouseLeave:Q,onMouseUp:J,onDragLeave:q,onTouchEnd:ee,onTouchMove:te,onTouchStart:Z,ref:ue,tabIndex:d?-1:H,type:I,...ae,...U,children:[a,W?s.jsx(S,{ref:G,center:o,...N}):null]})}),"ButtonBase2"));export{z as B,isFocusVisible as i};
