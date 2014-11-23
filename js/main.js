var
	map, markers = [],
	alertFadeTime = 200,
	alertDelay = 1400,
	markerStatus = ["img/markerOpened.png", "img/markerStarted.png"],
	successAlert = $("#success"), errorAlert = $("#error");

$('#submit').click(function(){
    var userEmail = $('#userEmail').val();
    var userPhone = $('#userPhone').val();
    var locationId = $('#locationId').val();
    $.post("join.php", {id: locationId, email: userEmail, phone: userPhone}, function(data, textStatus, xhr) {
		console.debug("data: ", data);

		if(data) {
			getMarkerById(locationId).going++;
                        $('#goingToEvent').modal('hide');
		} else {
			alert("Error");
		}
	});
})

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
			addMarker(data[i].id, getLatLng(data[i].lat, data[i].lon), data[i].going, data[i].status);
		}
	});
}

function setMapLocation(lat, lng) {
	map.panTo(getLatLng(lat, lng));
	map.setZoom(14);
}

function onMapClick(event) {
	$.ajax({
		url: "report.php",
		type: "POST",
		data: {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		},
		success: function(data) {
			addMarker(data.id, event.latLng, 0);

			showSuccessAlert();
		},
		error: showErrorAlert
	});
};

function getMarkerById(id){
    for(var i=0;i<markers.length;i++){
        if(markers[i].id == id)
            return markers[i];
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
	console.debug(errorAlert);
	errorAlert.fadeIn(alertFadeTime).delay(alertDelay).fadeOut(alertFadeTime);
}

function getLatLng(lat, lng) {
	return new google.maps.LatLng(lat, lng);
}
