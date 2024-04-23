/* ========================================================================== */
/* Instantiate map                                                            */
/* ========================================================================== */
// AccesToken de Antoine_S
mapboxgl.accessToken = 'pk.eyJ1IjoiYW50b2luZTIzMDgiLCJhIjoiY2xza2RzcjdkMDI5OTJpbjJjM3ZxNms4dSJ9.4aUmIGBpfmffjyo55jozIg';

// Mise en place du fond de carte jour 
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/antoine2308/clugqndnn00k201r5ep748gxl',
  center: [-2.742331, 47.699998],
  zoom: 11.7,
  scrollZoom: true,
  customAttribution: '<a href="https://esigat.wordpress.com/" target="_blank"> Master SIGAT</a>',
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
const u_avex = "https://www.antoineld.fr/avex/avex_tiles/{z}/{x}/{y}.png"
const u_trame = 'https://www.antoineld.fr/trame_noire/trame_noire_audit_4326.geojson'
const pts_obs = 'https://antoineld.fr/popup/arret_voir_v2.geojson'

map.on('load', () => {
  // add communes
  map.addLayer({
    "id": "comLigne",
    "type": "line",
    "source": {
      'type': 'geojson',
      "data": u_com,
      'attribution': 'IGN, 2024'
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
  map.addLayer({
    "id": "avex",
    "type": "raster",
    "source": {
      'type': 'raster',
      'scheme': "tms",
      'tiles': [u_avex],
      'tileSize': 256,
      'attribution': '<a href="https://www.avex-asso.org/dossiers/wordpress/la-pollution-lumineuse-light-pollution/carte-de-pollution-lumineuse-2023-crise-energetique" target="_blank">Avex, 2023, Carte de pollution lumineuse (crise énergétique)</a>'
    },
    "layout": {'visibility': 'none'},
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
      "data": u_trame,
      'attribution': 'Master AUDIT (Rennes 2), 2024'
    },
    "layout": {'visibility': 'visible'},
    "paint": {
      'fill-color': [
        'match',
        // get the property
        ['get', 'layer'],
        // if 'GP' then yellow
        'type1', '#e1b86b',
        // if 'XX' then black 
        'type2', '#4f4b44',
        // else
        '#7e785c',
      ],
      'fill-outline-color': 'white',
      'fill-opacity': 0.8
    },
    'minZoom': 10,
    'maxZoom': 14
  });

  // add znieff I
  map.addLayer({
    "id": "znieff",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": u_znieff,
      'attribution': 'INPN, 2024'
    },
    "layout": {'visibility': 'none'},
    "paint": {
      'fill-color': "#14b485",
      'fill-opacity': 1
    },
    'minZoom': 10,
    'maxZoom': 14
  });

  // add PNR
  map.addLayer({
    "id": "pnr",
    "type": "fill",
    "source": {
      'type': 'geojson',
      "data": u_pnr,
      'attribution': 'INPN, 2024'
    },
    "layout": {'visibility': 'none'},
    "paint": {
      'fill-color': "#f37043",
      'fill-opacity': 0.5
    },
    'minZoom': 10,
    'maxZoom': 14
  });

  // add points
  map.addLayer({
    "id": "pts",
    "type": "circle",
    "width": "3px",
    "source": {
      'type': 'geojson',
      "data": pts_obs,
      'attribution': 'Master AUDIT (Rennes 2), 2024'
    },
    "paint": {
      "circle-color": "green",
      "circle-radius": 6,
      "circle-stroke-color": "#fff",
      "circle-stroke-width": 1
    },
    "layout": {'visibility': 'visible'},
    'minZoom': 10,
    'maxZoom': 14
    
  });

  map.on('click', 'pts', (e) => {
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
});

/* ========================================================================== */
/* Popup                                                                      */
/* ========================================================================== */
var popup = new maplibregl.Popup({
  offset: [0, -7],
  closeButton: false,
  closeOnClick: false
});

map.on('mouseenter', 'pts', function(e) {
  map.getCanvas().style.cursor = 'pointer';

  var coordinates = e.features[0].geometry.coordinates.slice();
  var title = e.features[0].properties.pts_obs;
  var img_path = e.features[0].properties.img_path;

  while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
  }

  // set popup
  popup
  .setLngLat(coordinates)
  .setHTML('<h3>' + title + '</h3><img src="' + img_path + '"><p>Cliquez pour en savoir plus !</p>' )
  .addTo(map);
});

map.on('mouseleave', 'pts', function() {
  map.getCanvas().style.cursor = '';
  popup.remove();
});

/* ========================================================================== */
/* Control Layers
/* ========================================================================== */

  // Écouteurs d'événements pour les cases à cocher
document.querySelectorAll('.menu_overlay input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    const layerId = this.id;
    if (this.checked) {
      map.setLayoutProperty(layerId, 'visibility', 'visible');
    } else {
      map.setLayoutProperty(layerId, 'visibility', 'none');
    }
  });
});

/* ========================================================================== */
/* Onglet carto
/* ========================================================================== */
// Configuration onglets géographiques 
document.getElementById('vuegloable').addEventListener('click', function () 
  { map.flyTo({zoom: 12,
    center: [-2.742331, 47.699998 ],
    pitch: 0,
    bearing:0 });
  });

document.getElementById('bois').addEventListener('click', function () 
  { map.flyTo({zoom: 16,
    center: [-2.751221, 47.694752 ],
    pitch: 20,
    bearing: 0 });
  });

document.getElementById('etangs').addEventListener('click', function () 
  { map.flyTo({zoom: 16,
    center: [-2.746786, 47.692948],
    pitch: 20,
    bearing: 360 });
  });

document.getElementById('ciel').addEventListener('click', function () 
  { map.flyTo({zoom: 16,
    center: [-2.736941, 47.690422 ],
    pitch: 20,
    bearing: 0 });
  });
