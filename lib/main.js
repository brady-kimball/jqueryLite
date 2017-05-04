const DOMNodeCollection = require('./dom_node_collection.js');

const functionsToRun = [];
let docLoaded = false;

function $l(input) {
  let htmlArray;
  if (typeof input === "string") {
    let nodeList = document.querySelectorAll(input);
    htmlArray = Array.from(nodeList);
  } else if (input instanceof HTMLElement) {
    htmlArray = [input];
  } else if (typeof input === "function") {
    if (!docLoaded) {
      functionsToRun.push(input);
    } else {
      input();
    }
  }

  return new DOMNodeCollection(htmlArray);
}

$l.ajax = function(options) {
  
};

$l.extend = function(...objs) {
  return Object.assign({}, ...objs);
};


document.addEventListener('DOMContentLoaded', () => {
  docLoaded = true;
  functionsToRun.forEach ( (func) => {
    func();
  });
});

window.$l = $l;
