function Store() {
  this.data = {};
}

Store.prototype = {
  set: function(k, v) {
    this.data[k] = v;
  },

  get: function(k) {
    return this.data[k]
  }
}

module.exports = Store;