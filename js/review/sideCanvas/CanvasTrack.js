sand.define('CanvasTrack', [
  'Seed',
  'CanvasArea'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var CanvasTrack = r.Seed.extend({
  tpl: {
    tag: "canvas.file-canvas",
  },

  options: {
    form: "empty",
    onTarget: function(e) {console.log('Targeting is not available yet'); },
    drawAll: function(e) {console.log('draw all is not available yet'); }
  },

  '+init': function () {
    this.ctx = this.el.getContext("2d");
    this.el.addEventListener('mousedown', this.start.bind(this));
    this.el.addEventListener('mouseout', this.reset.bind(this));
  },

  /*Init/Clear*/
  setSize: function(h, w) {
    this.el.height = h;
    this.el.width = w;
    this.ctx.lineWidth = 16;
    this.ctx.strokeStyle = "rgba(200, 200, 200, 0.3)";
  },

  getCtx: function() {
    return (this.ctx);
  },

  clearCanvas: function() {
    this.setSize(this.el.height, this.el.width);
  },

  /*Start/Save & Valid selection*/
  start: function (e) {
    if (this.onTarget(this.getPosition(e))) { return ;}
    this.canvasArea = this.create(r.CanvasArea, {form: this.form, ctx: this.ctx});
    this.el.onmousemove = this.draw.bind(this);
    this.el.onmouseup = this.valid.bind(this);
  },

  draw: function(e) {
    this.drawAll();
    this.canvasArea.refresh(this.getPosition(e));
    this.canvasArea.draw();
  },

  getPosition: function(e) {
    var rect = this.el.getBoundingClientRect();
    return ([e.clientX - rect.left, e.clientY - rect.top])
  },

  valid: function(e) {
    this.el.onmousemove = null;
    this.el.onmouseup = null;
    var tmpPos = this.getPosition(e);
    this.fire('valid', {x: tmpPos[0], y: tmpPos[1], data: {points: this.canvasArea.points}});
    this.canvasArea = null;
  },

  /*When outmap*/
  reset: function() {
    this.el.removeEventListener('mousemove', this.mouseMoveHandler);
    this.el.removeEventListener('mouseup', this.mouseUpHandler);
  }

});
return CanvasTrack;
});
