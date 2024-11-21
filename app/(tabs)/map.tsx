import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import MapView, { Marker } from 'react-native-maps';
import { useEffect, useRef, useState } from 'react';

interface IMarker {
  latitude: number,
  longitude: number,
  id: string
}

export default function ProfileScreen() {

  const [markers, setMarkers] = useState<Array<IMarker>>([]);

  const addMarker = ({ latitude, longitude }: { latitude: number, longitude: number }) => {
    setMarkers(prevMarkers => [
      ...prevMarkers,
      { latitude, longitude, id: `marker-${new Date().getTime()}` } // Assumes no two markers are added at the exact same millisecond
    ]);
  }

  useEffect(() => console.log(markers), [markers])

  return (
    <ThemedView style={{ flex: 1 }}>
      <MapView style={{
        width: '100%',
        height: '100%',
      }}
        onLongPress={(e) => addMarker(e.nativeEvent.coordinate)}
      >
        {markers.map(({ latitude, longitude, id }) => <Marker key={id} coordinate={{ latitude, longitude }} pinColor='purple' />)}
      </MapView>

    </ThemedView>
  );
}
