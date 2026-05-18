import { Map, Marker, Overlay } from 'pigeon-maps';
import { useCallback } from 'react';
import { View, Text } from 'react-native';

import { DEFAULT_REGION } from './MapView.types';

function regionToCenter(region) {
  return [region.latitude, region.longitude];
}

function deltaToZoom(latitudeDelta) {
  return Math.round(Math.log2(360 / latitudeDelta));
}

// ---------------------------------------------------------------------------
// Tile providers
// ---------------------------------------------------------------------------
function tileProvider(mapType) {
  if (mapType === 'satellite' || mapType === 'hybrid') {
    return (x, y, z) =>
      `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
  }
  if (mapType === 'terrain') {
    return (x, y, z) => `https://a.tile.opentopomap.org/${z}/${x}/${y}.png`;
  }
  return undefined; // default OSM
}

// ---------------------------------------------------------------------------
// Marker color → hue for pigeon-maps default marker
// ---------------------------------------------------------------------------
const COLOR_HUE = {
  red: 0,
  orange: 30,
  yellow: 50,
  green: 120,
  cyan: 180,
  blue: 210,
  purple: 280,
};

export default function MapView({
  initialRegion = DEFAULT_REGION,
  region,
  onRegionChange,
  onRegionChangeComplete,
  mapType = 'standard',
  markers = [],
  polylines: _polylines = [],
  polygons: _polygons = [],
  circles: _circles = [],
  onPress,
  onMarkerPress,
  scrollEnabled = true,
  zoomEnabled = true,
  zoomLevel,
  minZoomLevel,
  maxZoomLevel,
  style,
  className,
}) {
  const activeRegion = region ?? initialRegion;
  const center = regionToCenter(activeRegion);
  const zoom = zoomLevel ?? deltaToZoom(activeRegion.latitudeDelta);

  const handleBoundsChange = useCallback(
    ({ center: c, zoom: z }) => {
      const latDelta = 360 / Math.pow(2, z);
      const newRegion = {
        latitude: c[0],
        longitude: c[1],
        latitudeDelta: latDelta,
        longitudeDelta: latDelta,
      };
      onRegionChange?.(newRegion);
      onRegionChangeComplete?.(newRegion);
    },
    [onRegionChange, onRegionChangeComplete],
  );

  const handleClick = useCallback(
    ({ latLng }) => {
      onPress?.({ coordinate: { latitude: latLng[0], longitude: latLng[1] } });
    },
    [onPress],
  );

  const provider = tileProvider(mapType);

  return (
    <View style={style} className={className}>
      <Map
        center={center}
        zoom={zoom}
        onBoundsChanged={handleBoundsChange}
        onClick={onPress ? handleClick : undefined}
        provider={provider}
        animate
        mouseEvents={scrollEnabled}
        touchEvents={scrollEnabled}
        minZoom={minZoomLevel}
        maxZoom={maxZoomLevel}
        zoomSnap={zoomEnabled}
        height={
          typeof style === 'object' &&
          style !== null &&
          'height' in style &&
          typeof style.height === 'number'
            ? style.height
            : 400
        }
      >
        {markers.map((marker, index) => (
          <Marker
            key={marker.id ?? index}
            anchor={[marker.coordinate.latitude, marker.coordinate.longitude]}
            color={`hsl(${COLOR_HUE[marker.color ?? 'red'] ?? 0}, 80%, 50%)`}
            onClick={onMarkerPress ? () => onMarkerPress(marker) : undefined}
          />
        ))}
        {markers
          .filter((m) => m.title)
          .map((marker, index) => (
            <Overlay
              key={`overlay-${marker.id ?? index}`}
              anchor={[marker.coordinate.latitude, marker.coordinate.longitude]}
              offset={[0, -40]}
            >
              <Text
                style={{
                  backgroundColor: 'white',
                  padding: 4,
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                {marker.title}
              </Text>
            </Overlay>
          ))}
      </Map>
    </View>
  );
}
