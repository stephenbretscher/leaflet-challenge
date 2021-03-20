var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// grab json data from usgs url 
d3.json(earthquakeURL, function(data) {
    //Earthquake data in json format under features -> properties -> mag/place/time
    earthquakeFeatures(data.features);
});

//--------------------------------------------------------------------------------------------------------------------------------
//Earthquake datapoints

// earthquakeFeatures function to run on each data point 
function earthquakeFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        //display magnitude and location information as well as time on tooltip using bindPopup
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },

          //arrow function for data points, define color and radius functions below
          pointToLayer: (feature, latlng) => new L.circle(latlng,
              {
                //base 2 functions on magnitude property of point
                  radius: getRadius(feature.properties.mag),
                  fillColor: getColor(feature.properties.mag),
                //roughly match example, thin black outline, almost opaque
                  fillOpacity: .9,
                  color: "black",
                  stroke: true,
                  weight: .5
              })
        });

    createMap(earthquakes);
}

//--------------------------------------------------------------------------------
//createMap function, first grab three styles from mapbox api 
function createMap(earthquakes) {
  
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoic3RlcGhlbi1icmV0c2NoZXIiLCJhIjoiY2ttNWphamtoMGV4cjJvcmJ0cmo4b3UzNCJ9.dNPcGN2OPhxPjW37v1I3Kw");
 
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoic3RlcGhlbi1icmV0c2NoZXIiLCJhIjoiY2ttNWphamtoMGV4cjJvcmJ0cmo4b3UzNCJ9.dNPcGN2OPhxPjW37v1I3Kw");
    
    var airmap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1Ijoic3RlcGhlbi1icmV0c2NoZXIiLCJhIjoiY2ttNWphamtoMGV4cjJvcmJ0cmo4b3UzNCJ9.dNPcGN2OPhxPjW37v1I3Kw");

    //baseMaps defined here, distinct option in user interface for each map layer
    var baseMaps = {
        "Satellite": satellite,
        "LightMap": lightMap,
        "Outdoors": airmap,
    };

//-------------------------------------------------------------------------
// create Map with controllable objects, default = satellite with earthquakes
    var overlayMaps = {
        "Earthquakes": earthquakes,
    };

    // Create map
    var map = L.map("map", {
        center: [20.7, -70.5],
        zoom: 5,
        layers: [satellite, earthquakes] 
    });

    //define layer control, prevent collapse with collapsed: false
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

//------------------------------------------------------------------------------
//define legend and position bottom right 
var legend = L.control({
    position: "bottomright"
});
//color list for legend
var legendColor = ["lightblue", "lightgreen", "green", "yellow", "orange", "red" ];

legend.onAdd = function () {
    legend_depth = [10, 10, 30, 50, 70, 90]
    // add div + title for legend
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = "<h6 class='legend-title'>Depth</h6>"

    // loop to annotate legend with magnitude ranges and corresponding color squares
    for (var i = 0; i < legendColor.length; i++) {
        div.innerHTML +=
            '<id="legend-squares" style="background:' + legendColor[i] + '">' +
            legend_depth[i] + (legend_depth[i+1] ? '-' + legend_depth[i+1] + '<br>' : '+');
    }
    return div;
};
// Add legend to the map
legend.addTo(map);
}

//-------------------------------------------------------------------------------------------
//Radius for datapoints 
function getRadius(magnitude) {
    return magnitude * 25000;
};

// define color based on magnitude
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'red'
    } else if (magnitude > 4) {
        return 'orange'
    } else if (magnitude > 3) {
        return 'yellow'
    } else if (magnitude > 2) {
        return 'green'
    } else if (magnitude > 1) {
        return 'lightgreen'
    } else {
        return 'lightblue'
    }
};