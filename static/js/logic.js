// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // console.log(data.features);
  array_of_objects= data.features
  mags = array_of_objects.map(x=>x.properties.mag)
  // console.log(mags)

  depth = array_of_objects.map(x=>x.geometry.coordinates[2]);
  // console.log(depth);

  coords = array_of_objects.map(x=>x.geometry.coordinates.slice(0, 2));
  // console.log(coords);

  // Create a map object
  var myMap = L.map("mapid", {
  center: [15.5994, -28.6731],
  zoom: 3
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  // // Loop through the cities array and create one marker for each city object
  for (var i = 0; i < mags.length; i++) {

    // Conditionals for countries points
    var color = "";
    if (depth[i] >=-10 && depth[i] <=10) {
      color = "Green";
    }
    else if (depth[i] > 10 && depth[i] <= 30) {
      color = "Light Green";
    }
    else if (depth[i] > 30 && depth[i] <= 50) {
      color = "Yellow";
    }
    else if (depth[i] > 50 && depth[i] <= 70) {
      color = "Light Orange";
    }
    else if (depth[i] > 70 && depth[i] <= 90) {
      color = "Orange";
    }
    else if (depth[i] > 90) {
      color = "Red";
    }
    else {
      color = "black";
    }

    // Add circles to map
    L.circle(coords[i], {
      fillOpacity: 0.75,
      //color: "white",
      color: color,
      //fillColor: color,
      // Adjust radius
      radius: mags[i] * 1500
    }).bindPopup("<h1>Coordniates: " + coords[i] + "</h1> <hr> <h3>Magnitude: " + mags[i] + "</h3>").addTo(myMap);
  }

});