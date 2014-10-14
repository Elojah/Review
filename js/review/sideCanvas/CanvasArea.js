sand.define('CanvasArea', [
  'Seed'
], function(r) {

/*
**Fire: 0
**On:   0
*/
var CanvasArea = r.Seed.extend({

  options: function() {
    return {
      points: [],
      form: "empty",
      ctx: null
    }
  },

  refresh: function(pos) {
    this.points.push(pos);
  },

  draw: function () {
    if (!this.points[0]) { return ; }
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0][0], this.points[0][1]);
    for (var i = 1, len = this.points.length; i < len; i++) {
      this.ctx.lineTo(this.points[i][0], this.points[i][1]);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  },

  getArea: function() {
    return (this.points);
  }

});
return CanvasArea;
});
