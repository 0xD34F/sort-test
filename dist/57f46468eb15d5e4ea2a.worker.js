!function(t){function e(n){if(r[n])return r[n].exports;var s=r[n]={i:n,l:!1,exports:{}};return t[n].call(s.exports,s,s.exports,e),s.l=!0,s.exports}var r={};e.m=t,e.c=r,e.d=function(t,r,n){e.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:n})},e.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(r,"a",r),r},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="dist/",e(e.s=0)}([function(module,exports,__webpack_require__){function _toConsumableArray(t){if(Array.isArray(t)){for(var e=0,r=Array(t.length);e<t.length;e++)r[e]=t[e];return r}return Array.from(t)}function _defineProperty(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}var _extends=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var r=arguments[e];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},context=__webpack_require__(1),algorithms=context.keys().reduce(function(t,e){return _extends({},t,_defineProperty({},e.match(/\w+/).pop(),context(e).default))},{}),random=function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Math.floor(Math.random()*(t-e))+e},sortTest={algorithms:algorithms,stats:{},resetStats:function(){Object.assign(this.stats,{comparisons:0,swaps:0,startTime:new Date})},compare:function(t,e){return this.stats.comparisons++,t-e},swap:function(t,e,r){this.stats.swaps++;var n=t[e];t[e]=t[r],t[r]=n},run:function(t,e){var r=[].concat(_toConsumableArray(e));return this.resetStats(),this.algorithms[t].call(this,r),{sort:t,elements:e.length,comparisons:this.stats.comparisons,swaps:this.stats.swaps,time:new Date-this.stats.startTime}}},post={testID:null,result:function(t){self.postMessage({id:post.testID,results:t})},error:function(t){self.postMessage({id:post.testID,error:t})}};self.addEventListener("message",function(e){post.testID=e.data.id;var testParams=e.data.params,elements=null;try{if(elements=eval("("+testParams.elements+")"),elements instanceof Function&&(elements=elements()),!(elements instanceof Array))throw"not an array"}catch(e){post.error("Arrays sizes: "+(e.message||e))}var fill=null;try{if(!((fill=eval("("+testParams.fill+")"))instanceof Function))throw"not a function"}catch(e){post.error("Arrays fill: "+(e.message||e))}if(elements instanceof Array&&fill instanceof Function)try{elements.forEach(function(t){var e=new Array(t);fill(e),testParams.sorts.forEach(function(t){return post.result(sortTest.run(t,e))})})}catch(e){post.error("Test execution: "+e.message)}post.result(null)})},function(t,e,r){function n(t){return r(s(t))}function s(t){var e=o[t];if(!(e+1))throw new Error("Cannot find module '"+t+"'.");return e}var o={"./bubble.js":2,"./comb.js":3,"./counting.js":4,"./gnome.js":5,"./heap.js":6,"./insertion.js":7,"./oddEven.js":8,"./quick.js":9,"./selection.js":10};n.keys=function(){return Object.keys(o)},n.resolve=s,t.exports=n,n.id=1},function(t,e,r){"use strict";function n(t){for(var e=1;e<t.length;e++)for(var r=e;r>0;r--)this.compare(t[r],t[r-1])<0&&this.swap(t,r,r-1);return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t){for(var e=t.length,r=!1;!r;){e=Math.floor(e/1.3),e>1?r=!1:(e=1,r=!0);for(var n=0;n<t.length-e;n++)this.compare(t[n],t[n+e])>0&&(this.swap(t,n,n+e),r=!1)}return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t){for(var e=[],r=0;r<t.length;r++)e[t[r]]=(e[t[r]]||0)+1;for(var n=0,s=0;s<e.length;s++)for(;e[s]--;)t[n++]=s;return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t){for(var e=1,r=2;e<t.length;)this.compare(t[e-1],t[e])<0?(e=r,r++):(this.swap(t,e-1,e),0===--e&&(e=r,r++));return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t,e,r){var s=2*e+1,o=2*e+2,a=e;s<r&&this.compare(t[s],t[e])>0&&(a=s),o<r&&this.compare(t[o],t[a])>0&&(a=o),a!==e&&(this.swap(t,e,a),n.call(this,t,a,r))}function s(t){for(var e=Math.floor(t.length/2);e>=0;e--)n.call(this,t,e,t.length)}function o(t){var e=t.length;s.call(this,t);for(var r=t.length-1;r>0;r--)this.swap(t,0,r),e--,n.call(this,t,0,e);return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=o},function(t,e,r){"use strict";function n(t){for(var e=1;e<t.length;e++){for(var r=t[e],n=e;n>0&&this.compare(t[n-1],r)>0;n--)t[n]=t[n-1];t[n]=r}return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t){for(var e=!1;!e;){e=!0;for(var r=1;r<t.length-1;r+=2)this.compare(t[r],t[r+1])>0&&(this.swap(t,r,r+1),e=!1);for(var n=0;n<t.length-1;n+=2)this.compare(t[n],t[n+1])>0&&(this.swap(t,n,n+1),e=!1)}return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n},function(t,e,r){"use strict";function n(t,e,r){for(var n=t[r],s=e-1,o=e;o<r;o++)this.compare(t[o],n)<=0&&(s++,this.swap(t,s,o));return this.swap(t,s+1,r),s+1}function s(t){var e=0,r=t.length-1,s=-1,o=new Array(t.length);for(o[++s]=e,o[++s]=r;s>=0;){r=o[s--],e=o[s--];var a=n.call(this,t,e,r);a-1>e&&(o[++s]=e,o[++s]=a-1),a+1<r&&(o[++s]=a+1,o[++s]=r)}return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=s},function(t,e,r){"use strict";function n(t){for(var e=0;e<t.length-1;e++){for(var r=e,n=t[e],s=e+1;s<t.length;s++)this.compare(n,t[s])>0&&(n=t[s],r=s);e!==r&&this.swap(t,e,r)}return t}Object.defineProperty(e,"__esModule",{value:!0}),e.default=n}]);
//# sourceMappingURL=57f46468eb15d5e4ea2a.worker.js.map