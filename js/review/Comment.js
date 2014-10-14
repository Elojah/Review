sand.define('Comment', [
  'Seed',
  'CanvasArea',
  'prettyDate'
], function(r) {

var Comment = r.Seed.extend({

  tpl: function() {
    return {
      tag: "table.comment.usual",
      attr: { cellpadding: 0, cellspacing: 0},
      children: [
      ['tr', [
        { tag: 'td.comment-name', attr: {rowspan: 2, width: '100%'}, as: 'elName', innerHTML: this.author},
        ['td.comment-right', [
          { tag:".comment-txt", as: 'elDiv' },
        ]]
      ]],
      ['tr', [
        { tag: "td.comment-info.comment-right", as: 'infoCom', children: [
          { tag:".comment-button.button", as: 'createEl', innerHTML: 'Create', events: {
            click: function(){ this.valid(); this.onCreate(); }.bind(this)
          }},
          { tag:".comment-button.button", as: 'removeEl', innerHTML: 'Delete', events: {
            click: function(){ this.onRemove(this.id); }.bind(this)
          }},
          { tag:".comment-button.button", as: 'editEl', innerHTML: 'Edit', events: {
            click: function(){
              if (this.elDiv.isContentEditable) { this.valid(); this.edit();}
              else { this.elDiv.setAttribute('contenteditable', true); this.preValid(); this.switchEdit(); }
            }.bind(this)
          }},
          { tag:".comment-button.button", as: 'replyEl', innerHTML: 'Reply', events: {
            click: this.onReply.bind(this)
          }},
          { tag: '.comment-date', as: 'timeDiv'}
        ]}
      ]]
    ]}
  },

  options: function() {
    return {
      id: 0,
      mainID: 0,
      parentID: 0,
      txt: '',
      onCreate: function() { console.log('create is not available on this element'); },
      onRemove: function() { console.log('remove is not available on this element'); },
      onReply: function() { console.log('reply is not available on this element'); },
      y: 0,
      x: 0,
      areas: [],
      author: 'unnamed',
      color: '#aa66aa',
      date: new Date().getTime()
    }
  },

  '+init': function () {

    this.infoCom.innerHTML = '';
    this.refreshDate();
    this.infoCom.appendChild(this.createEl);
    this.infoCom.appendChild(document.createTextNode(' - '))
    this.infoCom.appendChild(this.removeEl);
    this.infoCom.appendChild(this.timeDiv);
    this.elDiv.setAttribute('contenteditable', true);
  },

  valid: function(newDate) {

    this.txt = this.elDiv.innerHTML;
    this.elDiv.setAttribute('contenteditable', false);
    this.switchEdit();
    this.date = newDate || new Date().getTime();

    /*just some text ...'''code here"""some other text...*/
    this.elDiv.innerHTML = this.txt.replace(/\'\'\'/g, '<pre class = "brush: js">').replace(/\"\"\"/g, '</pre>')
              .replace(/<div>/g, '').replace(/<\/div>/g, '\n').replace(/<br>/g, '\n');
    for (var i = 0, len = this.elDiv.childNodes.length; i < len; i++) {
      if (this.elDiv.childNodes[i].tagName != "PRE") {
        this.elDiv.childNodes[i] = this.elDiv.childNodes[i].toString().replace(/\ /g, "&nbsp").replace(/\n/g, "<br/>");
      }
    }
    SyntaxHighlighter.highlight();
  },

  preValid: function() {
    this.elDiv.innerHTML = this.txt;
  },

  edit: function() {
    this.query('dp').comments.one(function(e) { return this.id === e.id }.bind(this)).edit({'txt': this.txt, date: this.date});
  },

  setAtt: function(data) {
    this.author = data.author;
    this.elName.innerHTML = data.author;
    this.color = data.color;
    this.txt = data.txt;
    this.date = data.date;
    this.y = data.y;
    this.x = data.x;
    this.preValid();
    this.valid(data.date);
  },

  switchEdit: function() {
    this.infoCom.innerHTML = '';
    if (this.elDiv.isContentEditable) {
      this.infoCom.appendChild(this.editEl);
    } else {
      this.infoCom.appendChild(this.removeEl);
      this.infoCom.appendChild(document.createTextNode(' - '))
      this.infoCom.appendChild(this.editEl);
      if (this.replyEl) {
        this.infoCom.appendChild(document.createTextNode(' - '))
        this.infoCom.appendChild(this.replyEl);
      }
    }
    this.infoCom.appendChild(this.timeDiv);
  },

  setAuthor: function(author) {
    this.author = author;
    this.elName.innerHTML = this.author;
  },

  refreshDate: function() {
    this.timeDiv.innerHTML = r.prettyDate(this.date);
  },

  getData: function() {
    return { id: this.id, parentID: this.parentID, mainID: this.mainID, txt: this.txt,
      author: this.author, y: this.y, x: this.x,
      color: this.color, areas: this.getAreas(), date: this.date};
  },

  getAreas: function() {
    if (!this.areas) { return ;}
    var tmpAreas = [];
    for (var i = 0, len = this.areas.length; i < len; i++) {
      tmpAreas.push(this.areas[i].getArea());
    }
    return tmpAreas;
  }

});
return Comment;
});
