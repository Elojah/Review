sand.define('CommentsGroup', [
  'Seed',
  'DOM/toDOM',
  'Library',
  'Comment',
  'CanvasArea'
], function(r) {

var CommentsGroup = r.Seed.extend({

  tpl: function() {
    return {
      tag: '.group-comment', children: [
        {tag: '.wrap-comments.usual', as: 'wrap', children: [
          this.create(r.Comment, {
            id: this.id,
            mainID: this.mainID,
            color: this.color,
            onCreate: this.onCreate.bind(this),
            onRemove: this.onRemove.bind(this),
            onReply: this.addReply.bind(this)
          }, 'main').el
        ]}
      ], events: {
        mouseover: this.highStyle.bind(this),
        mouseout: this.usualStyle.bind(this),
        click: this.targetColumn.bind(this)
      }
    }
  },

  options: function() {
    return {
      id: 0,
      mainID: 0,
      tmpReply: null,
      y: 0,
      replies: [],
      collapseEl: null,
      //HARDCODE
      colorTab: ['#fffbbe', '#ffbfbf', '#bfffc4'],
      color: Math.floor(Math.random()*3),
      onCreate: function() {console.log('create is not available on this element')},
      onRemove: function() {console.log('remove not available on this element');}
    }
  },

  '+init': function() {

    /*Set com color*/
    this.main.color = this.color;
    this.wrap.style['border-color'] = this.colorTab[this.main.color];

    /*Set events*/
    this.query('dp').comments.on('insert', this.setReply.bind(this));
    this.query('dp').comments.on('edit', this.editCom.bind(this));
    this.query('dp').comments.on('remove', this.removeReply.bind(this));
  },

  insertMain: function() {
    this.el.remove();
    this.main.author = r.Library.getCookie('name');
    this.query('dp').comments.insert(this.main.getData());
  },

  editCom: function(models, changes) {
      if (models[0].parentID == this.main.id) {
        for (var i = 0, len = this.replies.length; i < len; i++) {
          if (models[0].id === this.replies[i].id) {
            for (var att in changes) {
              this.replies[i][att] = changes[att];
            }
            this.replies[i].preValid();
            this.replies[i].valid();
          }
        }
      } else if (models[0].id == this.main.id) {
        for (var att in changes) {
          this.main[att] = changes[att];
        }
        this.main.preValid();
        this.main.valid();
      }
  },

  drawAreas: function() {
    for (var i = 0, len = this.main.areas.length; i < len; i++) {
      this.main.areas[i].draw();
    }
  },

  highStyle: function() {
    this.el.style.zIndex = '10';
    this.fire('redraw');
    this.main.areas[0] && ((this.main.areas[0].ctx.strokeStyle =  this.colorTab[this.main.color]) && (this.main.areas[0].ctx.globalAlpha = 0.3));
    this.drawAreas();
    //HARDCODE
    this.main.areas[0] && (this.main.areas[0].ctx.strokeStyle = "rgba(200, 200, 200, 0.3)");
  },

  usualStyle: function() {
    this.el.style.zIndex = '0';
    this.fire('redraw');
  },

  targetColumn: function(e) {
    if (e.target === this.wrap) {
      this.color = (this.color == this.colorTab.length - 1) ? 0 : this.color + 1;
      this.main.color = this.color;
      this.wrap.style['border-color'] = this.colorTab[this.color];
      var tmp = this.query('dp').comments.one(function(e) {return e.id === this.main.id}.bind(this));
      if (tmp !== null) {tmp.edit({color: this.color});}
    }
    this.focusCom();
  },

  targetBubble: function(e) {
    this.show();
    r.Library.eventOut('click', this.el, function(){ this.hide(); }.bind(this), 2);
  },

  focusCom: function(n) {
    if (this.el.style.marginLeft === '-12px') { return ; }
    this.el.style.marginLeft = '-12px';
    this.highStyle();

    var callback = function() {
      this.el.style.marginLeft = '0px';
      this.usualStyle();
    }.bind(this);

    r.Library.eventOut('click', this.el, callback, n);
  },

  setMain: function(data, ctx) {

/*
    var current_area;
    for (var i = 0, len = data.areas.length; i < len; i++) {
      current_area = this.create(r.CanvasArea, {form: 'points', points: data.areas[i], ctx: ctx});
      this.main.areas.push(current_area);
    }
*/

    this.main.setAtt(data);
    this.wrap.style['border-color'] = this.colorTab[this.main.color];
    this.query('dp').comments.where(function(e) { return e.parentID === this.id;
    }.bind(this)).each(function(c) { this.setReply([c]); }.bind(this));
    SyntaxHighlighter.highlight();
  },

  removeGroup: function() {
    this.query('dp').comments.where(function(e){ return this.main.id == e.parentID }.bind(this))
                                            .each(function(com){ com.remove(); }.bind(this));

    this.query('dp').comments.one(function(e){ return this.main.id == e.id }.bind(this)).remove();
  },

  addReply: function(data) {/*INTERFACE*/
    if (this.tmpReply !== null) {return ;}
    this.tmpReply = this.create(r.Comment, {
      mainID: this.mainID,
      parentID: this.id,
      author: r.Library.getCookie('name'),
      onCreate: function() {
        this.tmpReply.el.remove();
        delete this.tmpReply.id;
        this.query('dp').comments.insert(this.tmpReply.getData());
        this.tmpReply = null;
      }.bind(this)
    });
    this.wrap.appendChild(this.tmpReply.el);
  },

  removeReply: function(models, op) {
    if (models[0].parentID !== this.main.id) { return ;}
    for (var i = 0, len = this.replies.length; i < len; i++) {
      if (models[0].id == this.replies[i].id) {
        this.replies[i].el.remove();
        this.replies.splice(i, 1);

        if (this.replies.length < 3 && this.collapseEl !== null) {
          for (var i = 0, len = this.replies.length; i < len; i++) {
            this.replies[i].show();
          }
          this.collapseEl.remove();
          this.collapseEl = null;
        }

        return ;
      }
    }
  },

  collapseCom: function() {
    if (this.collapseEl !== null) { return ;}
    this.wrap.appendChild(this.create(r.toDOM, {
      tag: '.collapse-com', innerHTML: 'Hide', events: {
        click: function() {
          if (this.replies[this.replies.length - 1].el.style.display === 'none') {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].show();
              this.collapseEl.innerHTML = 'Hide';
            }
          } else {
            for (var i = 0, len = this.replies.length; i < len; i++) {
              this.replies[i].hide();
              this.collapseEl.innerHTML = 'Show';
            }
          }
        }.bind(this)
      }
    }, 'collapseEl'));
  },

  refreshDate: function(now) {
    this.main.refreshDate(now);
    for (var i = 0, len = this.replies.length; i < len; i++) {
      this.replies[i].refreshDate(now);
    }
  },

  setReply: function(model, options) {
    if (model[0].parentID !== this.id) { return ; }
    this.tmpReply = this.create(r.Comment, {
      id: model[0].id,
      mainID: model[0].mainID,
      parentID: model[0].parentID,
      author: model[0].author,
      txt: model[0].txt,
      onRemove: function() {this.query('dp').comments.one(function(e) {return e.id === model[0].id}.bind(this)).remove()}.bind(this),
      onReply: this.addReply.bind(this)
    });
    this.tmpReply.el.style.marginLeft = '24px';
    this.wrap.appendChild(this.tmpReply.el);
    this.tmpReply.preValid();
    this.tmpReply.valid(model[0].date);
    this.replies.push(this.tmpReply);
    if (this.replies.length > 2) {
      this.collapseCom();
    }
    this.tmpReply = null;
    /*Resize collapse*/
    if (this.collapseEl != null) {
      this.collapseEl.remove();
      this.collapseEl = null;
      this.collapseCom();
    }
  }

});
return CommentsGroup;
});
