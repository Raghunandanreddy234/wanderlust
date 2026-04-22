
  document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map').setView([17.3850, 78.4867], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([17.3850, 78.4867]).addTo(map)
      .bindPopup("You are here!")
      .openPopup();
  });
