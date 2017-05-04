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
  const defaults = {
    success: () => {console.log("SUCCESS!");},
    error: () => {console.log("FAILURE!");},
    url: window.location.href,
    method: 'GET',
    data:  {},
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
  };
  options = $l.extend(defaults, options);
  const xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.onload = function () {
    console.log(xhr.status);
    console.log(xhr.responseType);
    console.log(xhr.response);

    if (xhr.status === 200) {
      options.success(xhr.response);
    } else {
      options.error(xhr.response);
    }
  };

  const optionalData = JSON.stringify(options.data);
  xhr.send(optionalData);
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
