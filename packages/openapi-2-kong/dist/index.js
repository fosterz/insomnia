parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"FoEN":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.parseSpec=o,exports.getServers=n,exports.getAllServers=s,exports.getSecurity=p,exports.getName=a,exports.generateSlug=u,exports.pathVariablesToRegex=i,exports.parseUrl=c,exports.fillServerVariables=l,exports.joinPath=f;var e=t(require("swagger-parser")),r=t(require("url"));function t(e){return e&&e.__esModule?e:{default:e}}async function o(r){let t;if("string"==typeof r)try{t=JSON.parse(r)}catch(o){t=e.default.YAML.parse(r)}else t=JSON.parse(JSON.stringify(r));return t.info||(t.info={}),"3.0"===t.openapi&&(t.openapi="3.0.0"),e.default.dereference(t)}function n(e){return e.servers||[]}function s(e){const r=n(e);for(const t of Object.keys(e.paths))for(const o of n(e.paths[t]))r.push(o);return r}function p(e){return e.security||[]}function a(e){let r;return e["x-kong-name"]&&(r=e["x-kong-name"]),!r&&e.info&&e.info.title&&(r=e.info.title),u(r||"openapi")}function u(e){return e.replace(/[\s_\-.~,]/g,"_")}function i(e){return e.replace(/{([^}]+)}/g,"(?<$1>\\S+)")+"$"}function c(e){const t=r.default.parse(e);return t.port||"https:"!==t.protocol?t.port||"http:"!==t.protocol||(t.port="80"):t.port="443",t.protocol=t.protocol||"http:",t.host=`${t.hostname}:${t.port}`,t}function l(e){let r=e.url;const t=e.variables||{};for(const o of Object.keys(t)){const e=t[o].default;if(!e)throw new Error(`Server variable "${o}" missing default value`);r=r.replace(`{${o}}`,e)}return r}function f(e,r){return`${e=e.replace(/\/$/,"")}/${r=r.replace(/^\//,"")}`}
},{}],"ESDp":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateSecurityPlugins=n,exports.generateApiKeySecurityPlugin=t,exports.generateHttpSecurityPlugin=r,exports.generateOpenIdConnectSecurityPlugin=o,exports.generateOAuth2SecurityPlugin=i,exports.generateSecurityPlugin=c;var e=require("./common");function n(n,t){const r=[],o=(t.components||{}).securitySchemes||{},i=(0,e.getSecurity)(n)||(0,e.getSecurity)(t)||[];for(const e of i)for(const n of Object.keys(e)){const t=c(o[n]||{},e[n]);t&&r.push(t)}return r}function t(e){if(!["query","header","cookie"].includes(e.in))throw new Error(`a ${e.type} object expects valid "in" property. Got ${e.in}`);if(!e.name)throw new Error(`a ${e.type} object expects valid "name" property. Got ${e.name}`);return{name:"key-auth",config:{key_names:[e.name]}}}function r(e){if("basic"!==e.scheme)throw new Error(`Only "basic" http scheme supported. got ${e.scheme}`);return{name:"basic-auth",config:{}}}function o(e,n){if(!e.openIdConnectUrl)throw new Error(`invalid "openIdConnectUrl" property. Got ${e.openIdConnectUrl}`);return{name:"openid-connect",config:{issuer:e.openIdConnectUrl,scopes_required:n||[]}}}function i(e,n){return{config:{auth_methods:["client_credentials"]},name:"openid-connect"}}function c(e,n){let c=null;if("apiKey"===e.type)c=t(e);else if("http"===e.type)c=r(e);else if("openIdConnect"===e.type)c=o(e,n);else{if("oauth2"!==e.type)return null;c=i(e)}for(const t of Object.keys(e)){if(0!==t.indexOf("x-kong-security-"))continue;const n=e[t];n.config&&(c.config=n.config)}return c}
},{"./common":"FoEN"}],"d5ui":[function(require,module,exports) {
"use strict";function e(e){const r=[];for(const n of Object.keys(e))0===n.indexOf("x-kong-plugin-")&&r.push(t(n,e[n],e));return r}function t(e,t,n){if(e.match(/-request-validator$/))return r(t,n);const o={name:t.name||e.replace(/^x-kong-plugin-/,"")};return t.config&&(o.config=t.config),o}function r(e,t){const r={version:"draft4",parameter_schema:[]};if(t.parameters)for(const n of t.parameters){if(!n.schema)throw new Error("Parameter using 'content' type validation is not supported");r.parameter_schema.push({in:n.in,explode:!!n.explode,required:!!n.required,name:n.name,schema:JSON.stringify(n.schema),style:"simple"})}if(t.requestBody){const e=t.requestBody.content;if(!e)throw new Error("content property is missing for request-validator!");let n;for(const t of e){if("application/json"!==t.mediatype)throw new Error(`Body validation supports only 'application/json', not ${t.mediatype}`);n=JSON.stringify(t.schema)}n&&(r.body_schema=n)}return{config:r,enabled:!0,name:"request-validator"}}Object.defineProperty(exports,"__esModule",{value:!0}),exports.generatePlugins=e,exports.generatePlugin=t,exports.generateRequestValidatorPlugin=r;
},{}],"F1gv":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateServices=n,exports.generateService=o,exports.generateRouteName=s;var e=require("./common"),t=require("./security-plugins"),r=require("./plugins");function n(t,r){const n=(0,e.getAllServers)(t);if(0===n.length)throw new Error("no servers defined in spec");return[o(n[0],t,r)]}function o(n,o,a){const{pathname:i,protocol:p,port:u}=(0,e.parseUrl)((0,e.fillServerVariables)(n)),g=(0,e.getName)(o),c={name:g,path:"/",port:parseInt(u),protocol:p.replace(":",""),routes:[],tags:a,host:g};for(const l of Object.keys(o.paths)){const n=o.paths[l];for(const p of Object.keys(n)){if("get"!==p&&"put"!==p&&"post"!==p&&"delete"!==p&&"options"!==p&&"head"!==p&&"patch"!==p&&"trace"!==p)continue;const u=n[p];if(!u)continue;const g=(0,e.joinPath)(i,l),h=(0,e.pathVariablesToRegex)(g),f={tags:a,name:s(o,n,p,c.routes.length),methods:[p.toUpperCase()],paths:[h],strip_path:!1},m=(0,t.generateSecurityPlugins)(u,o),y=[...(0,r.generatePlugins)(u),...m];y.length&&(f.plugins=y),c.routes.push(f)}}return c}function s(t,r,n,o){const s=o,a=(0,e.getName)(t);if("string"==typeof r["x-kong-name"]){return`${a}-${(0,e.generateSlug)(r["x-kong-name"])}-${n}`}if("string"==typeof r.summary){return`${a}-${(0,e.generateSlug)(r.summary)}-${n}`}return`${(0,e.generateSlug)(a)}-path${s?"_"+s:""}-${n}`}
},{"./common":"FoEN","./security-plugins":"ESDp","./plugins":"d5ui"}],"jHpF":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generateUpstreams=t;var e=require("./common");function t(t,r){const s=t.servers||[];if(0===s.length)return[];const o={name:(0,e.getName)(t),targets:[],tags:r};for(const n of s)o.targets.push({target:(0,e.parseUrl)(n.url).host});return[o]}
},{"./common":"FoEN"}],"Focm":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.generate=u,exports.generateFromString=i,exports.generateFromSpec=o;var e=a(require("fs")),r=a(require("path")),t=require("./common"),s=require("./services"),n=require("./upstreams");function a(e){return e&&e.__esModule?e:{default:e}}async function u(t,s=[]){return new Promise((n,a)=>{e.default.readFile(r.default.resolve(t),"utf8",(e,u)=>{if(null!=e)return void a(e);const o=[`OAS3file_${r.default.basename(t)}`,...s];n(i(u,o))})})}async function i(e,r=[]){return o(await(0,t.parseSpec)(e),["OAS3_import",...r])}function o(e,r=[]){let t=null;try{t={_format_version:"1.1",services:(0,s.generateServices)(e,r),upstreams:(0,n.generateUpstreams)(e,r)}}catch(a){throw new Error("Failed to generate spec: "+a.message)}return JSON.parse(JSON.stringify(t))}
},{"./common":"FoEN","./services":"F1gv","./upstreams":"jHpF"}]},{},["Focm"], null)
//# sourceMappingURL=/index.js.map