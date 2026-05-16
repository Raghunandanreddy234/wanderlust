maptilersdk.config.apiKey = mapToken;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: [78.9629, 20.5937],
  zoom: 2,
});

map.addControl(new maptilersdk.NavigationControl(), "top-right");

map.on("load", () => {
  if (listing.geometry && listing.geometry.coordinates) {
    const [lng, lat] = listing.geometry.coordinates;

    map.setCenter([lng, lat]);
    map.setZoom(10);

    const popup = new maptilersdk.Popup({ offset: 25 })
      .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be  provided after booking</p>`);

    new maptilersdk.Marker({ color: "#FE424D" })
      .setLngLat([lng, lat])
      .setPopup(popup, ({ offset: 25}))
      .addTo(map);
  }
});