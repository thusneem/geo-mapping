
 //Function to determine marker size based on population
function markerSize(magnitude) {
  return magnitude * 3;
}

function chooseColor(magnitude){
  if (magnitude > 7.0){
    return "red"
  }
  else if (magnitude > 6.0) {
    return "orange"
  }
  else if (magnitude > 5.0){
    return "yellow"
  }
  else if (magnitude > 4.0){
    return "blue"
  }
  else if (magnitude > 2.0){
    return "green"
  }
  else { return "lightgrey"}
};

// Define arrays to hold created city and state markers


var earthquakeAPILink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var tectonicAPILink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

var earthquakes = new L.LayerGroup();


d3.json(earthquakeAPILink, function(data){
  //console.log(data.features);
  L.geoJson(data.features, {
    
    onEachFeature: function(feature, layer){
      layer.bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><br><h3>Place: " + feature.properties.place + "</h3>");
    },
    pointToLayer: function(feature, latlng) {
      return new L.circleMarker(latlng, 
        {radius: markerSize(feature.properties.mag)});
      },
        style: function(d){
          return {
        fillColor: chooseColor(d.properties.mag),
        fillOpacity: .6,
        color: "white",
        stroke: true,
        weight: .8
    }
  }
  }).addTo(earthquakes);  
});

var tectonicplates = new L.LayerGroup();
// Adding tile layer

d3.json(tectonicAPILink, function(data){
 // console.log(data.features);
  L.geoJson(data.features, {
    color: "darkred",
    weight: 2   
  }).addTo(tectonicplates);
});

 
  
function createMap(earthquakes, tectonicplates) {
// Define variables for our base layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: "pk.eyJ1IjoidGh1c25lZW0iLCJhIjoiY2pxMWZ4eThlMHg1ZjN5c2J2bXBnd3M1bCJ9.HZ58aKTgOA8w-F4XT1yyvw"
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: "pk.eyJ1IjoidGh1c25lZW0iLCJhIjoiY2pxMWZ4eThlMHg1ZjN5c2J2bXBnd3M1bCJ9.HZ58aKTgOA8w-F4XT1yyvw"
    });

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken:"pk.eyJ1IjoidGh1c25lZW0iLCJhIjoiY2pxMWZ4eThlMHg1ZjN5c2J2bXBnd3M1bCJ9.HZ58aKTgOA8w-F4XT1yyvw" 
    });
    // Create a baseMaps object
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap,
      "Satellite map": satellite
    };

    // Create an overlay object
    var overlayMaps = {
      "Earth Quake": earthquakes,
      "Tectonic Plate": tectonicplates
    };

    // Define a map object
    var myMap = L.map("map", {
      center: [39.8283, -98.5785],
      zoom: 3,
      layers: [streetmap, earthquakes]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: true
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});
          legend.onAdd = function(map) {
            var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 2, 4, 5, 6, 7],
              labels = ["0-2", "2-4", "4-5", "5-6", "6-7", "7+"];
              div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>";

              for (var i = 0; i < grades.length; i++) {
                div.innerHTML += '<i style="display:inline-block;height:10px;width:10px;background-color:' + chooseColor(grades[i] + 1) + '"></i> ' +
                    grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
            return div;
    };
          legend.addTo(myMap);

}
createMap(earthquakes,tectonicplates);
