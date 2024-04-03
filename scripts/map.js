/* ========================================================================== */
/* Instantiate map                                                            */
/* ========================================================================== */
const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [-2.71131, 47.70301],
  zoom: 12.5,
  scrollZoom: true,
  minZoom: 9,
  maxBounds: [
    [-2.85, 47.65], // W-S coordinates
    [-2.62, 47.77] // E-N coordinates
  ]
});

/* ========================================================================== */
/* Load data                                                                  */
/* ========================================================================== */
// communes de l'EPCI du Golfe du morbihan
const com = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-commune/exports/geojson?lang=en&refine=epci_name%3A%22CA%20Golfe%20du%20Morbihan%20-%20Vannes%20Agglom%C3%A9ration%22&facet=facet(name%3D%22epci_name%22%2C%20disjunctive%3Dtrue)&timezone=Europe%2FBerlin"
const u_znieff = "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=PROTECTEDAREAS.ZNIEFF1:znieff1&cql_filter=id_mnhn%20IN%20(%27530002621%27,%27530030148%27)&outputFormat=application/json&srsName=epsg:4326"

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

  // Add trame noire
  map.addLayer({
    "id": "trameNoire",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": 'http://www.antoineld.fr/trame_noire/trame_noire_audit_4326.geojson',
      'attribution': 'Ajouter la source...'
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      'fill-color': [
        'match',
        // get the property
        ['get', 'layer'],
        // if 'GP' then yellow
        'type1', 'yellow',
        // if 'XX' then black 
        'type2', 'Blue',
        // else
        'Red',
      ],                     // white otherwise
      'fill-outline-color': 'white',
      'fill-opacity': 0.5
    },
    'minZoom': 10,
    'maxZoom': 14
  });

  // add znieff I
  // TODO: add source
  map.addLayer({
    "id": "znieff",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": u_znieff,
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      'fill-color': "Red",
      'fill-opacity': 1
    },
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
  if (!map.getLayer('comLigne') || !map.getLayer('avex') || !map.getLayer('trameNoire')) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = ['comLigne', 'avex', 'trameNoire'];

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
