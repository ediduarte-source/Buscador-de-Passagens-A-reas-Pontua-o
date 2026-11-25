import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AIRPORT_OPTION_BY_CODE } from './src/data/airports';
import { AirportsScreen } from './src/screens/AirportsScreen';
import { ProgramsScreen } from './src/screens/ProgramsScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { COLORS } from './src/theme/colors';
import { AirportOption } from './src/types/flight';

type AppTab = 'search' | 'airports' | 'programs';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('search');
  const [origin, setOrigin] = useState<AirportOption | null>(AIRPORT_OPTION_BY_CODE.SAO ?? null);
  const [destination, setDestination] = useState<AirportOption | null>(
    AIRPORT_OPTION_BY_CODE.RIO ?? null,
  );

  const handleSelectOriginFromList = (option: AirportOption) => {
    setOrigin(option);
    setActiveTab('search');
  };

  const handleSelectDestinationFromList = (option: AirportOption) => {
    setDestination(option);
    setActiveTab('search');
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar style="light" />

        <View style={styles.appShell}>
          <View style={styles.body}>
            {activeTab === 'search' && (
              <SearchScreen
                origin={origin}
                destination={destination}
                onChangeOrigin={setOrigin}
                onChangeDestination={setDestination}
              />
            )}
            {activeTab === 'airports' && (
              <AirportsScreen
                onSelectAsOrigin={handleSelectOriginFromList}
                onSelectAsDestination={handleSelectDestinationFromList}
              />
            )}
            {activeTab === 'programs' && <ProgramsScreen />}
          </View>

          {/* Barra de Navegação Inferior (Android / iOS / Web) */}
          <View style={styles.tabBar}>
            {[
              { key: 'search' as const, label: 'Buscar', icon: 'search' as const },
              { key: 'airports' as const, label: 'Aeroportos', icon: 'map-outline' as const },
              { key: 'programs' as const, label: 'Programas', icon: 'card-outline' as const },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <Pressable
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  style={styles.tabItem}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <Ionicons
                    name={tab.icon}
                    size={21}
                    color={active ? COLORS.primary : COLORS.textMuted}
                  />
                  <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.navy,
  },
  appShell: {
    flex: 1,
    backgroundColor: COLORS.bg,
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
  },
  body: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
});
