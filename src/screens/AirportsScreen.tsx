import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../components/BrandLogo';
import { AIRPORTS, ALL_AIRPORT_OPTIONS, normalizeText } from '../data/airports';
import { COLORS } from '../theme/colors';
import { AirportOption } from '../types/flight';

interface AirportsScreenProps {
  onSelectAsOrigin: (option: AirportOption) => void;
  onSelectAsDestination: (option: AirportOption) => void;
}

type AirportTabFilter = 'todos' | 'nacional' | 'internacional' | 'agrupados';

export const AirportsScreen: React.FC<AirportsScreenProps> = ({
  onSelectAsOrigin,
  onSelectAsDestination,
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AirportTabFilter>('todos');

  const stats = useMemo(() => {
    const national = AIRPORTS.filter((a) => a.category === 'nacional').length;
    const international = AIRPORTS.filter((a) => a.category === 'internacional').length;
    const groups = ALL_AIRPORT_OPTIONS.filter((o) => o.isGroup).length;
    return { total: AIRPORTS.length, national, international, groups };
  }, []);

  const filteredList = useMemo(() => {
    const norm = normalizeText(query);
    return ALL_AIRPORT_OPTIONS.filter((opt) => {
      if (filter === 'nacional' && opt.category !== 'nacional') return false;
      if (filter === 'internacional' && opt.category !== 'internacional') return false;
      if (filter === 'agrupados' && !opt.isGroup) return false;
      if (norm && !opt.searchText.includes(norm)) return false;
      return true;
    });
  }, [query, filter]);

  const filterChips: Array<{ key: AirportTabFilter; label: string }> = [
    { key: 'todos', label: `Todos (${ALL_AIRPORT_OPTIONS.length})` },
    { key: 'nacional', label: `Nacionais (${stats.national})` },
    { key: 'internacional', label: `Internacionais (${stats.international})` },
    { key: 'agrupados', label: `Agrupados (${stats.groups})` },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <BrandLogo
          compact
          subtitle={`${stats.total} aeroportos individuais + ${stats.groups} opções agrupadas para cidades com múltiplos aeroportos`}
        />
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Filtrar por cidade, país, nome ou código IATA..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      <View style={styles.chipsRow}>
        {filterChips.map((chip) => {
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
        data={filteredList}
        keyExtractor={(item) => `${item.isGroup ? 'G' : 'A'}-${item.code}`}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, item.isGroup && styles.groupCard]}>
            <View style={styles.itemTop}>
              <View style={[styles.codeBox, item.isGroup && styles.groupCodeBox]}>
                <Text style={[styles.codeText, item.isGroup && styles.groupCodeText]}>
                  {item.code}
                </Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.cityText}>
                  {item.city}
                  {item.state ? `, ${item.state}` : ''} — {item.country}
                </Text>
                <Text style={styles.nameText}>{item.name}</Text>
                <View style={styles.tagsRow}>
                  {item.isGroup && (
                    <View style={styles.groupTag}>
                      <Ionicons name="layers" size={11} color={COLORS.primary} />
                      <Text style={styles.groupTagText}>
                        Agrupado: {item.groupedCodes.join(', ')}
                      </Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.catTag,
                      item.category === 'nacional' ? styles.catNac : styles.catInt,
                    ]}
                  >
                    <Text
                      style={[
                        styles.catText,
                        item.category === 'nacional' ? styles.catTextNac : styles.catTextInt,
                      ]}
                    >
                      {item.category === 'nacional' ? 'Nacional' : 'Internacional'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.quickActions}>
              <Pressable
                onPress={() => onSelectAsOrigin(item)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
              >
                <Ionicons name="airplane-outline" size={14} color={COLORS.primary} />
                <Text style={styles.actionText}>Usar como Origem</Text>
              </Pressable>
              <Pressable
                onPress={() => onSelectAsDestination(item)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.actionPressed]}
              >
                <Ionicons name="location-outline" size={14} color={COLORS.accent} />
                <Text style={[styles.actionText, { color: COLORS.accent }]}>Usar como Destino</Text>
              </Pressable>
            </View>
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 10,
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
  itemCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  groupCard: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryBorder,
  },
  itemTop: {
    flexDirection: 'row',
    gap: 12,
  },
  codeBox: {
    width: 52,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupCodeBox: {
    backgroundColor: COLORS.navy,
  },
  codeText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  groupCodeText: {
    color: COLORS.white,
  },
  itemInfo: {
    flex: 1,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  nameText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  groupTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  groupTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  catTag: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 99,
  },
  catNac: {
    backgroundColor: COLORS.accentSoft,
  },
  catInt: {
    backgroundColor: COLORS.warningSoft,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
  },
  catTextNac: {
    color: COLORS.accent,
  },
  catTextInt: {
    color: COLORS.warning,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionPressed: {
    opacity: 0.75,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
