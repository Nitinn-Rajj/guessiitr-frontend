
function onMapClick(e) {
	marker.setLatLng(e.latlng);
}

const image_urls = [
	"./assets/photos/img1.jpg",
	"./assets/photos/img2.jpg",
]

getRandomImage = () => {
	return image_urls[Math.floor(Math.random() * image_urls.length)];
}

var map = L.map('map', {
    maxBounds: [[29.858, 77.885], [29.875, 77.905]],
    maxBoundsViscosity: 1.0 
}).setView([29.8673, 77.8955], 16);

var bounds = [[29.858, 77.885], [29.875, 77.905] ];

var latlngs = [
    [29.858, 77.885],
    [29.865, 77.890],
    [29.870, 77.895],
    [29.875, 77.905]
];


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
	minZoom: 16,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    useCache: true,
    crossOrigin: true
}).addTo(map);


var marker = L.marker([29.867219237294258, 77.89531946182252]).addTo(map);

map.on('click', onMapClick);
map.on('click', onMapClick);

var lat = 0;
var lon = 0;

window.onload = function() {
    var img = document.getElementById('sampleImage');
    EXIF.getData(img, function() {
         lat = EXIF.getTag(this, "GPSLatitude");
         lon = EXIF.getTag(this, "GPSLongitude");
        var latRef = EXIF.getTag(this, "GPSLatitudeRef") || "N";
        var lonRef = EXIF.getTag(this, "GPSLongitudeRef") || "W";

        if (lat && lon) {
            lat = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef === "N" ? 1 : -1);
            lon = (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef === "W" ? -1 : 1);
            console.log("Latitude: " + lat + ", Longitude: " + lon);
        } else {
            console.log("No GPS data found.");
        }
    });
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; 
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

var guessButton = document.getElementById('guess');
guessButton.onclick = function() {
    CalculateScore();
};



function CalculateScore(){

	var latlng = marker.getLatLng();
	var lat1 = latlng.lat;
	var lng1 = latlng.lng;

	var lat2 = lat;
	var lng2 = lon;

	var distance = getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2)*1000;
	var score = 0;
	
	console.log("distance" + distance);
	
	var newMarker = L.marker([lat2, lng2]).addTo(map);
	console.log(lat2, lng2);

    var latlngs = [
    [lat1, lng1],
    [lat2, lng2]
    ];
    var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);

	var sigma = 25;
	var score = 1000*Math.exp((-1*distance*distance*distance)/Math.pow(sigma, 5));
	console.log("score" + " " + Math.round(score));

    map.fitBounds(polyline.getBounds());
	guessButton=document.getElementById('guess');


}
