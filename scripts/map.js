/* ========================================================================== */
/* Instantiate map                                                            */
/* ========================================================================== */
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-2.71131, 47.70301],
  zoom: 12,
  scrollZoom: true,
  minZoom: 9,
});

/* ========================================================================== */
/* Load data                                                                  */
/* ========================================================================== */
// communes de l'EPCI du Golfe du morbihan
const com = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-commune/exports/geojson?lang=en&refine=epci_name%3A%22CA%20Golfe%20du%20Morbihan%20-%20Vannes%20Agglom%C3%A9ration%22&facet=facet(name%3D%22epci_name%22%2C%20disjunctive%3Dtrue)&timezone=Europe%2FBerlin"

map.on('load', () => {
  // add communes
  map.addLayer({
    "id": "comLigne",
    "type": "line",  // fill, circle
    "source": {
      'type': 'geojson',
      "data": com,
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      "line-color": "Black",
      "line-width": 1,
    },
    'minZoom': 9,
    'maxZoom': 15
  });
});

/* ========================================================================== */
/* Markers                                                                    */
/* ========================================================================== */

/* ========================================================================== */
/* Popup                                                                      */
/* ========================================================================== */