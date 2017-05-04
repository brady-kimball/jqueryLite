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
