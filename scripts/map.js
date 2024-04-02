/* ========================================================================== */
/* Instantiate map                                                            */
/* ========================================================================== */
// AccesToken de Antoine_S
mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b2luZTIzMDgiLCJhIjoiY2xza2RzcjdkMDI5OTJpbjJjM3ZxNms4dSJ9.4aUmIGBpfmffjyo55jozIg';

// Mise en place du fond de carte jour 
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/antoine2308/clugqndnn00k201r5ep748gxl',
  center: [-2.71131, 47.70301],
  zoom: 12.5,
  scrollZoom: true,
  customAttribution : '<a href= "https://esigat.wordpress.com/" target="_blank"> Master SIGAT</a>',
  minZoom: 9,
  maxBounds: [
    [-2.85, 47.65], // W-S coordinates
    [-2.62, 47.77] // E-N coordinates
  ]
});

// Ajout Echelle cartographique
map.addControl(new mapboxgl.ScaleControl({
  maxWidth: 120,  
  unit: 'metric'}));

/* ========================================================================== */
/* Load data                                                                  */
/* ========================================================================== */
// communes de l'EPCI du Golfe du morbihan
const com = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-commune/exports/geojson?lang=en&refine=epci_name%3A%22CA%20Golfe%20du%20Morbihan%20-%20Vannes%20Agglom%C3%A9ration%22&facet=facet(name%3D%22epci_name%22%2C%20disjunctive%3Dtrue)&timezone=Europe%2FBerlin"

map.on('load', () => {
  // add communes
  map.addLayer({
    "id": "comLigne",
    "type": "line",
    "source": {
      'type': 'geojson',
      "data": com,
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      "line-color": "Black",
      "line-width": 1,
    },
    'minZoom': 10,
    'maxZoom': 13
  });

  // add avex tilset
  // TODO: add source
  map.addLayer({
    "id": "avex",
    "type": "raster",
    "source": {
      'type': 'raster',
      'scheme': "tms",
      'tiles': [
        'http://www.antoineld.fr/avex/avex_tiles/{z}/{x}/{y}.png'
      ],
      'tileSize': 256,
      'attribution': 'Ajouter la source...'
    },
    "paint": { 'raster-opacity': 0.5 },
    'minZoom': 10,
    'maxZoom': 14
  });
});

/* ========================================================================== */
/* Control Layers
/* ========================================================================== */

// After the last frame rendered before the map enters an "idle" state.
// From MapBox doc
map.on('idle', () => {
  // If these two layers were not added to the map, abort
  if (!map.getLayer('comLigne') || !map.getLayer('avex')) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = ['comLigne', 'avex'];

  // Set up the corresponding toggle button for each layer.
  for (const id of toggleableLayerIds) {
    // Skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // Create a link.
    const link = document.createElement('a');
    link.id = id;
    link.href = '#';
    link.textContent = id;
    link.className = 'active';

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
      const clickedLayer = this.textContent;
      e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(
        clickedLayer,
        'visibility'
      );

      // Toggle layer visibility by changing the layout object's visibility property.
      if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(
          clickedLayer,
          'visibility',
          'visible'
        );
      }
    };

    const layers = document.getElementById('menu');
    layers.appendChild(link);
  }
});

/* ========================================================================== */
/* Markers                                                                    */
/* ========================================================================== */

/* ========================================================================== */
/* Popup                                                                      */
/* ========================================================================== */
