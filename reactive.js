/* eslint-disable no-new */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-param-reassign */
class Dep {
  constructor() {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach(sub => {
      sub.update();
    });
  }
}

class Watcher {
  constructor(vm, node, name, nodeType) {
    Dep.target = this;
    this.vm = vm;
    this.node = node;
    this.name = name;
    this.nodeType = nodeType;
    // 创建订阅者实例的时候调用一次update方法，以便将订阅了同一数据的订阅者们记录在一个Dep实例里
    this.update();
    // 防止重复记录订阅者
    Dep.target = null;
  }

  get() {
    this.value = this.vm[this.name];
  }

  update() {
    this.get();
    if (this.nodeType === 'input') {
      this.node.value = this.value;
    }
    if (this.nodeType === 'text') {
      this.node.nodeValue = this.value;
    }
  }
}

function defineReactive(obj, key, val) {
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      if (Dep.target) {
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (val === newVal) {
        return;
      }
      val = newVal;
      // 通知订阅者们进行更新
      dep.notify();
    },
  });
}

function observe(obj, vm) {
  Object.keys(obj).forEach(key => {
    defineReactive(vm, key, obj[key]);
  });
}

function compile(node, vm) {
  // 元素节点
  if (node.nodeType === 1) {
    const attrs = node.attributes;
    for (let i = 0; i < attrs.length; i += 1) {
      if (attrs[i].nodeName === 'v-model') {
        const name = attrs[i].nodeValue;
        node.addEventListener('input', e => {
          // 触发访问器属性的set方法
          vm[name] = e.target.value;
        });
        node.removeAttribute('v-model');
        new Watcher(vm, node, name, 'input');
      }
    }
  }
  // 文本节点
  if (node.nodeType === 3) {
    const reg = /\{\{(.*)\}\}/;
    if (reg.test(node.nodeValue)) {
      const name = RegExp.$1.trim();
      new Watcher(vm, node, name, 'text');
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
    // 监听数据
    observe(this.data, this);
    const id = options.el;
    // 编译html
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
