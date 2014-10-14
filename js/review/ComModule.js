sand.define('ComModule', [
  'Seed',
  'DataPackage/Controller->DP',
  'DOM/toDOM',
  'Library',
  'ColComments',
  'CanvasTrack'
], function(r) {

var ComModule = r.Seed.extend({

  isMediator: true,
  respondsTo: { dp: function() {return this.dp;} },

  tpl: function() {
    return this.create(r.ColComments, {mainID: this.id}, 'colCom').el;
  },

  /*Data init: {attachEl: DOMelement, format: 'column' || 'bubble', canvas: 'on' || 'off', dp: CommonDP}*/
  options: function() {
    return {
      id: this.guid()(),
      attachEl: null,
      format: 'column',
      canvas: null,
      dp: new r.DP({
        data: {
          comments: []
        }
      })
    }
  },

  '+init': function() {
    this.attachEl ? this.attachComments(this.attachEl, this.canvas) : null;
  },

  /*Link comments to attachEl
  **Data attach: (DOMelement)
  */
  attachComments: function(attachEl, doCanvas) {
    if (!attachEl.tagName) {
      console.log('Comments error: attachComments/ attachEl is not a DOM element');
      return ;
    }
    this.attachEl = attachEl;

    this.colCom.setHeight(this.attachEl.clientHeight || this.attachEl.offsetHeight || this.attachEl.scrollHeight || this.attachEl.style.height || 0);
    this.setFormat();

    //MCB
    window.addEventListener('load', function() {setTimeout(this.resizeCol.bind(this), 0)}.bind(this));
    this.attachEl.addEventListener('resize', this.resizeCol.bind(this));
    // this.complete = new MutationObserver(this.resizeCol.bind(this));
    // this.complete.observe(this.attachEl, { childList: true });

    doCanvas == 'on' ? this.setCanvas(attachEl) : null;
  },

  resizeCol: function() {
    console.log(this.attachEl.clientHeight, this.attachEl.offsetHeight, this.attachEl.scrollHeight, this.attachEl.style.height)
    // this.complete.disconnect();
    this.colCom.setHeight(this.attachEl.clientHeight || this.attachEl.offsetHeight || this.attachEl.scrollHeight || this.attachEl.style.height || 0);
    this.canvasTrack ? this.canvasTrack.setSize(containEl.clientHeight, containEl.clientWidth) : null;
  },

  setCanvas: function(containEl) {
    this.canvas ? this.canvas.remove() : null;
    this.canvas = this.create(r.canvasTrack);
    this.canvasTrack.setSize(containEl.clientHeight, containEl.clientWidth);
    containEl.appendChild(this.canvas);
  },

  suggestComment: function(x, y, data) {
    this.colCom.suggestComment.bind(this.colCom)(x, y, data);
  },

  setFormat: function() {
    if (this.format === 'column') {
      this.colCom.display = this.colCom.displayColumn.bind(this.colCom);
    } else if (this.format == 'bubble') {
      this.colCom.display = this.colCom.displayBubble.bind(this.colCom);
    }
  },

  guid: function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    }
    return function() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    };
  }

});
return ComModule;
});
