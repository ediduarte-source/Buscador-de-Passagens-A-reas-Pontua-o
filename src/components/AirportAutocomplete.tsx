import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { searchAirportOptions } from '../data/airports';
import { COLORS } from '../theme/colors';
import { AirportOption, CategoryFilter } from '../types/flight';

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: AirportOption | null;
  categoryFilter: CategoryFilter;
  onSelect: (option: AirportOption) => void;
  iconName: 'airplane-outline' | 'location-outline';
}

export const AirportAutocomplete: React.FC<AirportAutocompleteProps> = ({
  label,
  placeholder,
  value,
  categoryFilter,
  onSelect,
  iconName,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => searchAirportOptions(query, categoryFilter, 30),
    [query, categoryFilter],
  );

  const handleOpen = () => {
    setQuery('');
    setModalVisible(true);
  };

  const handlePick = (option: AirportOption) => {
    onSelect(option);
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={handleOpen}
        style={({ pressed }) => [styles.inputBox, pressed && styles.inputBoxPressed]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? `${value.city} (${value.code})` : placeholder}`}
      >
        <Ionicons name={iconName} size={20} color={COLORS.primary} style={styles.leftIcon} />
        <View style={styles.valueArea}>
          {value ? (
            <>
              <View style={styles.valueRow}>
                <Text style={styles.cityText} numberOfLines={1}>
                  {value.city}
                </Text>
                <View style={[styles.codePill, value.isGroup && styles.groupCodePill]}>
                  <Text style={[styles.codePillText, value.isGroup && styles.groupCodePillText]}>
                    {value.code}
                  </Text>
                </View>
              </View>
              <Text style={styles.subText} numberOfLines={1}>
                {value.isGroup
                  ? `Todos os aeroportos (${value.groupedCodes.join(', ')})`
                  : value.name}
              </Text>
            </>
          ) : (
            <Text style={styles.placeholderText}>{placeholder}</Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={18} color={COLORS.textMuted} />
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar {label.toLowerCase()}</Text>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Digite cidade, aeroporto ou código IATA (ex: São Paulo, GRU, LIS)"
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
            {query.length > 0 && (
              <Pressable onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </Pressable>
            )}
          </View>

          <View style={styles.hintRow}>
            <Ionicons name="layers-outline" size={14} color={COLORS.primary} />
            <Text style={styles.hintText}>
              Cidades com mais de um aeroporto exibem também a opção agrupada (Todos os aeroportos).
            </Text>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => `${item.isGroup ? 'G' : 'A'}-${item.code}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="search-outline" size={32} color={COLORS.textMuted} />
                <Text style={styles.emptyTitle}>Nenhum aeroporto encontrado</Text>
                <Text style={styles.emptySubtitle}>
                  Tente buscar pelo nome da cidade, país ou sigla IATA (ex: GRU, GIG, MIA, LIS).
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handlePick(item)}
                style={({ pressed }) => [
                  styles.optionRow,
                  item.isGroup && styles.groupOptionRow,
                  pressed && styles.optionRowPressed,
                ]}
              >
                <View style={[styles.optionBadge, item.isGroup && styles.groupOptionBadge]}>
                  <Text style={[styles.optionCode, item.isGroup && styles.groupOptionCode]}>
                    {item.code}
                  </Text>
                </View>

                <View style={styles.optionInfo}>
                  <View style={styles.optionTitleRow}>
                    <Text style={styles.optionCity} numberOfLines={1}>
                      {item.city}
                      {item.state ? `, ${item.state}` : ''} — {item.country}
                    </Text>
                  </View>
                  <Text style={styles.optionName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.tagRow}>
                    {item.isGroup && (
                      <View style={styles.groupTag}>
                        <Ionicons name="layers" size={11} color={COLORS.primary} />
                        <Text style={styles.groupTagText}>
                          Todos os aeroportos ({item.groupedCodes.length})
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.catTag,
                        item.category === 'nacional' ? styles.catTagNac : styles.catTagInt,
                      ]}
                    >
                      <Text
                        style={[
                          styles.catTagText,
                          item.category === 'nacional' ? styles.catTagTextNac : styles.catTagTextInt,
                        ]}
                      >
                        {item.category === 'nacional' ? 'Nacional' : 'Internacional'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={18} color={COLORS.borderStrong} />
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 58,
  },
  inputBoxPressed: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  leftIcon: {
    marginRight: 10,
  },
  valueArea: {
    flex: 1,
    marginRight: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cityText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flexShrink: 1,
  },
  codePill: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  groupCodePill: {
    backgroundColor: COLORS.navy,
  },
  codePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
  },
  groupCodePillText: {
    color: COLORS.white,
  },
  subText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 2,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  hintText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  groupOptionRow: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primaryBorder,
  },
  optionRowPressed: {
    opacity: 0.85,
  },
  optionBadge: {
    width: 52,
    height: 44,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupOptionBadge: {
    backgroundColor: COLORS.navy,
  },
  optionCode: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  groupOptionCode: {
    color: COLORS.white,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCity: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  optionName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  catTagNac: {
    backgroundColor: COLORS.accentSoft,
  },
  catTagInt: {
    backgroundColor: COLORS.warningSoft,
  },
  catTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  catTagTextNac: {
    color: COLORS.accent,
  },
  catTagTextInt: {
    color: COLORS.warning,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
  },
});
