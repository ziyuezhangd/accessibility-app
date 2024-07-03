import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { BottomNavigation, PaperProvider, useTheme } from 'react-native-paper';
import { darkTheme, lightTheme } from './theme';
import FavoritesBottomPanel from './bottomPanels/FavoritesBottomPanel';
import PlacesBottomPanel from './bottomPanels/PlacesBottomPanel';
import RecentsBottomPanel from './bottomPanels/RecentsBottomPanel';
import PredictionsBottomPanel from './bottomPanels/PredictionsBottomPanel';
import Map from './Map';

import BottomSheet, { BottomSheetFooter } from '@gorhom/bottom-sheet';
import { BottomSheetDefaultFooterProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetFooter/types';

import { getPlaceInfos } from './services/PlaceInfoApi';
import { PlaceInfo } from './interfaces/PlaceInfo';
import { GoogleMapProvider } from './providers/MapProvider';
import { UserDataProvider } from './providers/UserDataProvider';

// TODO: attribute: hotpot.ai/art-generator

const styles = StyleSheet.create({
  // container: {
  //   ...StyleSheet.absoluteFillObject,
  //   height: 400,
  //   width: 400,
  //   justifyContent: 'flex-end',
  //   alignItems: 'center',
  // },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  footerContainer: {
    padding: 12,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#80f',
  },
  footerText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '800',
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

export default function Index() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const [index, setIndex] = useState(1);
  const [selectedRoute, setSelectedRoute] = useState('favorites');
  const [routes] = useState([
    { key: 'favorites', title: 'Favorites', focusedIcon: 'heart', unfocusedIcon: 'heart-outline' },
    { key: 'places', title: 'Places', focusedIcon: 'store-marker', unfocusedIcon: 'store-marker-outline' },
    { key: 'recents', title: 'Recents', focusedIcon: 'history' },
    { key: 'predictions', title: 'Predictions', focusedIcon: 'crystal-ball' },
  ]);
  const [placeInfos, setPlaceInfos] = useState<PlaceInfo[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const places = await getPlaceInfos();
      setPlaceInfos(places);
      console.log('Place info loaded');
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const selectedRoute = routes[index];
    setSelectedRoute(selectedRoute.key);
  }, [index]);

  // callbacks
  const handleSheetChange = useCallback((sheetIndex: any) => {
    console.log('handleSheetChange', sheetIndex);
  }, []);

  // Since we aren't actually re-routing anywhere, just render nothing
  const renderScene = BottomNavigation.SceneMap({
    favorites: () => <></>,
    places: () => <></>,
    recents: () => <></>,
    predictions: () => <></>,
  });

  // renders
  const renderFooterComponent = useCallback(
    (
      props: React.JSX.IntrinsicAttributes & BottomSheetDefaultFooterProps,
      index: number // index is here to trigger this being called again so the nav is highlighted
    ) => (
      <BottomSheetFooter {...props}>
        <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />
      </BottomSheetFooter>
    ),
    []
  );

  return (
    <SafeAreaProvider>
      <UserDataProvider>
        <GoogleMapProvider>
          <View style={{ flexGrow: 1, paddingTop: insets.top }}>
            <Map />
          </View>
          <BottomSheet
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            animateOnMount={true}
            onChange={handleSheetChange}
            footerComponent={(e) => renderFooterComponent(e, index)}
            backgroundStyle={{ backgroundColor: theme.colors.background }}
            handleIndicatorStyle={{ backgroundColor: theme.colors.secondary }}
          >
            <View style={styles.contentContainer}>
              {selectedRoute === 'favorites' && <FavoritesBottomPanel />}
              {selectedRoute === 'places' && <PlacesBottomPanel placeInfos={placeInfos} />}
              {selectedRoute === 'recents' && <RecentsBottomPanel />}
              {selectedRoute === 'predictions' && <PredictionsBottomPanel />}
            </View>
          </BottomSheet>
        </GoogleMapProvider>
      </UserDataProvider>
    </SafeAreaProvider>
  );
}
