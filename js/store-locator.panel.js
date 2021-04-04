google.maps.event.addDomListener(window, 'load', function() {

  // Declare variables
  var list = document.getElementById('panel');
  var data = new window.DataSource;


  // Initialize Google Maps API v3
  _googleMap = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(57.19, -4.29),
    zoom: 7,
    minZoom: 6,
    maxZoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });


  // Initialize Store Locator view
  _googleView = new storeLocator.View(_googleMap, data, {
    markerIcon: 'img/store_+.png',
    geolocation: true,
    features: data.getFeatures()
  });


  // Initialize Marker Clusterer
  _googleCluster = new MarkerClusterer(_googleMap, [] ,{
    imagePath: 'img/store_m',
    maxZoom: 10
  });


  // Overwrite the Store Locator View functions function to integrate Marker Clusterer
  _googleView.addStoreToMapB = _googleView.addStoreToMap;
  _googleView.addStoreToMap = function(store) {
    _googleView.addStoreToMapB(store);
    _googleCluster.addMarker(store.getMarker());
    _googleCluster.redraw();
  };

  _googleView.clearMarkersB = _googleView.clearMarkers;
  _googleView.clearMarkers = function() {
    _googleView.clearMarkersB();
    _googleCluster.clearMarkers();
  };


  // Initialize Store Locator Panel
  _googlePanel = new storeLocator.Panel(list, {
    locationSearchLabel: 'Your location',
    view: _googleView
  });


  // Create invisible user location marker and attach to map center
  _googleLocation = new google.maps.Marker({
    position: _googleMap.getCenter(),
    map: _googleMap,
    icon: 'img/store_scout.png',
    visible: false
  });


  // Hook Marker Clusterer repaint into Google Maps idle event
  google.maps.event.addListener(_googleMap, 'idle', function() {
    _googleCluster.repaint();
  });


  // Hook user location marker update into Google Maps idle event
  google.maps.event.addListener(_googlePanel, 'geocode', function(result) {
    if(typeof result.geometry != 'undefined') {
      _googleLocation.setPosition(result.geometry.location);
      _googleLocation.setVisible(true);
    }
  });


  // Hook pin updating into Google Maps idle event
  google.maps.event.addListener(_googleMap, 'idle', function() {
    updatePins();
  });


  // Hook pin updating into Store Locator View stores_updated event
  google.maps.event.addListener(_googlePanel, 'stores_updated', function() {
    updatePins();
  });


  // Pin updating function that will ensure they are lettered from A to Z continuing with + once user location is set
  function updatePins() {
    if(_googleLocation.getVisible()) {
      // Extend Store Locator with some handy variables
      _googleView.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      _googleView.sort = [];
      _googleView.corel = {};

      // Loop stores and calculate distance from user location
      for(var i in _googleView.stores) {
        var store = _googleView.stores[i];
        store.distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(_googleLocation.getPosition(), store.getMarker().getPosition()));
        store.miles = Math.round((store.distance * 0.000621371192) * 100) / 100;

        // This part is required to sort them by distance
        store.ident = store.distance + // Using distance as ID
                      ('0000' + i).slice(-5); // Used to diferenciate markers with identical distance

        // Adding ident to an array for sorting and also recording key and ident a corelation object
        _googleView.sort.push(store.ident);
        _googleView.corel[store.ident] = i;
      }

      // Sort idents numerically
      _googleView.sort.sort(function(a,b){return a - b;});

      // Loop stores again this time in order of distance ascending and add lettering and distace info where needed
      for(var i in _googleView.sort) {
        var store = _googleView.stores[_googleView.corel[_googleView.sort[i]]];
        var letter = typeof _googleView.letters[i] != 'undefined' ? _googleView.letters[i] : '+';

        store.getMarker().setIcon('img/store_' + letter + '.png');
        store.getInfoPanelItem().children[0].children[0].innerHTML = '<span class="letter">' + letter + '</span>' + store.getDetails().title;
        store.getInfoPanelItem().children[0].children[1].children[0].innerHTML = store.miles + ' miles';
      }
    }
  }

});
