document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  
}, false);


window.onload = () => {
  const establishment = {
    lat: 41.386230, 
    lng: 2.174980
  };
  
  const markers = []
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: establishment
  });

  const center = {
    lat: undefined,
    lng: undefined
  }; 

  markers = [];
  function placeEstablishments(establishments){
    establishments.forEach(function(restaurant){
      const center = {
        lat: restaurant.location.coordinates[1],
        lng: restaurant.location.coordinates[0]
       
      };
      const pin = new google.maps.Marker({
        position: center,
        map: map,
        title: restaurant.name

      });
      console.log(center)
      markers.push(pin)
    });
}
// placeEstablishments(establishment)
};