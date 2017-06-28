/**
 * little things to make the page special
 *
 * @author Peter J. Martinson
 * @copyright 2017
*/

window.onload = (function() {
  'use strict';

  var hsl = 'hsl(' + Math.round(Math.random() * 360) + ',50%,50%)',
      a = document.getElementsByTagName('a'),
      style = document.createElement('style'),
      css =  'a:hover { box-shadow: 0px 0px 3px 3px ' + hsl + '; background: ' + hsl + '; color: black;}';

  if (style.styleSheet) {
      style.styleSheet.cssText = css;
  } else {
      style.appendChild(document.createTextNode(css));
  }

  for ( var i = 0; i < a.length; i++) {
    a[i].appendChild(style);
  }

}());
