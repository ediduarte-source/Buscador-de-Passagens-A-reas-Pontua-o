import React, { useMemo, useState } from 'react';
import { FlatList, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../components/BrandLogo';
import { AIRLINE_PROGRAMS, BANK_PROGRAMS, LOYALTY_PROGRAMS } from '../data/programs';
import { COLORS } from '../theme/colors';
import { ProgramType } from '../types/flight';

async function openUrl(url: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}

export const ProgramsScreen: React.FC = () => {
  const [filter, setFilter] = useState<'all' | ProgramType>('all');

  const programs = useMemo(() => {
    if (filter === 'airline') return AIRLINE_PROGRAMS;
    if (filter === 'bank') return BANK_PROGRAMS;
    return LOYALTY_PROGRAMS;
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <BrandLogo
          compact
          subtitle={`${AIRLINE_PROGRAMS.length} companhias aéreas e ${BANK_PROGRAMS.length} programas de pontos (Livelo, Esfera, C6 Átomos e mais)`}
        />
      </View>

      <View style={styles.chipsRow}>
        {[
          { key: 'all' as const, label: `Todos (${LOYALTY_PROGRAMS.length})` },
          { key: 'airline' as const, label: `Companhias Aéreas (${AIRLINE_PROGRAMS.length})` },
          { key: 'bank' as const, label: `Bancos & Cartões (${BANK_PROGRAMS.length})` },
        ].map((chip) => {
          const active = filter === chip.key;
          return (
            <Pressable
              key={chip.key}
              onPress={() => setFilter(chip.key)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={programs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={[styles.badge, { backgroundColor: item.color }]}>
                <Text style={[styles.badgeText, { color: item.textColor }]}>{item.shortName}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {item.type === 'bank' ? 'Programa de Pontos / Banco' : 'Companhia Aérea'} • Moeda:{' '}
                  {item.currencyName}
                </Text>
              </View>
            </View>

            <Text style={styles.description}>{item.description}</Text>

            {item.transferRatio && (
              <View style={styles.ratioRow}>
                <Ionicons name="swap-horizontal" size={14} color={COLORS.primary} />
                <Text style={styles.ratioText}>Conversão: {item.transferRatio}</Text>
              </View>
            )}

            {item.partners && item.partners.length > 0 && (
              <Text style={styles.partnersText}>
                Parceiros: {item.partners.join(' • ')}
              </Text>
            )}

            <Pressable
              onPress={() => openUrl(item.baseUrl)}
              style={({ pressed }) => [styles.linkBtn, pressed && styles.linkBtnPressed]}
            >
              <Text style={styles.linkBtnText}>Acessar site oficial</Text>
              <Ionicons name="open-outline" size={15} color={COLORS.primary} />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerBanner: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 3,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  chip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  meta: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 10,
    lineHeight: 19,
  },
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratioText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  partnersText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
  },
  linkBtnPressed: {
    opacity: 0.8,
  },
  linkBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
