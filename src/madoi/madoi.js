!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.madoi=t():e.madoi=t()}(self,(function(){return(()=>{"use strict";var e={d:(t,s)=>{for(var n in s)e.o(s,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:s[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function s(e={}){return e=>{}}e.r(t),e.d(t,{ShareClass:()=>s,Share:()=>o,GetState:()=>r,SetState:()=>a,EnterRoom:()=>c,LeaveRoom:()=>h,PeerJoin:()=>d,PeerLeave:()=>l,Madoi:()=>f});const n={type:"beforeExec",maxLog:0,allowedTo:["USER"]};function o(e=n){const t=e;return t.type||(t.type="beforeExec"),t.maxLog||(t.maxLog=0),(e,s,n)=>{const o={share:t};e[s].madoiMethodConfig_=o}}const i={maxInterval:5e3};function r(e=i){const t=e;return(e,s,n)=>{const o={getState:t};e[s].madoiMethodConfig_=o}}function a(e={}){const t=e;return(e,s,n)=>{const o={setState:t};e[s].madoiMethodConfig_=o}}function c(e={}){const t=e;return(e,s,n)=>{const o={enterRoom:t};e[s].madoiMethodConfig_=o}}function h(e={}){const t=e;return(e,s,n)=>{const o={leaveRoom:t};e[s].madoiMethodConfig_=o}}function d(e={}){const t=e;return(e,s,n)=>{const o={peerJoin:t};e[s].madoiMethodConfig_=o}}function l(e={}){const t=e;return(e,s,n)=>{const o={peerLeave:t};e[s].madoiMethodConfig_=o}}class f{constructor(e,t="",s={}){this.connecting=!1,this.sharedFunctions=[],this.sharedObjects=[],this.getStateMethods=new Map,this.setStateMethods=new Map,this.enterRoomMethods=new Map,this.leaveRoomMethods=new Map,this.peerJoinMethods=new Map,this.peerLeaveMethods=new Map,this.promises={},this.changedObjects=new Map,this.handlers={},this.selfPeerId=null,this.currentSenderPeerId=null,this.interimQueue=new Array,this.sendMessage({type:"SessionInfo",body:s});let n=null;if(e.match(/^wss?:\/\//))n=e+`?key=${t}`;else{const s=document.querySelector("script[src$='madoi.js']").src.split("/",5);n=`${("http:"==s[0]?"ws:":"wss:")+"//"+s[2]+"/"+s[3]}/${e}?key=${t}`}this.ws=new WebSocket(n),this.ws.onopen=e=>this.handleOnOpen(e),this.ws.onclose=e=>this.handleOnClose(e),this.ws.onerror=e=>this.handleOnError(e),this.ws.onmessage=e=>this.handleOnMessage(e),setInterval((()=>{this.saveStates()}),1e3)}getCurrentSenderPeerId(){return this.currentSenderPeerId}isSelfCall(){return this.currentSenderPeerId==this.selfPeerId}close(){var e;null===(e=this.ws)||void 0===e||e.close()}handleOnOpen(e){var t;this.connecting=!0;for(let e of this.interimQueue)null===(t=this.ws)||void 0===t||t.send(JSON.stringify(e));this.interimQueue=[],this.onOpen(e)}handleOnClose(e){console.debug(`websocket closed because: ${e.reason}.`),this.connecting=!1,this.onClose(e),this.ws=null}handleOnError(e){this.onError(e)}handleOnMessage(e){var t=JSON.parse(e.data);this.currentSenderPeerId=t.sender,this.data(t)}data(e){if("EnterRoom"==e.type){for(const[t,s]of this.enterRoomMethods)s(e.peerId,e.peers);const t=e;if(this.selfPeerId=t.peerId,this.onEnterRoom(e.peerId,e.peers),e.histories)for(const t of e.histories)this.data(t)}else if("LeaveRoom"==e.type){for(const[t,s]of this.leaveRoomMethods)s(e.peerId);this.onLeaveRoom()}else if("PeerJoin"==e.type){for(const[t,s]of this.peerJoinMethods)s(e.peerId);this.onPeerJoin(e.peerId)}else if("PeerLeave"==e.type){for(const[t,s]of this.peerLeaveMethods)s(e.peerId);this.onPeerLeave(e.peerId)}else if("Invocation"==e.type){const t=this.sharedFunctions[e.funcId];if(t){const s=this.applyInvocation(t,e.args);s instanceof Promise&&s.then((()=>{this.promises[e.funcId].resolve.apply(null,arguments)})).catch((()=>{this.promises[e.funcId].reject.apply(null,arguments)}))}else this.onElse(e)}else if("ObjectState"==e.type){const t=this.setStateMethods.get(e.objId);t&&t(e.state)}else{const t=e;this.handlers[t.type]?this.handlers[t.type](t.body):this.onElse(t)}}onOpen(e){}onClose(e){}onError(e){}onElse(e){}onEnterRoom(e,t){}onLeaveRoom(){}onPeerJoin(e){}onPeerLeave(e){}send(e,t,s){this.ws&&this.sendMessage({type:e,headers:s,body:t})}broadcast(e,t,s){this.sendMessage({type:e,castType:"BROADCAST",body:t})}othercast(e,t,s){this.sendMessage({type:e,castType:"OTHERCAST",body:t})}setHandler(e,t){this.handlers[e]=t}clearHandler(e){delete this.handlers}sendMessage(e){var t;this.connecting?null===(t=this.ws)||void 0===t||t.send(JSON.stringify(e)):this.interimQueue.push(e)}register(e,t=[]){if(!this.ws)return;if(e.madoiObjectId_)return void console.warn("Ignore object registration because it's already registered.");const s=e.constructor.name,o=this.sharedObjects.length;this.sharedObjects.push(e),e.madoiObjectId_=o;const r=new Array,a=new Array,c=new Map;Object.getOwnPropertyNames(e.__proto__).forEach((t=>{const n=e[t];if("function"!=typeof n)return;if(!n.madoiMethodConfig_)return;const o=n.madoiMethodConfig_,i=r.length;c.set(t,i),r.push(n),a.push({name:t,config:o}),console.debug(`add config ${s}.${t}=${JSON.stringify(o)} from decorator`)}));for(const e of t){const t=e.method,o=t.name;let h;if(e.share)e.share.type||(e.share.type=n.type),e.share.maxLog||(e.share.maxLog=n.maxLog),h={share:e.share};else if(e.getState)e.getState.maxInterval||(e.getState.maxInterval=i.maxInterval),h={getState:e.getState};else if(e.setState)h={setState:e.setState};else if(e.enterRoom)h={enterRoom:e.enterRoom};else if(e.leaveRoom)h={leaveRoom:e.leaveRoom};else if(e.peerJoin)h={peerJoin:e.peerJoin};else{if(!e.peerLeave)continue;h={peerLeave:e.peerLeave}}const d=c.get(o);if(void 0===d){const n=r.length;c.set(o,n),r.push(t),a.push({name:e.method.name,config:h}),console.debug(`add config ${s}=${JSON.stringify(e)} from argument`)}else a[d].config=h,console.debug(`replace config ${s}=${JSON.stringify(e)} from argument`)}for(let t=0;t<r.length;t++){const s=r[t],n=a[t];if(n.config.share){const[t,i]=this.addSharedFunction(s.bind(e),n.config.share,o);n.funcId=t;const r=this;e[s.name]=function(){const e=r.changedObjects.get(o);return e?r.changedObjects.set(o,e+1):r.changedObjects.set(o,1),i.apply(null,arguments)}}else n.config.getState?this.getStateMethods.set(o,{method:s.bind(e),config:n.config.getState,lastGet:0}):n.config.setState?this.setStateMethods.set(o,s.bind(e)):n.config.enterRoom?this.enterRoomMethods.set(o,s.bind(e)):n.config.leaveRoom?this.leaveRoomMethods.set(o,s.bind(e)):n.config.peerJoin?this.peerJoinMethods.set(o,s.bind(e)):n.config.peerLeave&&this.peerLeaveMethods.set(o,s.bind(e))}const h={type:"ObjectInfo",objId:o,className:s,methods:a};this.sendMessage(h)}registerShareFunction(e,t=n){const s=e.name,[o,i]=this.addSharedFunction(e,t),r={type:"FunctionInfo",funcId:o,name:s,config:t};return this.sendMessage(r),function(){return i.apply(null,arguments)}}addSharedFunction(e,t,s){const n=this.sharedFunctions.length;this.sharedFunctions.push(e),this.promises[n]={},this.promises[n].promise=new Promise(((e,t)=>{this.promises[n].resolve=e,this.promises[n].reject=t}));const o=this;return[n,function(){if(null!=o.ws){let i=null,r="BROADCAST";"afterExec"==t.type&&(i=e.apply(null,arguments),r="OTHERCAST");const a={type:"Invocation",sender:o.selfPeerId,castType:r,objId:s,funcId:n,funcName:e.name,args:Array.from(arguments)};return o.ws.send(JSON.stringify(a)),null!=i?i:o.promises[n].promise}if(e)return e.apply(null,arguments)}]}saveStates(){if(this.ws&&this.connecting)for(let[e,t]of this.changedObjects){if(0==t)continue;const s=this.getStateMethods.get(e);if(!s)continue;const n=performance.now();if(s.config.maxUpdates&&s.config.maxUpdates<=t||s.config.maxInterval&&s.config.maxInterval<=n-s.lastGet){const t={type:"ObjectState",objId:e,state:s.method()};this.ws.send(JSON.stringify(t)),s.lastGet=n,this.changedObjects.set(e,0),console.log(`state saved: ${e}`)}}}applyInvocation(e,t){return e.apply(null,t)}}return t})()}));