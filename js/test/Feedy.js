sand.define('Test', [
  'Seed',
  'DOM/toDOM',
  'ComModule'
], function(r) {

/*
**Fire: 0
**On:   5
*/
var appComments = r.Seed.extend({

  tpl: {
    tag: '.test-box'
  },

  options: function() {
    return {
      data: null
    }
  },

  '+init': function() {

    this.el.appendChild(this.create(r.toDOM, {tag: '.t0', innerHTML: 'Just some Text'}, 't0'));
    this.comm = this.create(r.ComModule, {attachEl: this.t0});
    this.el.appendChild(this.comm.el);
    this.t0.onclick = this.comm.suggestComment.bind(this.comm);

    window.addEventListener('load', function() {
      document.body.appendChild(this.el);
    }.bind(this));
  }

});
return appComments;
});

//LAUNCHER
sand.require('Test', function(r) {

  //Start comments app
  var app = new r.Test();
});
