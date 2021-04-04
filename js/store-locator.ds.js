$(document).ready(function() {
  /**
   * @extends storeLocator.StaticDataFeed
   * @constructor
   */
  window.DataSource = function() {
    $.extend(this, new storeLocator.StaticDataFeed);

    // This is the main stores list injection point into the system
    var data = window.clubs;

    this.setStores(this.parse_(data));
  }

  /**
   * @const
   * @type {!storeLocator.FeatureSet}
   * @private
   */
  window.DataSource.prototype.FEATURES_  = new storeLocator.FeatureSet(
  );
  /**
   * @return {!storeLocator.FeatureSet}
   */
  window.DataSource.prototype.getFeatures = function() {
    return this.FEATURES_;
  };

  /**
   * @private
   * @param {string} csv
   * @return {!Array.<!storeLocator.Store>}
   */
  window.DataSource.prototype.parse_ = function(json) {
    var stores = [];

    for(var i in json) {
      props = json[i];

      // Turn email address into a link
      if(typeof props.email != 'undefined' && props.email.length > 7)
        props.email = '<a href="mailto:' + props.email + '">' + props.email + '</a>';

      var position = new google.maps.LatLng(props.coordinates.latitude, props.coordinates.longitude);
      var features = new storeLocator.FeatureSet();

      // Add disciplines as features for filtering
      for(var j in props.disciplines) {
        if(this.FEATURES_.getById(props.disciplines[j].name) == null) {
          this.FEATURES_.add(new storeLocator.Feature(
                                                       props.disciplines[j].name,
                                                       // For design purposes color bullet HTML is embeded in the feature value
                                                       '<span class="bullet" style="background:' + 
                                                       props.disciplines[j].colour + ';"></span>' + 
                                                       props.disciplines[j].name
                                                       )
                             );
        }
        features.add(this.FEATURES_.getById(props.disciplines[j].name));
      }

      var locale = this.join_([props.city, props.postcode], ', ');

      var store = new storeLocator.Store(i, position, features, {
        title: this.join_([props.name, props.institute], ', '),
        // For design purposes distance HTML is embeded in the address
        address: '<div class="distance"></div>' +
                 this.join_([props.street, locale , props.email], '<br/>')
      });
      stores.push(store);
    }

    return stores;
  };

  /**
   * Joins elements of an array that are non-empty and non-null.
   * @private
   * @param {!Array} arr array of elements to join.
   * @param {string} sep the separator.
   * @return {string}
   */
  window.DataSource.prototype.join_ = function(arr, sep) {
    var parts = [];
    for (var i = 0, ii = arr.length; i < ii; i++) {
      arr[i] && parts.push(arr[i]);
    }
    return parts.join(sep);
  };

  /**
   * Very rudimentary CSV parsing - we know how this particular CSV is formatted.
   * IMPORTANT: Don't use this for general CSV parsing!
   * @private
   * @param {string} row
   * @return {Array.<string>}
   */
  window.DataSource.prototype.parseRow_ = function(row) {
    // Strip leading quote.
    if (row.charAt(0) == '"') {
      row = row.substring(1);
    }
    // Strip trailing quote. There seems to be a character between the last quote
    // and the line ending, hence 2 instead of 1.
    if (row.charAt(row.length - 2) == '"') {
      row = row.substring(0, row.length - 2);
    }
    if (row.charAt(row.length - 1) == '"') {
      row = row.substring(0, row.length - 1);
    }

    row = row.split('","');

    return row;
  };

  /**
   * Creates an object mapping headings to row elements.
   * @private
   * @param {Array.<string>} headings
   * @param {Array.<string>} row
   * @return {Object}
   */
  window.DataSource.prototype.toObject_ = function(headings, row) {
    var result = {};
    for (var i = 0, ii = row.length; i < ii; i++) {
      result[headings[i]] = row[i];
    }
    return result;
  };
}); // window ready
