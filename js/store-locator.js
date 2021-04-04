(function($) {
'use strict';

// Copyright 2012 Google Inc.

/**
 * @name Store Locator for Google Maps API V3
 * @version 0.1
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * This library makes it easy to create a fully-featured Store Locator for
 * your business's website.
 */

/**
 * @license
 *
 * Copyright 2012 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Namespace for Store Locator.
 * @constructor
 */
var storeLocator = function() {};
window['storeLocator'] = storeLocator;

/**
 * Convert from degrees to radians.
 * @private
 * @param {number} degrees the number in degrees.
 * @return {number} the number in radians.
 */
storeLocator.toRad_ = function(degrees) {
  return degrees * Math.PI / 180;
};

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * Feature model class for Store Locator library.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Representation of a feature of a store. (e.g. 24 hours, BYO, etc).
 * @example <pre>
 * var feature = new storeLocator.Feature('24hour', 'Open 24 Hours');
 * </pre>
 * @param {string} id unique identifier for this feature.
 * @param {string} name display name of this feature.
 * @constructor
 * @implements storeLocator_Feature
 */
storeLocator.Feature = function(id, name) {
  this.id_ = id;
  this.name_ = name;
};
storeLocator['Feature'] = storeLocator.Feature;

/**
 * Gets this Feature's ID.
 * @return {string} this feature's ID.
 */
storeLocator.Feature.prototype.getId = function() {
  return this.id_;
};

/**
 * Gets this Feature's display name.
 * @return {string} this feature's display name.
 */
storeLocator.Feature.prototype.getDisplayName = function() {
  return this.name_;
};

storeLocator.Feature.prototype.toString = function() {
  return this.getDisplayName();
};

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * FeatureSet class for Store Locator library. A mutable, ordered set of
 * storeLocator.Features.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A mutable, ordered set of <code>storeLocator.Feature</code>s.
 * @example <pre>
 * var feature1 = new storeLocator.Feature('1', 'Feature One');
 * var feature2 = new storeLocator.Feature('2', 'Feature Two');
 * var feature3 = new storeLocator.Feature('3', 'Feature Three');
 *
 * var featureSet = new storeLocator.FeatureSet(feature1, feature2, feature3);
 * </pre>
 * @param {...storeLocator.Feature} var_args the initial features to add to
 * the set.
 * @constructor
 * @implements storeLocator_FeatureSet
 */
storeLocator.FeatureSet = function(var_args) {
  /**
   * Stores references to the actual Feature.
   * @private
   * @type {!Array.<storeLocator.Feature>}
   */
  this.array_ = [];

  /**
   * Maps from a Feature's id to its array index.
   * @private
   * @type {Object.<string, number>}
   */
  this.hash_ = {};

  for (var i = 0, feature; feature = arguments[i]; i++) {
    this.add(feature);
  }
};
storeLocator['FeatureSet'] = storeLocator.FeatureSet;

/**
 * Adds the given feature to the set, if it doesn't exist in the set already.
 * Else, removes the feature from the set.
 * @param {!storeLocator.Feature} feature the feature to toggle.
 */
storeLocator.FeatureSet.prototype.toggle = function(feature) {
  if (this.contains(feature)) {
    this.remove(feature);
  } else {
    this.add(feature);
  }
};

/**
 * Check if a feature exists within this set.
 * @param {!storeLocator.Feature} feature the feature.
 * @return {boolean} true if the set contains the given feature.
 */
storeLocator.FeatureSet.prototype.contains = function(feature) {
  return feature.getId() in this.hash_;
};

/**
 * Gets a Feature object from the set, by the feature id.
 * @param {string} featureId the feature's id.
 * @return {storeLocator.Feature} the feature, if the set contains it.
 */
storeLocator.FeatureSet.prototype.getById = function(featureId) {
  if (featureId in this.hash_) {
    return this.array_[this.hash_[featureId]];
  }
  return null;
};

/**
 * Adds a feature to the set.
 * @param {storeLocator.Feature} feature the feature to add.
 */
storeLocator.FeatureSet.prototype.add = function(feature) {
  if (!feature) {
    return;
  }
  this.array_.push(feature);
  this.hash_[feature.getId()] = this.array_.length - 1;
};

/**
 * Removes a feature from the set, if it already exists in the set. If it does
 * not already exist in the set, this function is a no op.
 * @param {!storeLocator.Feature} feature the feature to remove.
 */
storeLocator.FeatureSet.prototype.remove = function(feature) {
  if (!this.contains(feature)) {
    return;
  }
  this.array_[this.hash_[feature.getId()]] = null;
  delete this.hash_[feature.getId()];
};

/**
 * Get the contents of this set as an Array.
 * @return {Array.<!storeLocator.Feature>} the features in the set, in the order
 * they were inserted.
 */
storeLocator.FeatureSet.prototype.asList = function() {
  var filtered = [];
  for (var i = 0, ii = this.array_.length; i < ii; i++) {
    var elem = this.array_[i];
    if (elem !== null) {
      filtered.push(elem);
    }
  }
  return filtered;
};

/**
 * Empty feature set.
 * @type storeLocator.FeatureSet
 * @const
 */
storeLocator.FeatureSet.NONE = new storeLocator.FeatureSet;

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * An info panel, which complements the map view of the Store Locator.
 * Provides a list of stores, location search, feature filter, and directions.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An info panel, to complement the map view.
 * Provides a list of stores, location search, feature filter, and directions.
 * @example <pre>
 * var container = document.getElementById('panel');
 * var panel = new storeLocator.Panel(container, {
 *   view: view,
 *   locationSearchLabel: 'Location:'
 * });
 * google.maps.event.addListener(panel, 'geocode', function(result) {
 *   geocodeMarker.setPosition(result.geometry.location);
 * });
 * </pre>
 * @extends {google.maps.MVCObject}
 * @param {!Node} el the element to contain this panel.
 * @param {storeLocator.PanelOptions} opt_options
 * @constructor
 * @implements storeLocator_Panel
 */
storeLocator.Panel = function(el, opt_options) {
  this.el_ = $(el);
  this.el_.addClass('storelocator-panel');
  this.settings_ = $.extend({
      'locationSearch': true,
      'locationSearchLabel': 'Where are you?',
      'featureFilter': true,
      'directions': true,
      'view': null
    }, opt_options);

  this.directionsRenderer_ = new google.maps.DirectionsRenderer({
    draggable: false,
    suppressMarkers: true
  });
  this.directionsService_ = new google.maps.DirectionsService;

  this.init_();
};
storeLocator['Panel'] = storeLocator.Panel;

storeLocator.Panel.prototype = new google.maps.MVCObject;

/**
 * Initialise the info panel
 * @private
 */
storeLocator.Panel.prototype.init_ = function() {
  var that = this;
  this.itemCache_ = {};

  if (this.settings_['view']) {
    this.set('view', this.settings_['view']);
  }

  this.filter_ = $('<form class="storelocator-filter"/>');
  this.el_.append(this.filter_);

  if (this.settings_['locationSearch']) {
    this.locationSearch_ = $('<div class="location-search"><h3>' +
        this.settings_['locationSearchLabel'] + '</h3><input></div>');
    this.filter_.append(this.locationSearch_);

    if (typeof google.maps.places != 'undefined') {
      this.initAutocomplete_();
    } else {
      this.filter_.submit(function() {
        var search = $('input', that.locationSearch_).val();
        that.searchPosition(/** @type {string} */(search));
      });
    }
    this.filter_.submit(function() {
      return false;
    });

    google.maps.event.addListener(this, 'geocode', function(place) {
      if (!place.geometry) {
        that.searchPosition(place.name);
        return;
      }

      this.directionsFrom_ = place.geometry.location;

      if (that.directionsVisible_) {
        that.renderDirections_();
      }
      var sl = that.get('view');
      sl.highlight(null);
      var map = sl.getMap();
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(13);
      }
      sl.refreshView();
      that.listenForStoresUpdate_();
    });
  }

  if (this.settings_['featureFilter']) {
    // TODO(cbro): update this on view_changed
    this.featureFilter_ = $('<div class="feature-filter"/>');
    var allFeatures = this.get('view').getFeatures().asList();
    for (var i = 0, ii = allFeatures.length; i < ii; i++) {
      var feature = allFeatures[i];
      var checkbox = $('<input type="checkbox"/>');
      checkbox.data('feature', feature);
      $('<label/>').append(checkbox).append(feature.getDisplayName())
        .appendTo(this.featureFilter_);
    }
    this.filter_.append(this.featureFilter_);
    this.featureFilter_.find('input').change(function() {
      var feature = $(this).data('feature');
      that.toggleFeatureFilter_(/** @type {storeLocator.Feature} */(feature));
      that.get('view').refreshView();
    });
  }

  this.storeList_ = $('<ul class="store-list"/>');
  this.el_.append(this.storeList_);

  if (this.settings_['directions']) {
    this.directionsPanel_ = $('<div class="directions-panel"><form>' +
        '<input class="directions-to"/>' +
        '<input type="submit" value="Find directions"/>' +
        '<a href="#" class="close-directions">Close</a>' +
        '</form><div class="rendered-directions"></div></div>');
    this.directionsPanel_.find('.directions-to').attr('readonly', 'readonly');
    this.directionsPanel_.hide();
    this.directionsVisible_ = false;
    this.directionsPanel_.find('form').submit(function() {
      that.renderDirections_();
      return false;
    });
    this.directionsPanel_.find('.close-directions').click(function() {
      that.hideDirections();
    });
    this.el_.append(this.directionsPanel_);
  }
};

/**
 * Toggles a particular feature on/off in the feature filter.
 * @param {storeLocator.Feature} feature The feature to toggle.
 * @private
 */
storeLocator.Panel.prototype.toggleFeatureFilter_ = function(feature) {
  var featureFilter = this.get('featureFilter');
  featureFilter.toggle(feature);
  this.set('featureFilter', featureFilter);
};

/**
 * Global Geocoder instance, for convenience.
 * @type {google.maps.Geocoder}
 * @private
 */
storeLocator.geocoder_ = new google.maps.Geocoder;

/**
 * Triggers an update for the store list in the Panel. Will wait for stores
 * to load asynchronously from the data source.
 * @private
 */
storeLocator.Panel.prototype.listenForStoresUpdate_ = function() {
  var that = this;
  var view = /** @type storeLocator.View */(this.get('view'));
  if (this.storesChangedListener_) {
    google.maps.event.removeListener(this.storesChangedListener_);
  }
  this.storesChangedListener_ = google.maps.event.addListenerOnce(view,
      'stores_changed', function() {
        that.set('stores', view.get('stores'));
      });
};
/**
 * Search and pan to the specified address.
 * @param {string} searchText the address to pan to.
 */
storeLocator.Panel.prototype.searchPosition = function(searchText) {
  var that = this;
  var request = {
    address: searchText,
    bounds: this.get('view').getMap().getBounds()
  };
  storeLocator.geocoder_.geocode(request, function(result, status) {
    if (status != google.maps.GeocoderStatus.OK) {
      //TODO(cbro): proper error handling
      return;
    }
    google.maps.event.trigger(that, 'geocode', result[0]);
  });
};

/**
 * Sets the associated View.
 * @param {storeLocator.View} view the view to set.
 */
storeLocator.Panel.prototype.setView = function(view) {
  this.set('view', view);
};

/**
 * view_changed handler.
 * Sets up additional bindings between the info panel and the map view.
 */
storeLocator.Panel.prototype.view_changed = function() {
  var sl = /** @type {google.maps.MVCObject} */ (this.get('view'));
  this.bindTo('selectedStore', sl);

  var that = this;
  if (this.geolocationListener_) {
    google.maps.event.removeListener(this.geolocationListener_);
  }
  if (this.zoomListener_) {
    google.maps.event.removeListener(this.zoomListener_);
  }
  if (this.idleListener_) {
    google.maps.event.removeListener(this.idleListener_);
  }

  var center = sl.getMap().getCenter();

  var updateList = function() {
    sl.clearMarkers();
    that.listenForStoresUpdate_();
  };

  //TODO(cbro): somehow get the geolocated position and populate the 'from' box.
  this.geolocationListener_ = google.maps.event.addListener(sl, 'load',
      updateList);

  this.zoomListener_ = google.maps.event.addListener(sl.getMap(),
      'zoom_changed', updateList);

  this.idleListener_ = google.maps.event.addListener(sl.getMap(),
      'idle', function() {
        return that.idle_(sl.getMap());
      });

  updateList();
  this.bindTo('featureFilter', sl);

  if (this.autoComplete_) {
    this.autoComplete_.bindTo('bounds', sl.getMap());
  }
};

/**
 * Adds autocomplete to the input box.
 * @private
 */
storeLocator.Panel.prototype.initAutocomplete_ = function() {
  var that = this;
  var input = $('input', this.locationSearch_)[0];
  this.autoComplete_ = new google.maps.places.Autocomplete(input);
  if (this.get('view')) {
    this.autoComplete_.bindTo('bounds', this.get('view').getMap());
  }
  google.maps.event.addListener(this.autoComplete_, 'place_changed',
      function() {
        google.maps.event.trigger(that, 'geocode', this.getPlace());
      });
};

/**
 * Called on the view's map idle event. Refreshes the store list if the
 * user has navigated far away enough.
 * @param {google.maps.Map} map the current view's map.
 * @private
 */
storeLocator.Panel.prototype.idle_ = function(map) {
  if (!this.center_) {
    this.center_ = map.getCenter();
  } else if (!map.getBounds().contains(this.center_)) {
    this.center_ = map.getCenter();
    this.listenForStoresUpdate_();
  }
};

/**
 * @const
 * @type {string}
 * @private
 */
storeLocator.Panel.NO_STORES_HTML_ = '<li class="no-stores">There are no' +
    ' places in this area.</li>';

/**
 * @const
 * @type {string}
 * @private
 */
storeLocator.Panel.NO_STORES_IN_VIEW_HTML_ = '<li class="no-stores">There are' +
    ' no places in this area. However, places closest to you are' +
    ' listed below.</li>';
/**
 * Handler for stores_changed. Updates the list of stores.
 * @this storeLocator.Panel
 */
storeLocator.Panel.prototype.stores_changed = function() {
  if (!this.get('stores')) {
    return;
  }

  var view = this.get('view');
  var bounds = view && view.getMap().getBounds();

  var that = this;
  var stores = this.get('stores');
  var selectedStore = this.get('selectedStore');
  this.storeList_.empty();

  if (!stores.length) {
    this.storeList_.append(storeLocator.Panel.NO_STORES_HTML_);
  } else if (bounds && !bounds.contains(stores[0].getLocation())) {
    this.storeList_.append(storeLocator.Panel.NO_STORES_IN_VIEW_HTML_);
  }

  var clickHandler = function() {
    view.highlight(this['store'], true);
  };

  // TODO(cbro): change 10 to a setting/option
  for (var i = 0, ii = Math.min(10, stores.length); i < ii; i++) {
    var storeLi = stores[i].getInfoPanelItem();
    storeLi['store'] = stores[i];
    if (selectedStore && stores[i].getId() == selectedStore.getId()) {
      $(storeLi).addClass('highlighted');
    }

    if (!storeLi.clickHandler_) {
      storeLi.clickHandler_ = google.maps.event.addDomListener(
          storeLi, 'click', clickHandler);
    }

    that.storeList_.append(storeLi);
  }
  google.maps.event.trigger(that, 'stores_updated', that.storeList_);
};

/**
 * Handler for selectedStore_changed. Highlights the selected store in the
 * store list.
 * @this storeLocator.Panel
 */
storeLocator.Panel.prototype.selectedStore_changed = function() {
  $('.highlighted', this.storeList_).removeClass('highlighted');

  var that = this;
  var store = this.get('selectedStore');
  if (!store) {
    return;
  }
  this.directionsTo_ = store;
  this.storeList_.find('#store-' + store.getId()).addClass('highlighted');

  if (this.settings_['directions']) {
    this.directionsPanel_.find('.directions-to')
      .val(store.getDetails().title);
  }

  var node = that.get('view').getInfoWindow().getContent();
  var directionsLink = $('<a/>')
                          .text('Directions')
                          .attr('href', '#')
                          .addClass('action')
                          .addClass('directions');

  // TODO(cbro): Make these two permanent fixtures in InfoWindow.
  // Move out of Panel.
  var zoomLink = $('<a/>')
                    .text('Zoom here')
                    .attr('href', '#')
                    .addClass('action')
                    .addClass('zoomhere');

  var streetViewLink = $('<a/>')
                          .text('Street view')
                          .attr('href', '#')
                          .addClass('action')
                          .addClass('streetview');

  directionsLink.click(function() {
    that.showDirections();
    return false;
  });

  zoomLink.click(function() {
    that.get('view').getMap().setOptions({
      center: store.getLocation(),
      zoom: 16
    });
  });

  streetViewLink.click(function() {
    var streetView = that.get('view').getMap().getStreetView();
    streetView.setPosition(store.getLocation());
    streetView.setVisible(true);
  });

  $(node).append(directionsLink).append(zoomLink).append(streetViewLink);
};

/**
 * Hides the directions panel.
 */
storeLocator.Panel.prototype.hideDirections = function() {
  this.directionsVisible_ = false;
  this.directionsPanel_.fadeOut();
  this.featureFilter_.fadeIn();
  this.storeList_.fadeIn();
  this.directionsRenderer_.setMap(null);
};

/**
 * Shows directions to the selected store.
 */
storeLocator.Panel.prototype.showDirections = function() {
  var store = this.get('selectedStore');
  this.featureFilter_.fadeOut();
  this.storeList_.fadeOut();
  this.directionsPanel_.find('.directions-to').val(store.getDetails().title);
  this.directionsPanel_.fadeIn();
  this.renderDirections_();

  this.directionsVisible_ = true;
};

/**
 * Renders directions from the location in the input box, to the store that is
 * pre-filled in the 'to' box.
 * @private
 */
storeLocator.Panel.prototype.renderDirections_ = function() {
  var that = this;
  if (!this.directionsFrom_ || !this.directionsTo_) {
    return;
  }
  var rendered = this.directionsPanel_.find('.rendered-directions').empty();

  this.directionsService_.route({
    origin: this.directionsFrom_,
    destination: this.directionsTo_.getLocation(),
    travelMode: google.maps['DirectionsTravelMode'].DRIVING
    //TODO(cbro): region biasing, waypoints, travelmode
  }, function(result, status) {
    if (status != google.maps.DirectionsStatus.OK) {
      // TODO(cbro): better error handling
      return;
    }

    var renderer = that.directionsRenderer_;
    renderer.setPanel(rendered[0]);
    renderer.setMap(that.get('view').getMap());
    renderer.setDirections(result);
  });
};

/**
 * featureFilter_changed event handler.
 */
storeLocator.Panel.prototype.featureFilter_changed = function() {
  this.listenForStoresUpdate_();
};

/**
 * Fired when searchPosition has been called. This happens when the user has
 * searched for a location from the location search box and/or autocomplete.
 * @name storeLocator.Panel#event:geocode
 * @param {google.maps.PlaceResult|google.maps.GeocoderResult} result
 * @event
 */

/**
 * Fired when the <code>Panel</code>'s <code>view</code> property changes.
 * @name storeLocator.Panel#event:view_changed
 * @event
 */

/**
 * Fired when the <code>Panel</code>'s <code>featureFilter</code> property
 * changes.
 * @name storeLocator.Panel#event:featureFilter_changed
 * @event
 */

/**
 * Fired when the <code>Panel</code>'s <code>stores</code> property changes.
 * @name storeLocator.Panel#event:stores_changed
 * @event
 */

/**
 * Fired when the <code>Panel</code>'s <code>selectedStore</code> property
 * changes.
 * @name storeLocator.Panel#event:selectedStore_changed
 * @event
 */

/**
 * @example see storeLocator.Panel
 * @interface
 */
storeLocator.PanelOptions = function() {};

/**
 * Whether to show the location search box. Default is true.
 * @type boolean
 */
storeLocator.prototype.locationSearch;

/**
 * The label to show above the location search box. Default is "Where are you
 * now?".
 * @type string
 */
storeLocator.PanelOptions.prototype.locationSearchLabel;

/**
 * Whether to show the feature filter picker. Default is true.
 * @type boolean
 */
storeLocator.PanelOptions.prototype.featureFilter;

/**
 * Whether to provide directions. Deafult is true.
 * @type boolean
 */
storeLocator.PanelOptions.prototype.directions;

/**
 * The store locator model to bind to.
 * @type storeLocator.View
 */
storeLocator.PanelOptions.prototype.view;

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * Store model class for Store Locator library.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Represents a store.
 * @example <pre>
 * var latLng = new google.maps.LatLng(40.7585, -73.9861);
 * var store = new storeLocator.Store('times_square', latLng, null);
 * </pre>
 * <pre>
 * var features = new storeLocator.FeatureSet(
 *     view.getFeatureById('24hour'),
 *     view.getFeatureById('express'),
 *     view.getFeatureById('wheelchair_access'));
 *
 * var store = new storeLocator.Store('times_square', latLng, features, {
 *   title: 'Times Square',
 *   address: '1 Times Square&lt;br>Manhattan, NY 10036'
 * });
 * </pre>
 * <pre>
 * store.distanceTo(map.getCenter());
 *
 * // override default info window
 * store.getInfoWindowContent = function() {
 *   var details = this.getDetails();
 *   return '&lt;h1>' + details.title + '&lt;h1>' + details.address;
 * };
 * </pre>
 * @param {string} id globally unique id of the store - should be suitable to
 * use as a HTML id.
 * @param {!google.maps.LatLng} location location of the store.
 * @param {storeLocator.FeatureSet} features the features of this store.
 * @param {Object.<string, *>=} props any additional properties.
 * <p> Recommended fields are:
 *      'title', 'address', 'phone', 'misc', 'web'. </p>
 * @constructor
 * @implements storeLocator_Store
 */
storeLocator.Store = function(id, location, features, props) {
  this.id_ = id;
  this.location_ = location;
  this.features_ = features || storeLocator.FeatureSet.NONE;
  this.props_ = props || {};
};
storeLocator['Store'] = storeLocator.Store;

/**
 * Sets this store's Marker.
 * @param {google.maps.Marker} marker the marker to set on this store.
 */
storeLocator.Store.prototype.setMarker = function(marker) {
  this.marker_ = marker;
  google.maps.event.trigger(this, 'marker_changed', marker);
};

/**
 * Gets this store's Marker
 * @return {google.maps.Marker} the store's marker.
 */
storeLocator.Store.prototype.getMarker = function() {
  return this.marker_;
};

/**
 * Gets this store's ID.
 * @return {string} this store's ID.
 */
storeLocator.Store.prototype.getId = function() {
  return this.id_;
};

/**
 * Gets this store's location.
 * @return {google.maps.LatLng} this store's location.
 */
storeLocator.Store.prototype.getLocation = function() {
  return this.location_;
};

/**
 * Gets this store's features.
 * @return {storeLocator.FeatureSet} this store's features.
 */
storeLocator.Store.prototype.getFeatures = function() {
  return this.features_;
};

/**
 * Checks whether this store has a particular feature.
 * @param {!storeLocator.Feature} feature the feature to check for.
 * @return {boolean} true if the store has the feature, false otherwise.
 */
storeLocator.Store.prototype.hasFeature = function(feature) {
  return this.features_.contains(feature);
};

/**
 * Checks whether this store has all the given features.
 * @param {storeLocator.FeatureSet} features the features to check for.
 * @return {boolean} true if the store has all features, false otherwise.
 */
storeLocator.Store.prototype.hasAllFeatures = function(features) {
  if (!features) {
    return true;
  }
  var featureList = features.asList();
  for (var i = 0, ii = featureList.length; i < ii; i++) {
    if (!this.hasFeature(featureList[i])) {
      return false;
    }
  }
  return true;
};

/**
 * Gets additional details about this store.
 * @return {Object} additional properties of this store.
 */
storeLocator.Store.prototype.getDetails = function() {
  return this.props_;
};

/**
 * Generates HTML for additional details about this store.
 * @private
 * @param {Array.<string>} fields the optional fields of this store to output.
 * @return {string} html version of additional fields of this store.
 */
storeLocator.Store.prototype.generateFieldsHTML_ = function(fields) {
  var html = [];
  for (var i = 0, ii = fields.length; i < ii; i++) {
    var prop = fields[i];
    if (this.props_[prop]) {
      html.push('<div class="');
      html.push(prop);
      html.push('">');
      html.push(this.props_[prop]);
      html.push('</div>');
    }
  }
  return html.join('');
};

/**
 * Generates a HTML list of this store's features.
 * @private
 * @return {string} html list of this store's features.
 */
storeLocator.Store.prototype.generateFeaturesHTML_ = function() {
  var html = [];
  html.push('<ul class="features" style="margin:0;padding:0;">');
  var featureList = this.features_.asList();
  for (var i = 0, feature; feature = featureList[i]; i++) {
    html.push('<li style="display:inline-block;">');
    html.push(feature.getDisplayName());
    html.push('</li>');
  }
  html.push('</ul>');
  return html.join('');
};

/**
 * Gets the HTML content for this Store, suitable for use in an InfoWindow.
 * @return {string} a HTML version of this store.
 */
storeLocator.Store.prototype.getInfoWindowContent = function() {
  if (!this.content_) {
    // TODO(cbro): make this a setting?
    var fields = ['title', 'address', 'phone', 'misc', 'web'];
    var html = ['<div class="store">'];
    html.push(this.generateFieldsHTML_(fields));
    html.push(this.generateFeaturesHTML_());
    html.push('</div>');

    this.content_ = html.join('');
  }
  return this.content_;
};

/**
 * Gets the HTML content for this Store, suitable for use in suitable for use
 * in the sidebar info panel.
 * @this storeLocator.Store
 * @return {string} a HTML version of this store.
 */
storeLocator.Store.prototype.getInfoPanelContent = function() {
  return this.getInfoWindowContent();
};

/**
 * Keep a cache of InfoPanel items (DOM Node), keyed by the store ID.
 * @private
 * @type {Object}
 */
storeLocator.Store.infoPanelCache_ = {};

/**
 * Gets a HTML element suitable for use in the InfoPanel.
 * @return {Node} a HTML element.
 */
storeLocator.Store.prototype.getInfoPanelItem = function() {
  var cache = storeLocator.Store.infoPanelCache_;
  var store = this;
  var key = store.getId();
  if (!cache[key]) {
    var content = store.getInfoPanelContent();
    cache[key] = $('<li class="store" id="store-' + store.getId() +
        '">' + content + '</li>')[0];
  }
  return cache[key];
};

/**
 * Gets the distance between this Store and a certain location.
 * @param {google.maps.LatLng} point the point to calculate distance to/from.
 * @return {number} the distance from this store to a given point.
 * @license
 *  Latitude/longitude spherical geodesy formulae & scripts
 *  (c) Chris Veness 2002-2010
 *  www.movable-type.co.uk/scripts/latlong.html
 */
storeLocator.Store.prototype.distanceTo = function(point) {
  var R = 6371; // mean radius of earth
  var location = this.getLocation();
  var lat1 = storeLocator.toRad_(location.lat());
  var lon1 = storeLocator.toRad_(location.lng());
  var lat2 = storeLocator.toRad_(point.lat());
  var lon2 = storeLocator.toRad_(point.lng());
  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Fired when the <code>Store</code>'s <code>marker</code> property changes.
 * @name storeLocator.Store#event:marker_changed
 * @param {google.maps.Marker} marker
 * @event
 */

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * This library makes it easy to create a fully-featured Store Locator for
 * your business's website.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Data feed that returns stores based on a given bounds and a set of features.
 * @example <pre>
 * // always returns the same stores
 * function SimpleStaticFeed(stores) {
 *   this.stores = stores;
 * }
 * SimpleStaticFeed.prototype.getStores = function(bounds, features, callback) {
 *   callback(this.stores);
 * };
 * new storeLocator.View(map, new SimpleStaticFeed());
 * </pre>
 * @interface
 */
storeLocator.DataFeed = function() {};
storeLocator['DataFeed'] = storeLocator.DataFeed;

/**
 * Fetch stores, based on bounds to search within, and features to filter on.
 * @param {google.maps.LatLngBounds} bounds the bounds to search within.
 * @param {storeLocator.FeatureSet} features the features to filter on.
 * @param {function(Array.<!storeLocator.Store>)} callback the callback
 * function.
 */
storeLocator.DataFeed.prototype.getStores =
    function(bounds, features, callback) {};

/**
 * The main store locator object.
 * @example <pre>
 * new storeLocator.View(map, dataFeed);
 * </pre>
 * <pre>
 * var features = new storeLocator.FeatureSet(feature1, feature2, feature3);
 * new storeLocator.View(map, dataFeed, {
 *   markerIcon: 'icon.png',
 *   features: features,
 *   geolocation: false
 * });
 * </pre>
 * <pre>
 * // refresh stores every 10 seconds, regardless of interaction on the map.
 * var view = new storeLocator.View(map, dataFeed, {
 *   updateOnPan: false
 * });
 * setTimeout(function() {
 *   view.refreshView();
 * }, 10000);
 * </pre>
 * <pre>
 * // custom MarkerOptions, by overriding the createMarker method.
 * view.createMarker = function(store) {
 *   return new google.maps.Marker({
 *     position: store.getLocation(),
 *     icon: store.getDetails().icon,
 *     title: store.getDetails().title
 *   });
 * };
 * </pre>
 * @extends {google.maps.MVCObject}
 * @param {google.maps.Map} map the map to operate upon.
 * @param {storeLocator.DataFeed} data the data feed to fetch stores from.
 * @param {storeLocator.ViewOptions} opt_options
 * @constructor
 * @implements storeLocator_View
 */
storeLocator.View = function(map, data, opt_options) {
  this.map_ = map;
  this.data_ = data;
  this.settings_ = $.extend({
      'updateOnPan': true,
      'geolocation': true,
      'features': new storeLocator.FeatureSet
    }, opt_options);

  this.init_();
  google.maps.event.trigger(this, 'load');
  this.set('featureFilter', new storeLocator.FeatureSet);
};
storeLocator['View'] = storeLocator.View;

storeLocator.View.prototype = new google.maps.MVCObject;

/**
 * Attempt to perform geolocation and pan to the given location
 * @private
 */
storeLocator.View.prototype.geolocate_ = function() {
  var that = this;
  if (window.navigator && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var loc = new google.maps.LatLng(
        pos.coords.latitude, pos.coords.longitude);

      that.getMap().setCenter(loc);
      that.getMap().setZoom(11);
      google.maps.event.trigger(that, 'load');
    }, undefined, /** @type GeolocationPositionOptions */({
      maximumAge: 60 * 1000,
      timeout: 10 * 1000
    }));
  }
};

/**
 * Initialise the View object
 * @private
 */
storeLocator.View.prototype.init_ = function() {
  if (this.settings_['geolocation']) {
    this.geolocate_();
  }
  this.markerCache_ = {};
  this.infoWindow_ = new google.maps.InfoWindow;

  var that = this;
  var map = this.getMap();

  this.set('updateOnPan', this.settings_['updateOnPan']);

  google.maps.event.addListener(this.infoWindow_, 'closeclick', function() {
    that.highlight(null);
  });

  google.maps.event.addListener(map, 'click', function() {
    that.highlight(null);
    that.infoWindow_.close();
  });
};

/**
 * Adds/remove hooks as appropriate.
 */
storeLocator.View.prototype.updateOnPan_changed = function() {
  if (this.updateOnPanListener_) {
    google.maps.event.removeListener(this.updateOnPanListener_);
  }

  if (this.get('updateOnPan') && this.getMap()) {
    var that = this;
    var map = this.getMap();
    this.updateOnPanListener_ = google.maps.event.addListener(map, 'idle',
        function() {
          that.refreshView();
        });
  }
};

/**
 * Add a store to the map.
 * @param {storeLocator.Store} store the store to add.
 */
storeLocator.View.prototype.addStoreToMap = function(store) {
  var marker = this.getMarker(store);
  store.setMarker(marker);
  var that = this;

  marker.clickListener_ = google.maps.event.addListener(marker, 'click',
      function() {
        that.highlight(store, false);
      });

  if (marker.getMap() != this.getMap()) {
    marker.setMap(this.getMap());
  }
};

/**
 * Create a marker for a store.
 * @param {storeLocator.Store} store the store to produce a marker for.
 * @this storeLocator.View
 * @return {google.maps.Marker} a new marker.
 * @export
 */
storeLocator.View.prototype.createMarker = function(store) {
  var markerOptions = {
    position: store.getLocation()
  };
  var opt_icon = this.settings_['markerIcon'];
  if (opt_icon) {
    markerOptions.icon = opt_icon;
  }
  return new google.maps.Marker(markerOptions);
};

/**
 * Get a marker for a store. By default, this caches the value from
 * createMarker(store)
 * @param {storeLocator.Store} store the store to get the marker from.
 * @return {google.maps.Marker} the marker.
 */
storeLocator.View.prototype.getMarker = function(store) {
  var cache = this.markerCache_;
  var key = store.getId();
  if (!cache[key]) {
    cache[key] = this['createMarker'](store);
  }
  return cache[key];
};

/**
 * Get a InfoWindow for a particular store.
 * @param {storeLocator.Store} store the store.
 * @return {google.maps.InfoWindow} the store's InfoWindow.
 */
storeLocator.View.prototype.getInfoWindow = function(store) {
  if (!store) {
    return this.infoWindow_;
  }

  var div = $(store.getInfoWindowContent());
  this.infoWindow_.setContent(div[0]);
  return this.infoWindow_;
};

/**
 * Gets all possible features for this View.
 * @return {storeLocator.FeatureSet} All possible features.
 */
storeLocator.View.prototype.getFeatures = function() {
  return this.settings_['features'];
};

/**
 * Gets a feature by its id. Convenience method.
 * @param {string} id the feature's id.
 * @return {storeLocator.Feature|undefined} The feature, if the id is valid.
 * undefined if not.
 */
storeLocator.View.prototype.getFeatureById = function(id) {
  if (!this.featureById_) {
    this.featureById_ = {};
    for (var i = 0, feature; feature = this.settings_['features'][i]; i++) {
      this.featureById_[feature.getId()] = feature;
    }
  }
  return this.featureById_[id];
};

/**
 * featureFilter_changed event handler.
 */
storeLocator.View.prototype.featureFilter_changed = function() {
  if (this.get('stores')) {
    this.clearMarkers();
  }

  google.maps.event.trigger(this, 'featureFilter_changed',
      this.get('featureFilter'));
};

/**
 * Clears the visible markers on the map.
 */
storeLocator.View.prototype.clearMarkers = function() {
  for (var marker in this.markerCache_) {
    this.markerCache_[marker].setMap(null);
    var listener = this.markerCache_[marker].clickListener_;
    if (listener) {
      google.maps.event.removeListener(listener);
    }
  }
};

/**
 * Refresh the map's view. This will fetch new data based on the map's bounds.
 */
storeLocator.View.prototype.refreshView = function() {
  var that = this;

  this.data_.getStores(this.getMap().getBounds(),
      /** @type {storeLocator.FeatureSet} */ (this.get('featureFilter')),
      function(stores) {
        var oldStores = that.get('stores');
        if (oldStores) {
          for (var i = 0, ii = oldStores.length; i < ii; i++) {
            google.maps.event.removeListener(
                oldStores[i].getMarker().clickListener_);
          }
        }
        that.set('stores', stores);
      });
};

/**
 * stores_changed event handler.
 * This will display all new stores on the map.
 * @this storeLocator.View
 */
storeLocator.View.prototype.stores_changed = function() {
  var stores = this.get('stores');
  for (var i = 0, store; store = stores[i]; i++) {
    this.addStoreToMap(store);
  }
};

/**
 * Gets the view's Map.
 * @return {google.maps.Map} the view's Map.
 */
storeLocator.View.prototype.getMap = function() {
  return this.map_;
};

/**
 * Select a particular store.
 * @param {storeLocator.Store} store the store to highlight.
 * @param {boolean=} opt_pan if panning to the store on the map is desired.
 */
storeLocator.View.prototype.highlight = function(store, opt_pan) {
  var infoWindow = this.getInfoWindow(store);
  if (store) {
    var infoWindow = this.getInfoWindow(store);
    if (store.getMarker()) {
      infoWindow.open(this.getMap(), store.getMarker());
    } else {
      infoWindow.setPosition(store.getLocation());
      infoWindow.open(this.getMap());
    }
    if (opt_pan) {
      this.getMap().panTo(store.getLocation());
    }
    if (this.getMap().getStreetView().getVisible()) {
      this.getMap().getStreetView().setPosition(store.getLocation());
    }
  } else {
    infoWindow.close();
  }

  this.set('selectedStore', store);
};

/**
 * Re-triggers the selectedStore_changed event with the store as a parameter.
 * @this storeLocator.View
 */
storeLocator.View.prototype.selectedStore_changed = function() {
  google.maps.event.trigger(this, 'selectedStore_changed',
      this.get('selectedStore'));
};

/**
 * Fired when the <code>View</code> is loaded. This happens once immediately,
 * then once more if geolocation is successful.
 * @name storeLocator.View#event:load
 * @event
 */

/**
 * Fired when the <code>View</code>'s <code>featureFilter</code> property
 * changes.
 * @name storeLocator.View#event:featureFilter_changed
 * @event
 */

/**
 * Fired when the <code>View</code>'s <code>updateOnPan</code> property changes.
 * @name storeLocator.View#event:updateOnPan_changed
 * @event
 */

/**
 * Fired when the <code>View</code>'s <code>stores</code> property changes.
 * @name storeLocator.View#event:stores_changed
 * @event
 */

/**
 * Fired when the <code>View</code>'s <code>selectedStore</code> property
 * changes. This happens after <code>highlight()</code> is called.
 * @name storeLocator.View#event:selectedStore_changed
 * @param {storeLocator.Store} store
 * @event
 */

/**
 * @example see storeLocator.View
 * @interface
 */
storeLocator.ViewOptions = function() {};

/**
 * Whether the map should update stores in the visible area when the visible
 * area changes. <code>refreshView()</code> will need to be called
 * programatically. Defaults to true.
 * @type boolean
 */
storeLocator.ViewOptions.prototype.updateOnPan;

/**
 * Whether the store locator should attempt to determine the user's location
 * for the initial view. Defaults to true.
 * @type boolean
 */
storeLocator.ViewOptions.prototype.geolocation;

/**
 * All available store features. Defaults to empty FeatureSet.
 * @type storeLocator.FeatureSet
 */
storeLocator.ViewOptions.prototype.features;

/**
 * The icon to use for markers representing stores.
 * @type string|google.maps.MarkerImage
 */
storeLocator.ViewOptions.prototype.markerIcon;

// Copyright 2012 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * Allows developers to specify a static set of stores to be used in the
 * storelocator.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A DataFeed with a static set of stores. Provides sorting of stores by
 * proximity and feature filtering (store must have <em>all</em> features from
 * the filter).
 * @example <pre>
 * var dataFeed = new storeLocator.StaticDataFeed();
 * jQuery.getJSON('stores.json', function(json) {
 *   var stores = parseStores(json);
 *   dataFeed.setStores(stores);
 * });
 * new storeLocator.View(map, dataFeed);
 * </pre>
 * @implements {storeLocator.DataFeed}
 * @constructor
 * @implements storeLocator_StaticDataFeed
 */
storeLocator.StaticDataFeed = function() {
  /**
   * The static list of stores.
   * @private
   * @type {Array.<storeLocator.Store>}
   */
  this.stores_ = [];
};
storeLocator['StaticDataFeed'] = storeLocator.StaticDataFeed;

/**
 * This will contain a callback to be called if getStores was called before
 * setStores (i.e. if the map is waiting for data from the data source).
 * @private
 * @type {Function}
 */
storeLocator.StaticDataFeed.prototype.firstCallback_;

/**
 * Set the stores for this data feed.
 * @param {!Array.<!storeLocator.Store>} stores  the stores for this data feed.
 */
storeLocator.StaticDataFeed.prototype.setStores = function(stores) {
  this.stores_ = stores;
  if (this.firstCallback_) {
    this.firstCallback_();
  } else {
    delete this.firstCallback_;
  }
};

/**
 * @inheritDoc
 */
storeLocator.StaticDataFeed.prototype.getStores = function(bounds, features,
    callback) {

  // Prevent race condition - if getStores is called before stores are loaded.
  if (!this.stores_.length) {
    var that = this;
    this.firstCallback_ = function() {
      that.getStores(bounds, features, callback);
    };
    return;
  }

  // Filter stores for features.
  var stores = [];
  for (var i = 0, store; store = this.stores_[i]; i++) {
    if (store.hasAllFeatures(features)) {
      stores.push(store);
    }
  }
  this.sortByDistance_(bounds.getCenter(), stores);
  callback(stores);
};

/**
 * Sorts a list of given stores by distance from a point in ascending order.
 * Directly manipulates the given array (has side effects).
 * @private
 * @param {google.maps.LatLng} latLng the point to sort from.
 * @param {!Array.<!storeLocator.Store>} stores  the stores to sort.
 */
storeLocator.StaticDataFeed.prototype.sortByDistance_ = function(latLng,
    stores) {
  stores.sort(function(a, b) {
    return a.distanceTo(latLng) - b.distanceTo(latLng);
  });
};

// Copyright 2013 Google Inc.

/**
 * @author Chris Broadfoot (Google)
 * @fileoverview
 * Provides access to store data through Google Maps Engine.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * A DataFeed where stores are provided by Google Maps Engine.
 * <p>
 * Note: the table that contains the stores needs to be publicly accessible.
 * @example <pre>
 * var dataFeed = new storeLocator.GMEDataFeed({
 *   tableId: '12421761926155747447-06672618218968397709',
 *   apiKey: 'AIzaSyAtunhRg0VTElV-P7n4Agpm9tYlABQDCAM',
 *   propertiesModifier: function(props) {
 *     return {
 *       id: transformId(props.store_id),
 *       title: props.store_title
 *     };
 *   }
 * });
 * new storeLocator.View(map, dataFeed);
 * </pre>
 * @implements storeLocator.DataFeed
 * @param {!storeLocator.GMEDataFeedOptions} opts the table ID, API key and
 * a transformation function for feature/store properties.
 * @constructor
 * @implements storeLocator_GMEDataFeed
 */
storeLocator.GMEDataFeed = function(opts) {
  this.tableId_ = opts['tableId'];
  this.apiKey_ = opts['apiKey'];
  if (opts['propertiesModifier']) {
    this.propertiesModifier_ = opts['propertiesModifier'];
  }
};
storeLocator['GMEDataFeed'] = storeLocator.GMEDataFeed;

storeLocator.GMEDataFeed.prototype.getStores =
    function(bounds, features, callback) {

  // TODO: use features.

  var that = this;
  var center = bounds.getCenter();

  var where = '(ST_INTERSECTS(geometry, ' + this.boundsToWkt_(bounds) + ')' +
      ' OR ST_DISTANCE(geometry, ' + this.latLngToWkt_(center) + ') < 20000)';

  var url = 'https://www.googleapis.com/mapsengine/v1/tables/' + this.tableId_ +
      '/features?callback=?';

  $.getJSON(url, {
    'key': this.apiKey_,
    'where': where,
    'version': 'published',
    'maxResults': 300
  }, function(resp) {
    var stores = that.parse_(resp);
    that.sortByDistance_(center, stores);
    callback(stores);
  });
};

/**
 * @private
 * @param {!google.maps.LatLng} point
 * @return {string}
 */
storeLocator.GMEDataFeed.prototype.latLngToWkt_ = function(point) {
  return 'ST_POINT(' + point.lng() + ', ' + point.lat() + ')';
};

/**
 * @private
 * @param {!google.maps.LatLngBounds} bounds
 * @return {string}
 */
storeLocator.GMEDataFeed.prototype.boundsToWkt_ = function(bounds) {
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return [
    "ST_GEOMFROMTEXT('POLYGON ((",
    sw.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', sw.lat(), ', ',
    ne.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', ne.lat(), ', ',
    sw.lng(), ' ', sw.lat(),
    "))')"
  ].join('');
};

/**
 * @private
 * @param {*} data GeoJSON feature set.
 * @return {!Array.<!storeLocator.Store>}
 */
storeLocator.GMEDataFeed.prototype.parse_ = function(data) {
  if (data['error']) {
    window.alert(data['error']['message']);
    return [];
  }
  var features = data['features'];
  if (!features) {
    return [];
  }
  var stores = [];
  for (var i = 0, row; row = features[i]; i++) {
    var coordinates = row['geometry']['coordinates'];
    var position = new google.maps.LatLng(coordinates[1], coordinates[0]);

    var props = this.propertiesModifier_(row['properties']);
    var store = new storeLocator.Store(props['id'], position, null, props);
    stores.push(store);
  }
  return stores;
};

/**
 * Default properties modifier. Just returns the same properties passed into
 * it. Useful if the columns in the GME table are already appropriate.
 * @private
 * @param {Object} props
 * @return {Object} an Object to be passed into the "props" argument in the
 * Store constructor.
 */
storeLocator.GMEDataFeed.prototype.propertiesModifier_ = function(props) {
  return props;
};

/**
 * Sorts a list of given stores by distance from a point in ascending order.
 * Directly manipulates the given array (has side effects).
 * @private
 * @param {google.maps.LatLng} latLng the point to sort from.
 * @param {!Array.<!storeLocator.Store>} stores  the stores to sort.
 */
storeLocator.GMEDataFeed.prototype.sortByDistance_ =
    function(latLng, stores) {
      stores.sort(function(a, b) {
        return a.distanceTo(latLng) - b.distanceTo(latLng);
      });
    };

/**
 * @example see storeLocator.GMEDataFeed
 * @interface
 */
storeLocator.GMEDataFeedOptions = function() {};

/**
 * The table's asset ID.
 * @type string
 */
storeLocator.GMEDataFeedOptions.prototype.tableId;

/**
 * The API key to use for all requests.
 * @type string
 */
storeLocator.GMEDataFeedOptions.prototype.apiKey;

/**
 * A transformation function. The first argument is the feature's properties.
 * Return an object useful for the <code>"props"</code> argument in the
 * storeLocator.Store constructor. The default properties modifier
 * function passes the feature straight through.
 * <p>
 * Note: storeLocator.GMEDataFeed expects an <code>"id"</code> property.
 * @type ?(function(Object): Object)
 */
storeLocator.GMEDataFeedOptions.prototype.propertiesModifier;


})(jQuery)
