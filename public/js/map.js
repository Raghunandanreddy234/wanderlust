const map = L.map('map').setView([12.9716, 77.5946], 10);

// MapTiler tiles with your key
L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${MAPTILER_KEY}`, {
  attribution: '&copy; MapTiler & OpenStreetMap contributors'
}).addTo(map);