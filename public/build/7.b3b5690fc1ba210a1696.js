(this.webpackJsonp=this.webpackJsonp||[]).push([[7],{1402:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=o(n(28)),r=o(n(0));function o(e){return e&&e.__esModule?e:{default:e}}var l=function(e){var t=e.status,n=e.ads;return t?n():r.default.createElement("div",null)};l.propTypes={ads:a.default.func.isRequired,status:a.default.bool.isRequired},l.displayName=l,t.default=l,e.exports=t.default},1403:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=d(n(1)),r=d(n(15)),o=d(n(4)),l=d(n(3)),i=d(n(7)),s=d(n(5)),u=d(n(0)),c=d(n(28));function d(e){return e&&e.__esModule?e:{default:e}}var f=function(e){function t(){(0,o.default)(this,t);var e=(0,l.default)(this,(t.__proto__||(0,r.default)(t)).call(this));return e.ad={},e}return(0,s.default)(t,e),(0,i.default)(t,null,[{key:"getAdFormat",value:function(e){var n={width:null,height:null,slot:null};return e===t.LARGE_RECTANGLE?(n.width="336px",n.height="280px",n.slot="7501584503"):e===t.BANNER?(n.width="468px",n.height="60px",n.slot="8101746509"):e===t.WIDE_SKY_SCRAPPER?(n.width="160px",n.height="600px",n.slot="3392345307"):e===t.LEADER_BOARD?(n.width="728px",n.height="90px",n.slot="3647372338"):e===t.LINK_AD&&(n.width="728px",n.height="15px",n.slot="8369974762"),n}}]),(0,i.default)(t,[{key:"componentDidMount",value:function(){(window.adsbygoogle=window.adsbygoogle||[]).push({})}},{key:"render",value:function(){var e=t.getAdFormat(this.props.type),n=e.height,r=e.width,o=e.slot;return u.default.createElement("ins",{className:"adsbygoogle",style:(0,a.default)({display:"inline-block",width:r,height:n},this.props.style),"data-ad-client":t.PUB_ID,"data-ad-slot":o})}}]),t}(u.default.Component);Object.defineProperty(f,"PUB_ID",{enumerable:!0,writable:!0,value:"ca-pub-4052836596196505"}),Object.defineProperty(f,"LARGE_RECTANGLE",{enumerable:!0,writable:!0,value:"large_rectangle"}),Object.defineProperty(f,"BANNER",{enumerable:!0,writable:!0,value:"banner"}),Object.defineProperty(f,"LEADER_BOARD",{enumerable:!0,writable:!0,value:"leader_board"}),Object.defineProperty(f,"WIDE_SKY_SCRAPPER",{enumerable:!0,writable:!0,value:"wide_sky_scrapper"}),Object.defineProperty(f,"LINK_AD",{enumerable:!0,writable:!0,value:"link_ad"}),Object.defineProperty(f,"propTypes",{enumerable:!0,writable:!0,value:{type:c.default.string.isRequired,style:c.default.object}}),Object.defineProperty(f,"defaultProps",{enumerable:!0,writable:!0,value:{style:{}}}),t.default=f,e.exports=t.default},1404:function(e,t,n){"use strict";var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=(n(737),n(1894)),o=n(1893),l=n(842),i=function(e){return r[e.smooth]||r.defaultEasing},s=function(){if("undefined"!=typeof window)return window.requestAnimationFrame||window.webkitRequestAnimationFrame}()||function(e,t,n){window.setTimeout(e,n||1e3/60,(new Date).getTime())},u=0,c=0,d=0,f=0,p=0,m=!1,h=void 0,v=void 0,y=void 0,b=void 0,g=void 0,E=void 0,w=void 0;o.subscribe(function(){m=!0});var k=function(){if(v&&v!==document&&v!==document.body)return v.scrollTop;var e=void 0!==window.pageXOffset,t="CSS1Compat"===(document.compatMode||"");return e?window.pageYOffset:t?document.documentElement.scrollTop:document.body.scrollTop},_=function(e){v=e?e.containerId?document.getElementById(e.containerId):e.container&&e.container.nodeType?e.container:document:null},S=function(e,t,n,a){if(window.clearTimeout(w),_(t),b=null,m=!1,c=k(),d=t.absolute?e:e+c,c!==d){g=Math.round(d-c),p=function(e){return"function"==typeof e?e:function(){return e}}(t.duration)(g),p=isNaN(parseFloat(p))?1e3:parseFloat(p),y=n,h=a;var r=i(t),o=function e(t,n,a){if(n.ignoreCancelEvents||!m)if(g=Math.round(d-c),null===b&&(b=a),E=(f=a-b)>=p?1:t(f/p),u=c+Math.ceil(g*E),v&&v!==document&&v!==document.body?v.scrollTop=u:window.scrollTo(0,u),E<1){var r=e.bind(null,t,n);s.call(window,r)}else l.registered.end&&l.registered.end(y,h,u);else l.registered.end&&l.registered.end(y,h,u)}.bind(null,r,t);t&&t.delay>0?w=window.setTimeout(function(){s.call(window,o)},t.delay):s.call(window,o)}else l.registered.end&&l.registered.end(y,h,u)},C=function(e){return(e=a({},e)).absolute=!0,e};e.exports={animateTopScroll:S,getAnimationType:i,scrollToTop:function(e){S(0,C(e))},scrollToBottom:function(e){e=C(e),_(e),S(function(){if(v&&v!==document&&v!==document.body)return Math.max(v.scrollHeight,v.offsetHeight,v.clientHeight);var e=document.body,t=document.documentElement;return Math.max(e.scrollHeight,e.offsetHeight,t.clientHeight,t.scrollHeight,t.offsetHeight)}(),e)},scrollTo:function(e,t){S(e,C(t))},scrollMore:function(e,t){t=C(t),_(t),S(k()+e,t)}}},1405:function(e,t,n){"use strict";var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=n(737),o=n(1404),l=n(842),i={},s=void 0;e.exports={unmount:function(){i={}},register:function(e,t){i[e]=t},unregister:function(e){delete i[e]},get:function(e){return i[e]||document.getElementById(e)||document.getElementsByName(e)[0]},setActiveLink:function(e){return s=e},getActiveLink:function(){return s},scrollTo:function(e,t){var n=this.get(e);if(n){var i=(t=a({},t,{absolute:!1})).containerId,s=t.container,u=void 0;u=i?document.getElementById(i):s&&s.nodeType?s:document,l.registered.begin&&l.registered.begin(e,n),t.absolute=!0;var c=r.scrollOffset(u,n)+(t.offset||0);if(!t.smooth)return u===document?window.scrollTo(0,c):u.scrollTop=c,void(l.registered.end&&l.registered.end(e,n));o.animateTopScroll(c,t,e,n)}else console.warn("target Element not found")}}},1406:function(e,t,n){"use strict";var a=n(843).addPassiveEventListener,r={spyCallbacks:[],spySetState:[],scrollSpyContainers:[],mount:function(e){if(e){var t=function(e){var t=void 0;return function(n){t||(t=setTimeout(function(){t=null,e(n)},66))}}(function(t){r.scrollHandler(e)});r.scrollSpyContainers.push(e),a(e,"scroll",t)}},isMounted:function(e){return-1!==r.scrollSpyContainers.indexOf(e)},currentPositionY:function(e){if(e===document){var t=void 0!==window.pageXOffset,n="CSS1Compat"===(document.compatMode||"");return t?window.pageYOffset:n?document.documentElement.scrollTop:document.body.scrollTop}return e.scrollTop},scrollHandler:function(e){(r.scrollSpyContainers[r.scrollSpyContainers.indexOf(e)].spyCallbacks||[]).forEach(function(t){return t(r.currentPositionY(e))})},addStateHandler:function(e){r.spySetState.push(e)},addSpyHandler:function(e,t){var n=r.scrollSpyContainers[r.scrollSpyContainers.indexOf(t)];n.spyCallbacks||(n.spyCallbacks=[]),n.spyCallbacks.push(e),e(r.currentPositionY(t))},updateStates:function(){r.spySetState.forEach(function(e){return e()})},unmount:function(e,t){r.scrollSpyContainers.forEach(function(e){return e.spyCallbacks&&e.spyCallbacks.length&&e.spyCallbacks.splice(e.spyCallbacks.indexOf(t),1)}),r.spySetState&&r.spySetState.length&&r.spySetState.splice(r.spySetState.indexOf(e),1),document.removeEventListener("scroll",r.scrollHandler)},update:function(){return r.scrollSpyContainers.forEach(function(e){return r.scrollHandler(e)})}};e.exports=r},1407:function(e,t,n){var a=n(231)("kebabCase",n(1898),n(332));a.placeholder=n(182),e.exports=a},1883:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(e){return e&&e.__esModule?e:{default:e}}(n(0)),r=n(67),o=n(53);t.default=function(e){var t=e.onAccept,n=void 0===t?function(){return null}:t;return a.default.createElement("div",{className:"sd-cookie-alert text-center"},a.default.createElement("p",null,"We use cookies to make interactions with our service easy and meaningful. Please check our  ",a.default.createElement(o.Link,{to:"https://web.savetodrive.net/privacy-policy",target:"_blank"},"privacy policy")," ","for more information."),a.default.createElement(r.Button,{inverted:!0,size:"mini",onClick:n},"I Accept"))},e.exports=t.default},1884:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=s(n(0)),r=s(n(28)),o=n(67),l=s(n(1403)),i=s(n(1402));function s(e){return e&&e.__esModule?e:{default:e}}var u=function(e){var t=e.isAds;return a.default.createElement(o.Grid.Column,{mobile:"16",computer:"5"},a.default.createElement(o.List,{celled:!0},a.default.createElement(o.List.Item,null,a.default.createElement(o.List.Content,null,a.default.createElement(i.default,{status:t,ads:function(){return a.default.createElement(l.default,{type:l.default.LARGE_RECTANGLE})}}))),a.default.createElement(o.List.Item,null,a.default.createElement(o.List.Content,null,a.default.createElement(o.Item.Group,null,a.default.createElement(o.Item,null,a.default.createElement(o.Item.Image,{size:"mini",src:"/images/facebook-logo.png"}),a.default.createElement(o.Item.Content,null,a.default.createElement(o.Item.Header,{href:"https://www.facebook.com/savetodrive",target:"_blank",as:"a"},"Facebook"))),a.default.createElement(o.Item,null,a.default.createElement(o.Item.Image,{size:"mini",src:"/images/twitter-logo.png"}),a.default.createElement(o.Item.Content,null,a.default.createElement(o.Item.Header,{href:"https://www.twitter.com/savetodrive",target:"_blank",as:"a"},"Twitter"))))))))};u.propTypes={isAds:r.default.bool.isRequired},t.default=u,e.exports=t.default},1885:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i(n(28)),r=i(n(0)),o=n(67),l=n(148);function i(e){return e&&e.__esModule?e:{default:e}}var s=function(e){var t=e.items,n=e.handleTaskKill;return r.default.createElement("div",null,r.default.createElement("div",{className:"upload-list"},t.map(function(e,t){return r.default.createElement("div",{className:"upload-list__item",key:e.uuid,id:e.uuid},r.default.createElement("button",{type:"button",className:"close","aria-label":"Close",onClick:n(e,t)},r.default.createElement("span",{"aria-hidden":"true"},"×")),r.default.createElement("div",{className:"upload-list__item__info",name:e.uuid},r.default.createElement("a",{className:"upload-list__filename",title:e.name},(0,l.limitString)(e.name)),!1===e.completed?r.default.createElement(o.Header,{color:"red",content:"Failed"}):r.default.createElement(o.Progress,{color:"blue",percent:e.progress.percentage,size:"tiny"},e.progress.percentage,"%"),r.default.createElement("div",{className:"upload-list__item__row"},r.default.createElement("span",{className:"upload-list__filetype mr-2"},e.type),r.default.createElement("span",{className:"mr-2"},r.default.createElement("span",{className:"text-muted"},"Service:"),r.default.createElement("strong",null,e.serviceLabel)),r.default.createElement("span",{className:"mr-2"},r.default.createElement("span",{className:"text-muted"},"Speed:"),r.default.createElement("strong",null,e.progress.speed)),r.default.createElement("span",{className:"mr-2"},r.default.createElement("span",{className:"text-muted"},"ETA:"),r.default.createElement("strong",null,e.progress.eta)))),r.default.createElement("div",{className:"upload-list__item__extra"},r.default.createElement("h4",{className:"upload-list__title"},r.default.createElement("span",{className:"text-muted"},"Size:"),r.default.createElement("span",null,e.size)),r.default.createElement("h4",{className:"upload-list__title"},r.default.createElement("span",{className:"text-muted"},"Transferred:"),r.default.createElement("span",null,e.progress.transferred)),r.default.createElement("h4",{className:"upload-list__title"},r.default.createElement("span",{className:"text-muted"},"Remaining:"),r.default.createElement("span",null,e.progress.remaining))))})))};s.propTypes={items:a.default.array.isRequired,handleTaskKill:a.default.func.isRequired},t.default=s,e.exports=t.default},1886:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=function(e){return e&&e.__esModule?e:{default:e}}(n(0)),r=n(67);t.default=function(){return a.default.createElement(r.Container,{fluid:!0,className:"mt-2"},a.default.createElement(r.Message,{size:"tiny"},a.default.createElement(r.Message.Header,{size:"small",as:"h4"},"Some key points:"),a.default.createElement(r.Message.List,{size:"tiny"},a.default.createElement(r.Message.Item,null,"If a url is too long and there is an error, please shorten the link. You can ",a.default.createElement("a",{href:"https://bit.ly"}," Click Here to Shorten.")),a.default.createElement(r.Message.Item,null,"If you don't see any response, then Authenticate once again."),a.default.createElement(r.Message.Item,null,"Though, we have access to your files, we do not have any right to touch any of your private files and do not either. The files are only uploaded to your drives."),a.default.createElement(r.Message.Item,null,"Once the uploading has started, you can close the tab and forget about it, the file will continue to upload but you will not see any upload status the next time you visit this page."))),a.default.createElement(r.Message,{size:"tiny"},a.default.createElement(r.Message.Header,{size:"tiny",as:"h2"},"Save web files to cloud with SaveToDrive."),a.default.createElement("p",null,"Save any files from the internet to your favourite cloud storage service without having to download it to your computer and re-upload it. You can download any large ,small and big size files from web and within few minutes it will be on your drive."),a.default.createElement("p",null,"Email notification is also available with progress report of upload progress."),a.default.createElement("p",null,"Just enter the files web address (or URL), pick a cloud service and, within seconds, the file will become available in your online account."),a.default.createElement("p",null,"The download is from cloud to cloud and therefore much faster. Savetodrive is also useful for mobile users as you can remotely download files, including file types that aren't supported by your mobile phone or tablets, to your mobile devices via your favourite cloud storage service."),a.default.createElement("p",null,"Feel free to message us on  ",a.default.createElement("a",{href:"https://facebook.com/savetodrive"},"Facebook")," or ",a.default.createElement("a",{href:"https://twitter.com/savetodrive"},"Twitter"),"  for feedback or bug.")))},e.exports=t.default},1887:function(e,t,n){"use strict";var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();var o=n(0),l=n(738),i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.Component),r(t,[{key:"render",value:function(){var e=this,t=a({},this.props);return t.parentBindings&&delete t.parentBindings,o.createElement("div",a({},t,{ref:function(t){e.props.parentBindings.domNode=t}}),this.props.children)}}]),t}();e.exports=l.Element(i)},1888:function(e,t,n){"use strict";var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();var r=n(0),o=n(738),l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),a(t,[{key:"render",value:function(){return r.createElement("input",this.props,this.props.children)}}]),t}();e.exports=o.Scroll(l)},1889:function(e,t,n){"use strict";n(843);var a=n(737),r={mountFlag:!1,initialized:!1,scroller:null,containers:{},mount:function(e){this.scroller=e,this.handleHashChange=this.handleHashChange.bind(this),window.addEventListener("hashchange",this.handleHashChange),this.initStateFromHash(),this.mountFlag=!0},mapContainer:function(e,t){this.containers[e]=t},isMounted:function(){return this.mountFlag},isInitialized:function(){return this.initialized},initStateFromHash:function(){var e=this,t=this.getHash();t?window.setTimeout(function(){e.scrollTo(t,!0),e.initialized=!0},10):this.initialized=!0},scrollTo:function(e,t){var n=this.scroller;if(n.get(e)&&(t||e!==n.getActiveLink())){var a=this.containers[e]||document;n.scrollTo(e,{container:a})}},getHash:function(){return a.getHash()},changeHash:function(e){this.isInitialized()&&a.pushHash(e)},handleHashChange:function(){this.scrollTo(this.getHash())},unmount:function(){this.scroller=null,this.containers=null,window.removeEventListener("hashchange",this.handleHashChange)}};e.exports=r},1890:function(e,t,n){"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},1891:function(e,t,n){"use strict";var a=n(1890);function r(){}e.exports=function(){function e(e,t,n,r,o,l){if(l!==a){var i=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw i.name="Invariant Violation",i}}function t(){return e}e.isRequired=e;var n={array:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t};return n.checkPropTypes=r,n.PropTypes=n,n}},1892:function(e,t,n){e.exports=n(1891)()},1893:function(e,t,n){"use strict";var a=n(843),r=a.addPassiveEventListener,o=(a.removePassiveEventListener,["mousedown","mousewheel","touchmove","keydown"]);e.exports={subscribe:function(e){return"undefined"!=typeof document&&o.forEach(function(t){return r(document,t,e)})}}},1894:function(e,t,n){"use strict";e.exports={defaultEasing:function(e){return e<.5?Math.pow(2*e,2)/2:1-Math.pow(2*(1-e),2)/2},linear:function(e){return e},easeInQuad:function(e){return e*e},easeOutQuad:function(e){return e*(2-e)},easeInOutQuad:function(e){return e<.5?2*e*e:(4-2*e)*e-1},easeInCubic:function(e){return e*e*e},easeOutCubic:function(e){return--e*e*e+1},easeInOutCubic:function(e){return e<.5?4*e*e*e:(e-1)*(2*e-2)*(2*e-2)+1},easeInQuart:function(e){return e*e*e*e},easeOutQuart:function(e){return 1- --e*e*e*e},easeInOutQuart:function(e){return e<.5?8*e*e*e*e:1-8*--e*e*e*e},easeInQuint:function(e){return e*e*e*e*e},easeOutQuint:function(e){return 1+--e*e*e*e*e},easeInOutQuint:function(e){return e<.5?16*e*e*e*e*e:1+16*--e*e*e*e*e}}},1895:function(e,t,n){"use strict";var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();var r=n(0),o=n(738),l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.Component),a(t,[{key:"render",value:function(){return r.createElement("a",this.props,this.props.children)}}]),t}();e.exports=o.Scroll(l)},1896:function(e,t,n){"use strict";t.Link=n(1895),t.Button=n(1888),t.Element=n(1887),t.Helpers=n(738),t.scroller=n(1405),t.Events=n(842),t.scrollSpy=n(1406),t.animateScroll=n(1404)},1897:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=k(n(126)),r=k(n(13)),o=k(n(1)),l=k(n(165)),i=k(n(15)),s=k(n(4)),u=k(n(7)),c=k(n(3)),d=k(n(5)),f=k(n(0)),p=k(n(28)),m=k(n(1407)),h=k(n(108)),v=k(n(333)),y=k(n(1896)),b=n(330),g=k(n(1421)),E=n(148),w=k(n(181));function k(e){return e&&e.__esModule?e:{default:e}}var _=y.default.scroller,S={service:null,url:"",isEmail:!1,isFilename:!1,email:"",filename:!1},C=function(e){function t(){(0,s.default)(this,t);var e=(0,c.default)(this,(t.__proto__||(0,i.default)(t)).call(this));return(0,h.default)(e),e.newClouds="".split(",")||[],e.state={isCookieAccepted:!1,lazyLoadOther:!1,isAds:!0,isUploading:!1,upload:(0,l.default)({},S),isFeatureEnabled:g.default.IS_FEATURE,service:{googleDrive:{},box:{},dropbox:{},pcloud:{disabled:!0},yandexDisk:{disabled:!0},youtube:{disabled:!0},dailymotion:{disabled:!0}}},e.handleIsEmail=e.handleIsEmail.bind(e),e.handleIsFilename=e.handleIsFilename.bind(e),e.handleFileUpload=e.handleFileUpload.bind(e),e.handleTaskKill=e.handleTaskKill.bind(e),e.getAuthenticationMessage=e.getAuthenticationMessage.bind(e),e.handleSetService=e.handleSetService.bind(e),e}return(0,d.default)(t,e),(0,u.default)(t,[{key:"UNSAFE_componentWillMount",value:function(){this.setState({isFeatureEnabled:g.default.isFeature()})}},{key:"componentDidMount",value:function(){this.pingService(),this.init()}},{key:"getAuthenticationMessage",value:function(e){var t=this.isServiceAuthenticated(e);return t?"You are connected on "+e+" as "+t:e+": Please click service to authenticate."}},{key:"init",value:function(){this.setState({isCookieAccepted:!!window.localStorage.getItem("std-cookie-accept"),lazyLoadOther:!0})}},{key:"isServiceAuthenticated",value:function(e){var t=null;switch(e){case"Google Drive":t=this.state.service.googleDrive.name;break;case"Box":t=this.state.service.box.name;break;case"Dropbox":t=this.state.service.dropbox.name;break;case"Pcloud":t=this.state.service.pcloud.name;break;case"Youtube":t=this.state.service.youtube.name;break;case"Yandex Disk":t=this.state.service.yandexDisk.name;break;case"Vimeo":t=this.state.service.vimeo.name;break;case"Dailymotion":t=this.state.service.dailymotion.name;break;case"Twitch":t=this.state.service.twitch.name;break;default:return"Not available"}return t}},{key:"handleSetService",value:function(e,t){this.setState((0,o.default)({},this.state,{upload:(0,o.default)({},this.state.upload,{service:t.value})}))}},{key:"handleFileUpload",value:function(e){var t=this;if(e.preventDefault(),!0===window.isAdsBlocked)return(0,w.default)("Please consider supporting us by disabling your ad blocker or whitelisting us. You can also help us by Donating any amount of your choice.","error");if(!(0,E.captchaChecker)())return!1;if(this.state.isUploading)return(0,w.default)("Another task is in process please wait...","error");if(!this.state.upload.service)return(0,w.default)("Please select any service to upload.","error"),(0,w.default)("Authenticate to service by clicking on service's logo.");if(this.state.upload.isEmail&&!this.state.upload.email)return(0,w.default)("Please fill email address if you want to get notified.","error");if(this.state.upload.isFilename&&!this.state.upload.filename)return(0,w.default)("Please fill filename if you want to change filename.","error");if(!this.state.upload.url)return(0,w.default)("Please provide url to upload.","error");(0,w.default)("Uploading file..","success");var n=this.state.upload,a={url:encodeURIComponent(this.state.upload.url)};return n.isFilename&&(a.isFilename=this.state.upload.isFilename,a.filename=this.state.upload.filename),n.isEmail&&(a.email=this.state.upload.email,a.isEmail=this.state.upload.isEmail),this.setState((0,o.default)({},this.state,{isUploading:!0})),a.captcha=window.uploadCaptchaCode,this.props.actions.uploadFile({service:(0,m.default)(this.state.upload.service),data:a}).then(function(e){e&&(t.setState((0,o.default)({},t.state,{upload:(0,l.default)({},S,{service:t.state.upload.service,email:t.state.upload.email})})),_.scrollTo(e.uuid,{duration:1500,delay:80,smooth:!0,offset:-100}))}).catch(console.log).finally(function(){t.setState((0,o.default)({},t.state,{isUploading:!1}))}),!1}},{key:"handleIsFilename",value:function(){this.setState({upload:(0,o.default)({},this.state.upload,{isFilename:!this.state.upload.isFilename})},function(){var e=document.getElementById("changeFilename");e&&e.focus()})}},{key:"handleIsEmail",value:function(){this.setState({upload:(0,o.default)({},this.state.upload,{isEmail:!this.state.upload.isEmail})},function(){var e=document.getElementById("emailInput");e&&e.focus()})}},{key:"handleTaskKill",value:function(e,t){var n=this;return function(){confirm("Do you want to close this item?")&&(n.props.actions.lockProgress(),n.props.actions.removeTaskFromIndex(e.uuid),n.props.actions.removeUploadedTask(e.uuid,t),n.props.actions.reindexItems(),n.props.actions.unlockProgress())}}},{key:"handleUploadInputs",value:function(e){var t=this;return function(n){return t.setState({upload:(0,o.default)({},t.state.upload,(0,r.default)({},e,n.target.value))})}}},{key:"pingService",value:function(){var e=this;(0,b.getPingApp)().then(function(){(0,a.default)(e.state.service).forEach(function(t){if(!e.state.service[t].disabled)return(0,b.getServiceStatus)((0,m.default)(t)).then(function(n){var a=v.default.set(e.state,"upload.email",n.data.email);a.service[t]=(0,o.default)({},a.service[t],n.data),console.log(a.service[t]),e.setState(a)}).catch(function(){})})}).catch(function(){message.error("We are unable to connect to our server.")})}}]),t}(f.default.Component);C.propTypes={actions:p.default.object.isRequired},t.default=C,e.exports=t.default},1898:function(e,t,n){var a=n(747)(function(e,t,n){return e+(n?"-":"")+t.toLowerCase()});e.exports=a},1911:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=T(n(126)),r=T(n(15)),o=T(n(4)),l=T(n(7)),i=T(n(3)),s=T(n(5)),u=T(n(0)),c=T(n(591)),d=(T(n(748)),T(n(109))),f=T(n(1407)),p=n(113),m=n(53),h=n(67),v=n(97),y=T(n(108)),b=T(n(1897)),g=T(n(1403)),E=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1420)),w=T(n(1402)),k=T(n(739)),_=T(n(1886)),S=T(n(1885)),C=T(n(1884)),O=T(n(1883));function T(e){return e&&e.__esModule?e:{default:e}}var I=function(e){function t(e){(0,o.default)(this,t);var n=(0,i.default)(this,(t.__proto__||(0,r.default)(t)).call(this,e));return(0,y.default)(n),n}return(0,s.default)(t,e),(0,l.default)(t,[{key:"renderFilenameInput",value:function(){return u.default.createElement(h.Form.Field,null,u.default.createElement(h.Input,{id:"changeFilename",type:"text",label:{color:"blue",content:"File Name",className:"equal-sized-label"},placeholder:"Type desired file name",onChange:this.handleUploadInputs("filename")}))}},{key:"renderEmailInput",value:function(){return u.default.createElement(h.Form.Field,null,u.default.createElement(h.Input,{id:"emailInput",type:"text",label:{color:"blue",content:"Email",className:"equal-sized-label"},placeholder:"Type your email here",value:this.state.upload.email,onChange:this.handleUploadInputs("email")}))}},{key:"getServices",value:function(){var e=this;return(0,a.default)(this.state.service).map(function(t){return{key:t,text:(0,d.default)(t),value:t,disabled:!e.state.service[t].name}})}},{key:"servicesFactory",value:function(e){var t=this;return t.state.service[e].disabled?u.default.createElement(h.Popup,{key:e,trigger:u.default.createElement("a",null,u.default.createElement("svg",{className:"sd-icon sd-icon--blue sd-icon--large"},u.default.createElement("use",{xlinkHref:"#"+(0,f.default)(e)}))),hoverable:!0,content:"This service is not available",size:"tiny"}):u.default.createElement(h.Popup,{key:e,trigger:u.default.createElement("a",{href:"/authenticate?service="+(0,f.default)(e)+"&public=true",title:"Click to authenticate"},(0,c.default)(t.isServiceAuthenticated((0,d.default)(e)))(u.default.createElement("svg",{className:"sd-icon sd-icon--medium cloud-provider__icon-active"},u.default.createElement("use",{xlinkHref:"#check"}))),u.default.createElement("svg",{className:"sd-icon sd-icon--blue sd-icon--large"},u.default.createElement("use",{xlinkHref:"#"+(0,f.default)(e)}))),hoverable:!0,content:t.getAuthenticationMessage((0,d.default)(e)),size:"tiny"})}},{key:"renderCloudProvider",value:function(){var e=this;return u.default.createElement("div",{className:"cloud-provider text-center"},u.default.createElement("div",{className:"text-center text-white mb-3"},"Select any of your cloud storage service ",u.default.createElement("br",null)," by clicking their logo from below."),(0,a.default)(this.state.service).map(function(t){return e.servicesFactory(t)}))}},{key:"handleOnCookieAccept",value:function(){window.localStorage.setItem("std-cookie-accept",!0),this.setState({isCookieAccepted:!0})}},{key:"render",value:function(){return u.default.createElement("div",null,!this.state.isCookieAccepted&&u.default.createElement(O.default,{onAccept:this.handleOnCookieAccept}),u.default.createElement("section",{className:"sd-intro pt-10"},u.default.createElement("div",{className:"ui container"},u.default.createElement("h2",{className:"center aligned intro-header intro-header--border-bottom"},"Easily upload multiple files to your drive."),this.renderCloudProvider(),u.default.createElement(h.Form,{className:"mt-4",name:"upload"},u.default.createElement(h.Grid,{centered:!0},u.default.createElement(h.Grid.Column,{mobile:"16",computer:"12"},u.default.createElement(h.Form.Field,null,u.default.createElement(h.Input,{className:"round",type:"text",value:this.state.upload.url,onChange:this.handleUploadInputs("url"),placeholder:"Place URL here",action:!0},u.default.createElement("input",null),u.default.createElement(h.Select,{options:this.getServices(),onChange:this.handleSetService,placeholder:"Select service"}),u.default.createElement(h.Button,{type:"submit",color:"orange",onClick:this.handleFileUpload},u.default.createElement(h.Icon,{name:"upload"}),"Upload")),u.default.createElement("br",null),u.default.createElement(w.default,{status:this.state.isAds,ads:function(){return u.default.createElement(g.default,{type:g.default.LEADER_BOARD,style:{marginTop:"10px",marginLeft:"5%"}})}}))),u.default.createElement(h.Grid.Column,{mobile:"16",tablet:"10",computer:"8"},u.default.createElement(h.Form.Group,null,u.default.createElement(h.Form.Field,null,u.default.createElement(h.Checkbox,{onClick:this.handleIsFilename,checked:this.state.upload.isFilename,className:"mr-4",label:u.default.createElement("label",{htmlFor:"isFilename"},u.default.createElement("span",{style:{color:"white"}},"Change file name"))})),u.default.createElement(h.Form.Field,null,u.default.createElement(h.Checkbox,{onClick:this.handleIsEmail,checked:this.state.upload.isEmail,label:u.default.createElement("label",{htmlFor:"isEmail"},u.default.createElement("span",{style:{color:"white"}},"Mail me when upload is success/error"))}))),u.default.createElement(h.Form.Group,null,u.default.createElement(h.Form.Field,{style:{marginLeft:"25%"}},u.default.createElement(k.default,null)))),u.default.createElement(h.Grid.Row,null,u.default.createElement(h.Grid.Column,{mobile:"16",computer:"8"},this.state.upload.isFilename?this.renderFilenameInput():"",this.state.upload.isEmail?this.renderEmailInput():"")))))),u.default.createElement("div",{className:"bg-dark-blue"},u.default.createElement(h.Grid,{container:!0},u.default.createElement(h.Grid.Column,null,u.default.createElement("div",{className:"text-white text-center"},u.default.createElement(h.Icon,{className:"mr-2",name:"announcement",size:"large"}),"We don't like showing Ads either, but they are our only way to maintain the server. We hope our service is worth it.")))),u.default.createElement(h.Grid,{container:!0,className:"mt-1 mb-2"},u.default.createElement(C.default,{isAds:this.state.isAds,items:this.props.upload.items||[]}),u.default.createElement(h.Grid.Column,{mobile:"16",computer:"11"},u.default.createElement(w.default,{status:this.state.isAds,ads:function(){return u.default.createElement(g.default,{type:g.default.LEADER_BOARD})}}),(0,c.default)(this.props.upload.items.length)(u.default.createElement(S.default,{items:this.props.upload.items,handleTaskKill:this.handleTaskKill})),u.default.createElement(_.default,null))))}}]),t}(b.default);t.default=(0,m.withRouter)((0,p.connect)(function(e){return{upload:e.upload}},function(e){return{actions:(0,v.bindActionCreators)(E,e)}})(I)),e.exports=t.default},591:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e){return function(t){return e?function(e){return"function"==typeof e}(t)?t():t:null}},e.exports=t.default},737:function(e,t,n){"use strict";e.exports={pushHash:function(e){if(e=e?0===e.indexOf("#")?e:"#"+e:"",history.pushState){var t=window.location;history.pushState(null,null,e||t.pathname+t.search)}else location.hash=e},getHash:function(){return window.location.hash.replace(/^#/,"")},filterElementInContainer:function(e){return function(t){return e.contains?e!=t&&e.contains(t):!!(16&e.compareDocumentPosition(t))}},scrollOffset:function(e,t){return e===document?t.getBoundingClientRect().top+window.scrollY:"relative"===getComputedStyle(e).position?t.offsetTop:t.offsetTop-e.offsetTop}}},738:function(e,t,n){"use strict";var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var s=n(0),u=(n(21),n(737),n(1406)),c=n(1405),d=n(1892),f=n(1889),p={to:d.string.isRequired,containerId:d.string,container:d.object,activeClass:d.string,spy:d.bool,smooth:d.oneOfType([d.bool,d.string]),offset:d.number,delay:d.number,isDynamic:d.bool,onClick:d.func,duration:d.oneOfType([d.number,d.func]),absolute:d.bool,onSetActive:d.func,onSetInactive:d.func,ignoreCancelEvents:d.bool,hashSpy:d.bool},m={Scroll:function(e,t){var n=t||c,d=function(t){function c(e){o(this,c);var t=l(this,(c.__proto__||Object.getPrototypeOf(c)).call(this,e));return m.call(t),t.state={active:!1},t}return i(c,s.Component),r(c,[{key:"getScrollSpyContainer",value:function(){var e=this.props.containerId,t=this.props.container;return e?document.getElementById(e):t&&t.nodeType?t:document}},{key:"componentDidMount",value:function(){if(this.props.spy||this.props.hashSpy){var e=this.getScrollSpyContainer();u.isMounted(e)||u.mount(e),this.props.hashSpy&&(f.isMounted()||f.mount(n),f.mapContainer(this.props.to,e)),this.props.spy&&u.addStateHandler(this.stateHandler),u.addSpyHandler(this.spyHandler,e),this.setState({container:e})}}},{key:"componentWillUnmount",value:function(){u.unmount(this.stateHandler,this.spyHandler)}},{key:"render",value:function(){var t="";t=this.state&&this.state.active?((this.props.className||"")+" "+(this.props.activeClass||"active")).trim():this.props.className;var n=a({},this.props);for(var r in p)n.hasOwnProperty(r)&&delete n[r];return n.className=t,n.onClick=this.handleClick,s.createElement(e,n)}}]),c}(),m=function(){var e=this;this.scrollTo=function(t,r){n.scrollTo(t,a({},e.state,r))},this.handleClick=function(t){e.props.onClick&&e.props.onClick(t),t.stopPropagation&&t.stopPropagation(),t.preventDefault&&t.preventDefault(),e.scrollTo(e.props.to,e.props)},this.stateHandler=function(){n.getActiveLink()!==e.props.to&&(null!==e.state&&e.state.active&&e.props.onSetInactive&&e.props.onSetInactive(),e.setState({active:!1}))},this.spyHandler=function(t){var a=e.getScrollSpyContainer();if(!f.isMounted()||f.isInitialized()){var r=e.props.to,o=null,l=0,i=0,s=0;if(a.getBoundingClientRect)s=a.getBoundingClientRect().top;if(!o||e.props.isDynamic){if(!(o=n.get(r)))return;var c=o.getBoundingClientRect();i=(l=c.top-s+t)+c.height}var d=t-e.props.offset,p=d>=Math.floor(l)&&d<Math.floor(i),m=d<Math.floor(l)||d>=Math.floor(i),h=n.getActiveLink();return m?(r===h&&n.setActiveLink(void 0),e.props.hashSpy&&f.getHash()===r&&f.changeHash(),e.props.spy&&e.state.active&&(e.setState({active:!1}),e.props.onSetInactive&&e.props.onSetInactive()),u.updateStates()):p&&h!==r?(n.setActiveLink(r),e.props.hashSpy&&f.changeHash(r),e.props.spy&&(e.setState({active:!0}),e.props.onSetActive&&e.props.onSetActive(r)),u.updateStates()):void 0}}};return d.propTypes=p,d.defaultProps={offset:0},d},Element:function(e){var t=function(t){function n(e){o(this,n);var t=l(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,e));return t.childBindings={domNode:null},t}return i(n,s.Component),r(n,[{key:"componentDidMount",value:function(){if("undefined"==typeof window)return!1;this.registerElems(this.props.name)}},{key:"componentWillReceiveProps",value:function(e){this.props.name!==e.name&&this.registerElems(e.name)}},{key:"componentWillUnmount",value:function(){if("undefined"==typeof window)return!1;c.unregister(this.props.name)}},{key:"registerElems",value:function(e){c.register(e,this.childBindings.domNode)}},{key:"render",value:function(){return s.createElement(e,a({},this.props,{parentBindings:this.childBindings}))}}]),n}();return t.propTypes={name:d.string,id:d.string},t}};e.exports=m},842:function(e,t,n){"use strict";var a={registered:{},scrollEvent:{register:function(e,t){a.registered[e]=t},remove:function(e){a.registered[e]=null}}};e.exports=a},843:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.addPassiveEventListener=function(e,t,n){var a=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){e=!0}});window.addEventListener("test",null,t)}catch(e){}return e}();e.addEventListener(t,n,!!a&&{passive:!0})},t.removePassiveEventListener=function(e,t,n){e.removeEventListener(t,n)}}}]);