$(document).ready(function() {

  // Extend jQuery to support waiting for elements to load before taking action
  $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) {
    var found = 'found';
    var $this = $(this.selector);
    var $elements = $this.not(function () { return $(this).data(found); }).each(handler).data(found, true);

    if (!isChild) {
      (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] =
        window.setInterval(function () { $this.waitUntilExists(handler, shouldRunHandlerOnce, true); }, 500);
    }
    else if (shouldRunHandlerOnce && $elements.length) {
      window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
    }

    return $this;
  }

  // Once store locator has loaded
  $('.storelocator-filter').waitUntilExists(function() {

    // Move direction panel to the top
    $('.directions-panel').prependTo('#panel');

    // Move filter panel to the top and fade in // This puts it on top of the directions panel
    $('.storelocator-filter').prependTo('#panel').fadeIn();

    // Fade in stor elist under the map
    $('.store-list').fadeIn();
  });

});
