var map, markers = [];
$('#submit').click(function(){
    var userEmail = $('#userEmail').val();
    var userPhone = $('#userPhone').val();
    var locationId = $('#locationId').val();
    var userName = $('#userName').val();
    $.post("join.php", {id: locationId, name: userName, email: userEmail, phone: userPhone}, function(data, textStatus, xhr) {
		console.debug("data: ", data);

		if(data) {
			getMarkerById(locationId).going++;
                        $('#goingToEvent').modal('hide');
		} else {
			alert("Error");
		}
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
	$.get("list.php", function(data) {
		console.debug("list: ", data);

		for(var i = 0; i < data.length; i++) {
			addMarker(data[i].id, getLatLng(data[i].lat, data[i].lon), data[i].going);
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
			addMarker(data.id, event.latLng, 0);
		} else {
			// alert("Error");
		}
	});
};

function getMarkerById(id){
    for(var i=0;i<markers.length;i++){
        if(markers[i].id === id)
            return markers[i];
    }
}
function showPopupWindow(){
    $('#locationId').val(this.id);
    $('#peopleGoing').text(this.going);
	$('#goingToEvent').modal('show');
}

function addMarker(id, position, going) {
	var marker = new google.maps.Marker({
		position: position,
		map: map,
		animation: google.maps.Animation.DROP
	});

	marker.id = id;
        marker.going = going;

	google.maps.event.addListener(marker, "click", showPopupWindow);

	markers.push(marker);
}

function getLatLng(lat, lng) {
	return new google.maps.LatLng(lat, lng);
}
