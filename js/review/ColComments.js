sand.define('ColComments', [
  'Seed',
  'DOM/toDOM',
  'Library',
  'CommentsGroup'
], function(r) {

/*
**Fire: 1
**On:   0
*/
var ColComments = r.Seed.extend({

  tpl: {
    tag: ".col-comments"
  },

  options: function() {
    return {
      mainID: 0,
      dp: this.query('dp'),
      commentsList: [],
      tmpGroup: null,
      display: function() {console.log('Display is not set yet...')}
    }
  },

  '+init': function() {
    this.dp.comments.on('insert', this.appendCom.bind(this));
    this.dp.comments.on('remove', this.deleteCom.bind(this));
    this.dp.comments.on('insert edit remove', function() {setTimeout(function() { this.display(); }.bind(this), 0)}.bind(this));
  },

  suggestComment: function(data) {/*INTERFACE*/
    if (this.tmpGroup !== null) {
      data.x ? this.tmpGroup.main.x = data.x : null;
      data.y ? this.tmpGroup.main.y = data.y : null;
      data.data.points ? this.tmpGroup.setAreas(data.data.points, this.ctx) : null;
      this.display();
      return ;
    }
    this.tmpGroup = this.create(r.CommentsGroup, {
      mainID: this.mainID,
      parentID: 0,
      x: data.x || 0,
      y: data.y || 0,
      ctx: this.ctx,
      areas: data.data.points || null,
      onCreate: function() {
        console.log(this.tmpGroup.main.areas)
        this.tmpGroup.insertMain();
        this.tmpGroup = null;
      }.bind(this),
      onRemove: function() {
        this.tmpGroup.el.remove();
        this.tmpGroup = null;
      }.bind(this)
    });
    this.tmpGroup.el.style.zIndex = 50;
    this.tmpGroup.main.setAuthor('You');
    this.el.appendChild(this.tmpGroup.el);
    this.display();
  },

  appendCom: function(models, op) {
    if (models[0].parentID != 0 || models[0].mainID !== this.mainID) { return ; }
    var comAppend = this.create(r.CommentsGroup, {
      id: models[0].id,
      mainID: models[0].mainID,
      onRemove: function() { this.removeGroup(); }
    });

    comAppend.setMain(models[0], this.ctx);
    this.el.appendChild(comAppend.el);
    SyntaxHighlighter.highlight();
    this.commentsList.push(comAppend);
    this.drawAreas();
  },

  deleteCom: function(models, op) {
    if (models[0].parentID != 0 || models[0].mainID !== this.mainID) { return ; }
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      if (models[0].id == this.commentsList[i].id) {
        this.commentsList[i].el.remove();
        this.commentsList.splice(i, 1);
        return ;
      }
    }
  },


  setHeight: function(h) {
    this.el.style.height = h + 'px';
  },

  displayBubble : function() {
    if (this.tmpGroup !== null) {
      this.tmpGroup.el.style.left = this.tmpGroup.main.x + 'px';
    }
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].refreshDate();
      this.commentsList[i].el.style.top = this.commentsList[i].main.y + 'px';
      this.commentsList[i].el.style.left = this.commentsList[i].main.x + 'px';
      // this.commentsList[i].hide();
    }
  },

  displayColumn: function() {
    var prevDown;
    if (this.tmpGroup !== null) {
      this.tmpGroup.el.style.top = this.tmpGroup.main.y + 'px';
      this.tmpGroup.el.style.left = 0;
    }
    this.commentsList.sort(function (a, b) {
      return a.main.y - b.main.y;
    });

    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].refreshDate();
      this.commentsList[i].el.style.left = 0;
      this.commentsList[i].el.style.top = this.commentsList[i].main.y + 'px';
      if (i > 0 && (prevDown = r.Library.exceedSize(this.commentsList[i - 1].el, this.commentsList[i].el.style.top))) {
        this.commentsList[i].el.style.top = prevDown + 3 + 'px';
      }
      // this.commentsList[i].show();
    }
  },

  /*SIDE CANVAS*/
  drawAreas: function() {
    this.fire('clearCanvas');
    this.tmpGroup && this.tmpGroup.drawAreas();
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      this.commentsList[i].drawAreas();
    }
    // this.display();
  },

  /*SIDE CANVAS*/
  canTarget: function(e) {
    if (this.ctx.getImageData(e[0], e[1], 1, 1).data[3] === 0) { return 0;}

    /*CORE*/
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      var areas = this.commentsList[i].main.areas;
      for (var j = 0, lenj = areas.length; j < lenj; j++) {
        for (var k = 1, lenk = areas[j].points.length; k < lenk; k++) {

          var u = [(e[0] - areas[j].points[k][0]), (e[1] - areas[j].points[k][1])];
          var v = [(areas[j].points[k - 1][0] - areas[j].points[k][0]), (areas[j].points[k - 1][1] - areas[j].points[k][1])];
          var uNorm = Math.sqrt(u[0] * u[0] + u[1] * u[1]);
          var vNorm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
          var angle = Math.acos((u[0] * v[0] + u[1] * v[1]) / (uNorm * vNorm));
          var dotProdu = Math.cos(angle) * uNorm;
          var distPoint = Math.abs(Math.sin(angle) * uNorm);

          if (dotProdu >= 0 && dotProdu <= vNorm + 8 && distPoint <= 8) {
            if (this.el.className === 'col-comments tool-colcom') {
              this.commentsList[i].targetTool();
            } else {
              this.commentsList[i].focusCom(2);
            }
            return 1;
          }
        }
      }
    }
    /*!CORE*/
  },

  showCom: function() {
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      if (this.commentsList[i].el.style.display !== 'none') { continue ; }
      this.commentsList[i].show();
    }
  },

  collapseCom: function() {
    for (var i = 0, len = this.commentsList.length; i < len; i++) {
      if (r.Library.exceedSize(this.commentsList[i].el, this.el.offsetHeight)) {
        this.commentsList[i].hide();
      }
    }
  }

});
return ColComments;
});
