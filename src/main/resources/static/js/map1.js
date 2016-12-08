let map;


let locs = $('.location')
console.log(locs)
let markerNames = [];
let markerLats = [];
let markerLngs = [];

let blueIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
let hoverIcon = "http:// labs.google.com/ridefinder/images/mm_20_gray.png"
let letter = "r"
let customIcon1 = 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+letter+'|ff8000|000000'


function initMap() {

    //Custom map overlay
    // https://snazzymaps.com/style/80426/greyworld
    let overlay = new google.maps.StyledMapType(

        [
            {
                "featureType": "all",
                "elementType": "all",
                "stylers": [
                    {
                        "hue": "#ff0000"
                    },
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": -30
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#353535"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#656565"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#505050"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#808080"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "red"
                    }
                ]
            }
        ]
    )
    
    
    
    
	let initialCtr = {lat:38.621291, lng:-90.224846};

    let marker = new google.maps.Marker();
    let url = 'http://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/';


    let pinColor = "0FF";//"FE7569";
    let pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColor,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));
    let pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
        new google.maps.Size(40, 37),
        new google.maps.Point(0, 0),
        new google.maps.Point(12, 35));

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: initialCtr,
        mapTypeControl:false,
        streetViewControl: false,
        rotateControl: true,
        zoomControl: false,
        gestureHandling: 'cooperative'

    });

    
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
    
    
//    markerNames.forEach(function(markerName){
//    	
//        google.maps.event.addListener(markerNames[markerName], 'mouseover', function() {
//        	markerNames[markerName].setIcon(blueIcon);
//        });
//        google.maps.event.addListener(markerNames[markerName], 'mouseout', function() {
//        	markerNames[markerName].setIcon(hoverIcon);
//        });    
//
//    })
    
  
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set('styled_map', overlay);
    map.setMapTypeId('styled_map');

    setTimeout(function () {
    	$('#loc-main').addClass('hidden')
    	$('#loc-main').removeClass('invisible')
    }, 1000);
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