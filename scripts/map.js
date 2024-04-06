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
// Data urls
const u_com = "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-commune/exports/geojson?lang=en&refine=epci_name%3A%22CA%20Golfe%20du%20Morbihan%20-%20Vannes%20Agglom%C3%A9ration%22&facet=facet(name%3D%22epci_name%22%2C%20disjunctive%3Dtrue)&timezone=Europe%2FBerlin"
const u_znieff = "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=PROTECTEDAREAS.ZNIEFF1:znieff1&cql_filter=id_mnhn%20IN%20(%27530002621%27,%27530030148%27)&outputFormat=application/json&srsName=epsg:4326"
const u_pnr = "https://data.geopf.fr/wfs/ows?SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAME=PROTECTEDAREAS.PNR:pnr&cql_filter=id_mnhn=%27FR8000051%27&outputFormat=application/json&srsName=epsg:4326"
const u_avex = "http://www.antoineld.fr/avex/avex_tiles/{z}/{x}/{y}.png"
const u_trame = 'http://www.antoineld.fr/trame_noire/trame_noire_audit_4326.geojson'
const pts_obs = 'http://antoineld.fr/popup/arret_voir_v2.geojson'

map.on('load', () => {
  // add communes
  map.addLayer({
    "id": "comLigne",
    "type": "line",
    "source": {
      'type': 'geojson',
      "data": u_com,
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
      'tiles': [u_avex],
      'tileSize': 256,
      'attribution': 'Ajouter la source...'
    },
    "paint": { 'raster-opacity': 0.5 },
    'minZoom': 10,
    'maxZoom': 14
  });

  // Add trame noire
  // TODO: add source
  map.addLayer({
    "id": "trameNoire",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": u_trame,
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
      ],
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

  // add PNR
  // TODO: add source
  map.addLayer({
    "id": "pnr",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": u_pnr,
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      'fill-color': "Green",
      'fill-opacity': 0.5
    },
    'minZoom': 10,
    'maxZoom': 14
  });

  // add points
  map.addLayer({
    "id": "pts",
    "type": "circle",
    "source": {
      'type': 'geojson',
      "data": pts_obs,
    },
    "layout": {'visibility': 'visible'},
    'minZoom': 10,
    'maxZoom': 14
  });

  map.on('click', 'pts', (e) => {
    // Retrieve data
    var ptObs       = e.features[0].properties.pts_obs;
    var whatDoWeSee = e.features[0].properties.what_do_we_see;
    var explain     = e.features[0].properties.explain;
    var howToAct    = e.features[0].properties.how_to_act;
    var doYouKnow   = e.features[0].properties.do_u_know;

    var dictId = {
      "pt-obs": ptObs,
      "what-do-we-see": whatDoWeSee,
      "explain": explain,
      "how-to-act": howToAct,
      "do-you-know": doYouKnow,
    };

    // Convert to list if any
    for (let key in dictId) {
      dictId[key] = toList(dictId[key])
    }

    // for each var set html
    $("#info-main").hide();
    for (let key in dictId) {
      $("#" + key).html(dictId[key]);
    }
    $("#infos-pts").css("display", "flex");
  });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.on('mouseenter', 'pts', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'pts', () => {
    map.getCanvas().style.cursor = '';
  });
});

/* ========================================================================== */
/* Control Layers
/* ========================================================================== */

// After the last frame rendered before the map enters an "idle" state.
// From MapBox doc
map.on('idle', () => {
  // If these two layers were not added to the map, abort
  if ( !map.getLayer('comLigne') || !map.getLayer('avex') || !map.getLayer('trameNoire') || !map.getLayer('pnr') || !map.getLayer('znieff') || !map.getLayer('pts') ) {
    return;
  }

  // Enumerate ids of the layers.
  const toggleableLayerIds = [
    'comLigne',
    'avex',
    'trameNoire',
    'znieff', 
    'pnr',
    'pts'
  ];

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
