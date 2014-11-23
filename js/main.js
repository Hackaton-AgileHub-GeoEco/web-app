var
	map, markers = [],
	alertFadeTime = 200,
	alertDelay = 1400,
	markerStatus = ["img/markerOpened.png", "img/markerStarted.png"],
	successAlert = $("#success"), errorAlert = $("#error");

$('#submit').click(function(){
	var userName = $('#userName').val();
	var userEmail = $('#userEmail').val();
	var userPhone = $('#userPhone').val();
	var locationId = $('#locationId').val();

	$.ajax({
		url: "http://192.168.1.217/geo/ecoservice/volunteer/" + locationId + "/" + userName + "/" + userPhone + "/" + userEmail,
		success: function(data) {
			if(data) {
				getMarkerById(locationId).going = data;

				$('#goingToEvent').modal('hide');
			}
		},
		error: showErrorAlert
	});
});

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
	$.get("http://192.168.1.217/geo/ecoservice/list", function(data) {
		console.debug("list: ", data);

		for(var i = 0; i < data.length; i++) {
			addMarker(data[i].Id, getLatLng(data[i].Latitude, data[i].Longitude), data[i].Volunteers, data[i].Status);
		}
	});
}

function setMapLocation(lat, lng) {
	map.panTo(getLatLng(lat, lng));
	map.setZoom(14);
}

function onMapClick(event) {
	$.ajax({
		url: "http://192.168.1.217/geo/ecoservice/trashsource/" + event.latLng.lat() + "/" + event.latLng.lng(),
		// contentType: "application/json",
		// crossDomain: true,
		type: "GET",
		data: {
			Lat: event.latLng.lat(),
			Lon: event.latLng.lng()
		},
		success: function(data) {
			addMarker(data.Id, event.latLng, 0, 0);

			showSuccessAlert();
		},
		error: showErrorAlert
	});
};

function getMarkerById(id){
	for(var i=0;i<markers.length;i++){
		if(markers[i].id == id) {
			return markers[i];
		}
	}
}
function showPopupWindow(){
	$('#locationId').val(this.id);
	$('#peopleGoing').text(this.going);
	$('#goingToEvent').modal('show');
}

function addMarker(id, position, going, status) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		animation: google.maps.Animation.DROP,
		icon: markerStatus[status]
	});

	marker.id = id;
	marker.going = going;

	google.maps.event.addListener(marker, "click", showPopupWindow);

	markers.push(marker);
}

function showSuccessAlert() {
	successAlert.fadeIn(alertFadeTime).delay(alertDelay).fadeOut(alertFadeTime);
}

function showErrorAlert() {
	errorAlert.fadeIn(alertFadeTime).delay(alertDelay).fadeOut(alertFadeTime);
}

function getLatLng(lat, lng) {
	return new google.maps.LatLng(lat, lng);
}
