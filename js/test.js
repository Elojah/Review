sand.define('Test', [
  'Seed',
  'DOM/toDOM',
  'ComModule',
  'CanvasTrack'
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

    this.comm = this.create(r.ComModule, {attachEl: this.t0, canvas: 'on'});
    this.el.appendChild(this.comm.el);

    this.el.appendChild(this.create(r.toDOM, {tag: '.t0', innerHTML: 'Just some Text'}, 't1'));

    this.comm1 = this.create(r.ComModule, {attachEl: this.t1, canvas: 'on'});
    this.el.appendChild(this.comm1.el);


    // this.buttswitch = this.create(r.toDOM, {tag: 'button', innerHTML: 'Switch bubble',events: {
    //   click: function() {this.comm.setDisplay('bubble');}.bind(this)
    // }});
    // this.el.appendChild(this.buttswitch);
    // this.buttswitch = this.create(r.toDOM, {tag: 'button', innerHTML: 'Switch column',events: {
    //   click: function() {this.comm.setDisplay('column');}.bind(this)
    // }});
    // this.el.appendChild(this.buttswitch);

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
