import{useMemo as t,useState as e,useCallback as r}from"react";import{produce as o}from"immer";function c(c){var n=new Set,a={},f=new Map,p=new Proxy(c,{get:function(t,e){n.add(e)}}),O=[],i={};"Object"===Object.getPrototypeOf(c).constructor.name?(O=Object.keys(c),i=c):(O=Object.keys(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(c))).concat(Object.keys(c)),i=Object.getPrototypeOf(c)),O.forEach(function(t){var e=Object.getOwnPropertyDescriptor(i,t);e&&e.get?(a[t]=e.get.call(p),f.set(t,{get:e.get,depends:Array.from(n)}),n.clear()):a[t]=c[t]});var u=e(a),g=u[0],s=u[1],y=r(function(t){s(o(t))},[]);return f.forEach(function(e,r){var o=e.depends.map(function(t){return g[t]});t(function(){y(function(t){t[r]=e.get.call(t)})},o)}),[g,y]}export default c;export{c as useImmox};
//# sourceMappingURL=immox.module.js.map
