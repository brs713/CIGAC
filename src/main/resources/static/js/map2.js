let initialCtr = {lat:38.621291, lng:-90.224846};


function initMap() {

    mymap = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: initialCtr,
        mapTypeControl:false,
        streetViewControl: false,
        rotateControl: true,
        zoomControl: false,
        gestureHandling: 'cooperative'

    });

    setTimeout(function () {
    	$('#loc-main').addClass('hidden')
    	$('#loc-main').removeClass('invisible')
    }, 1000);
}


//let locs = $('.location')
//console.log(locs)
let markerNames = [];
let markerLats = [];
let markerLngs = [];

let blueIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
let hoverIcon = "http:// labs.google.com/ridefinder/images/mm_20_gray.png"
let letter = "r"
let customIcon1 = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+letter+'|ff8000|000000'

let markerMaker = function(index) {
	
	locs.each(function(index){
		markerNames[index] = $(locs[index]).find('.loc-name').text()
		markerLats[index] = parseFloat($(locs[index]).find('.lat').text(), 10)
		markerLngs[index] = parseFloat($(locs[index]).find('.lng').text(), 10)
		
		markerNames[index] = new google.maps.Marker ({
			icon: customIcon1,
			id: index,
			position: {'lat':markerLats[index], 'lng':markerLngs[index]},
			map: map,
		})
		
		index++
	})	
	
}    




//Function called when hover the div
function hover(id) {
  for ( var i = 0; i< markerNames.length; i++) {
      if (id === markerNames[i].id) {
         markerNames[i].setIcon(blueIcon);
         break;
      }
 }
}

//Function called when out the div
function out(id) {  
  for ( var i = 0; i< markerNames.length; i++) {
      if (id === markerNames[i].id) {
         markerNames[i].setIcon(hoverIcon);
         break;
      }
 }
}
  


//AIzaSyCLNp25pNgiR7w4RvxOwS8ZF212b_j6UDw