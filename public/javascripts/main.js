window.onload = () => {
  const center = {
    lat: 52.5120361,
    lng: 13.39919
  };
  
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: center
  });

  getPlaces()
  
  function getPlaces() {
    axios.get("http://localhost:3000/api")
     .then(tableData => {
       placeMarkers(tableData.data.tables);
     })
   }
  
   function placeMarkers(tableData) {
    tableData.forEach(function (Table) {
      const tablePlace = {
        lat: Table.location.coordinates[0],
        lng: Table.location.coordinates[1]
      };
      const pin = new google.maps.Marker({
        position: tablePlace,
        map: map,
        title: Table.team
      });
      tables.push(pin);

      pin.addListener('click', function() {
        map.setZoom(18);
        map.setCenter(pin.getPosition());
        });
    });
  }

  const tables = []
  console.log("debug markers", tables)

// /* Filter profile overview */
//   document.querySelector("select").onclick = function() {
//   let filter = document.querySelector("select").value
//     if (filter === "wework, Potsdamer Platz") {
//      document.
//     }
//     if (filter === "wework, at Atrium Tower") {
      
//     }
//     else {
      
//     }
//   }

};