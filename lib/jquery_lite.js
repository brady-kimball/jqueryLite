/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

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


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(htmlArray) {
    this.htmlArray = htmlArray;
  }

  addClass(className) {
    this.htmlArray.forEach ( (el) => el.classList.add(className));
  }

  append(children) {
    if (this.htmlArray.length === 0) return;

    if (typeof children === 'object' &&
        !(children instanceof DOMNodeCollection)) {
      children = $l(children);
    }

    if (typeof children === "string") {
      this.htmlArray.forEach(node => node.innerHTML += children);
    } else if (children instanceof DOMNodeCollection) {
      this.htmlArray.forEach(node => {
        children.htmlArray.forEach(childNode => {
          node.appendChild(childNode.cloneNode(true));
        });
      });
    }
  }

  attr(key, val) {
    if (typeof val === "string") {
      this.htmlArray.forEach ( (el) => el.setAttribute(key, val));
    } else {
      this.htmlArray[0].getAttribute(key);
    }
  }

  children() {
    let childrenArray = [];
    this.htmlArray.forEach( (el) => {
      childrenArray = childrenArray.concat(Array.from(el.children));
    });
    return new DOMNodeCollection(childrenArray);
  }

  empty() {
    this.html("");
  }

  find(selector) {
    const foundArray = [];
    this.htmlArray.forEach( (el) => {
      foundArray.concat(Array.from(el.querySelectorAll(selector)));
    });

    return new DOMNodeCollection(foundArray);
  }

  html(string){
    if (string !== undefined) {
      this.htmlArray.forEach( (el) => {
        el.innerHTML = string;
      });
    } else {
      return this.htmlArray[0].innerHTML;
    }
  }

  on(type, callback) {
    this.htmlArray.forEach( (el) => {
      el.addEventListener(type, callback);
      el[type] = callback;
    });
    return this;
  }

  off(type) {
    this.htmlArray.forEach( (el) => {
      if (el[type]) {
        el.removeEventListener(type, el[type]);
        el[type] = undefined;
      }
    });
    return this;
  }

  parent() {
    const parentNodes = [];

    this.htmlArray.forEach( el => {
      // debugger
      let parentNode = el.parentNode;
      if (parentNode.visited === undefined) {
        parentNodes.push(parentNode);
        parentNode.visited = true;
      }
    });

    parentNodes.forEach(node => {
      node.visited = false;
    });
    return new DOMNodeCollection(parentNodes);
  }

  remove() {
    this.htmlArray.forEach ( (el) => el.parentNode.removeChild(el) );
  }

  removeClass(className) {
    this.htmlArray.forEach( (el) => el.classList.remove(className));
  }

}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);