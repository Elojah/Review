sand.define('Library', [
  'DOM/toDOM'
], function(r) {

  var Library = {

    getCookie: function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
          if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
      }
      return "";
    },

    exceedSize: function(element, motherAtt) {
      var res;
      if ((res = (parseInt(element.style.top) + element.offsetHeight)) > parseInt(motherAtt)) {
        return res;
      }
      return false;
    },

    eventOut: function(eventName, el, callback, n) {
      (function () {
        var i = n || 1;
        var rc = function(e) {
          if (!Library.recursiveParent(e.target, el)) {
            i--;
            if (i !== 0) { return ; }
            document.body.removeEventListener(eventName, rc);
            callback(e);
          }
        }
        document.body.addEventListener(eventName, rc);
      })();
    },

    recursiveParent: function(el, cmp) {
      if (el === cmp) { return true; }
      if (el === document.body || !el || !el.parentNode) { return false; }
      return (this.recursiveParent(el.parentNode, cmp));
    }

  }
return (Library);
})
