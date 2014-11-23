var map, markers = [];

function initialize() {
	getCurrentLocation();

	var mapOptions = {
		center: {
			lat: 0,
			lng: 0
		},
		zoom: 3
	};

	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	getReportsList();

	google.maps.event.addListener(map, "click", onMapClick);
}

google.maps.event.addDomListener(window, "load", initialize);

function getCurrentLocation() {
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			setMapLocation(position.coords.latitude, position.coords.longitude);
		});
	}
}

function getReportsList() {
	$.get("list.php", function(data) {
		console.debug("list: ", data);

		for(var i = 0; i < data.length; i++) {
			addMarker(data[i].id, getLatLng(data[i].lat, data[i].lon));
		}
	});
}

function setMapLocation(lat, lng) {
	map.panTo(getLatLng(lat, lng));
	map.setZoom(14);
}

function onMapClick(event) {
	console.debug({lat: event.latLng.lat(), lng: event.latLng.lng()});

	$.post("report.php", {lat: event.latLng.lat(), lng: event.latLng.lng()}, function(data, textStatus, xhr) {
		console.debug("data: ", data);

		if(data) {
			addMarker(data.id, event.latLng);
		} else {
			// alert("Error");
		}
	});
};

function addMarker(id, position) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		animation: google.maps.Animation.DROP
	});

	marker.id = id;

	markers.push(marker);
}

function getLatLng(lat, lng) {
	return new google.maps.LatLng(lat, lng);
}
