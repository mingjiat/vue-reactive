/* eslint-disable no-param-reassign */
function compile(node, vm) {
  // 元素节点
  if (node.nodeType === 1) {
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i += 1) {
      if (attrs[i].nodeName === 'v-model') {
        const name = attrs[i].nodeValue;
        node.value = vm.data[name];
        node.removeAttribute('v-model');
      }
    }
  }
  // 文本节点
  if (node.nodeType === 3) {
    const reg = /\{\{(.*)\}\}/;
    if (reg.test(node.nodeValue)) {
      const name = RegExp.$1.trim();
      node.nodeValue = vm.data[name];
    }
  }
}

function nodeToFragment(node, vm) {
  const fragment = document.createDocumentFragment();
  let child = node.firstChild;
  while (child) {
    compile(child, vm);
    // 劫持子节点
    fragment.appendChild(child);
    child = node.firstChild;
  }
  return fragment;
}

class Vue {
  constructor(options) {
    this.data = options.data;
    const id = options.el;
    const dom = nodeToFragment(document.getElementById(id), this);
    document.getElementById(id).appendChild(dom);
  }
}

// eslint-disable-next-line no-unused-vars
const vm = new Vue({
  el: 'app',
  data: {
    text: 'hello word',
  },
});
