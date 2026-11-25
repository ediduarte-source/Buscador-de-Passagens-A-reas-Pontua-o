import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AirportAutocomplete } from '../components/AirportAutocomplete';
import { BrandLogo } from '../components/BrandLogo';
import { DatePickerModal } from '../components/DatePickerModal';
import { FlightOfferCard } from '../components/FlightOfferCard';
import { AIRPORT_OPTION_BY_CODE } from '../data/airports';
import { filterAndSortOffers, searchFlightsByPoints } from '../services/flightSearchEngine';
import { COLORS } from '../theme/colors';
import {
  AirportOption,
  CabinClass,
  CategoryFilter,
  ProgramType,
  SearchResultSummary,
  SortOption,
  TripType,
} from '../types/flight';
import {
  addDaysToIso,
  formatCurrencyBRL,
  formatDateBR,
  formatNumberBR,
  getTodayIso,
} from '../utils/dateUtils';

interface SearchScreenProps {
  origin: AirportOption | null;
  destination: AirportOption | null;
  onChangeOrigin: (opt: AirportOption) => void;
  onChangeDestination: (opt: AirportOption) => void;
}

const CABIN_OPTIONS: Array<{ key: CabinClass; label: string }> = [
  { key: 'economy', label: 'Econômica' },
  { key: 'premium_economy', label: 'Premium' },
  { key: 'business', label: 'Executiva' },
  { key: 'first', label: 'Primeira' },
];

const POPULAR_ROUTES: Array<{
  label: string;
  originCode: string;
  destCode: string;
  category: 'nacional' | 'internacional';
}> = [
  { label: 'São Paulo → Rio', originCode: 'SAO', destCode: 'RIO', category: 'nacional' },
  { label: 'São Paulo → Recife', originCode: 'SAO', destCode: 'REC', category: 'nacional' },
  { label: 'Brasília → Salvador', originCode: 'BSB', destCode: 'SSA', category: 'nacional' },
  { label: 'São Paulo → Lisboa', originCode: 'SAO', destCode: 'LIS', category: 'internacional' },
  { label: 'São Paulo → Miami', originCode: 'SAO', destCode: 'QMI', category: 'internacional' },
  { label: 'Rio → Buenos Aires', originCode: 'RIO', destCode: 'BUE', category: 'internacional' },
  { label: 'São Paulo → Paris', originCode: 'SAO', destCode: 'PAR', category: 'internacional' },
  { label: 'São Paulo → Nova York', originCode: 'SAO', destCode: 'NYC', category: 'internacional' },
];

export const SearchScreen: React.FC<SearchScreenProps> = ({
  origin,
  destination,
  onChangeOrigin,
  onChangeDestination,
}) => {
  const today = useMemo(() => getTodayIso(), []);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('todos');
  const [tripType, setTripType] = useState<TripType>('round-trip');
  const [departureDate, setDepartureDate] = useState<string>(() => addDaysToIso(today, 20));
  const [returnDate, setReturnDate] = useState<string>(() => addDaysToIso(today, 27));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState<CabinClass>('economy');

  const [dateModalMode, setDateModalMode] = useState<'departure' | 'return' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [summary, setSummary] = useState<SearchResultSummary | null>(null);

  // Filtros sobre os resultados
  const [programTypeFilter, setProgramTypeFilter] = useState<'all' | ProgramType>('all');
  const [onlyDirect, setOnlyDirect] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('points');

  const handleSwap = () => {
    if (!origin || !destination) return;
    const prevOrigin = origin;
    onChangeOrigin(destination);
    onChangeDestination(prevOrigin);
  };

  const handleDepartureSelect = (iso: string) => {
    setDepartureDate(iso);
    if (returnDate < iso) {
      setReturnDate(addDaysToIso(iso, 5));
    }
  };

  const handleApplyPopularRoute = (originCode: string, destCode: string) => {
    const o = AIRPORT_OPTION_BY_CODE[originCode];
    const d = AIRPORT_OPTION_BY_CODE[destCode];
    if (o && d) {
      onChangeOrigin(o);
      onChangeDestination(d);
      setErrorMsg(null);
    }
  };

  const handleSearch = () => {
    setErrorMsg(null);
    if (!origin || !destination) {
      setErrorMsg('Selecione os aeroportos de origem e destino para buscar.');
      return;
    }
    if (origin.code === destination.code) {
      setErrorMsg('A origem e o destino precisam ser diferentes.');
      return;
    }
    if (tripType === 'round-trip' && returnDate < departureDate) {
      setErrorMsg('A data de volta precisa ser igual ou posterior à data de ida.');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      try {
        const result = searchFlightsByPoints({
          origin,
          destination,
          departureDate,
          returnDate: tripType === 'round-trip' ? returnDate : undefined,
          tripType,
          adults,
          children,
          infants: 0,
          cabin,
          categoryFilter,
        });
        setSummary(result);
        setProgramTypeFilter('all');
        setOnlyDirect(false);
        setSortBy('points');
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao buscar passagens.');
      } finally {
        setIsSearching(false);
      }
    }, 180);
  };

  const visibleOffers = useMemo(() => {
    if (!summary) return [];
    return filterAndSortOffers(summary.offers, {
      programTypeFilter,
      maxStops: onlyDirect ? 0 : null,
      sortBy,
    });
  }, [summary, programTypeFilter, onlyDirect, sortBy]);

  const visiblePopularRoutes = useMemo(() => {
    if (categoryFilter === 'todos') return POPULAR_ROUTES;
    return POPULAR_ROUTES.filter((r) => r.category === categoryFilter);
  }, [categoryFilter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero Banner */}
      <View style={styles.hero}>
        <BrandLogo subtitle="Compare passagens por pontos em todas as companhias aéreas, Livelo, Esfera, C6 Átomos e bancos parceiros." />

        {/* Categorias: Todas / Nacionais / Internacionais */}
        <View style={styles.categoryTabs}>
          {[
            { key: 'todos' as const, label: 'Todas' },
            { key: 'nacional' as const, label: 'Nacionais' },
            { key: 'internacional' as const, label: 'Internacionais' },
          ].map((tab) => {
            const active = categoryFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setCategoryFilter(tab.key)}
                style={[styles.categoryTab, active && styles.categoryTabActive]}
              >
                <Text style={[styles.categoryTabText, active && styles.categoryTabTextActive]}>
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Card de Busca */}
      <View style={styles.searchCard}>
        {/* Tipo de viagem */}
        <View style={styles.tripTypeRow}>
          {[
            { key: 'round-trip' as const, label: 'Ida e volta' },
            { key: 'one-way' as const, label: 'Só ida' },
          ].map((item) => {
            const active = tripType === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => setTripType(item.key)}
                style={[styles.tripPill, active && styles.tripPillActive]}
              >
                <Text style={[styles.tripPillText, active && styles.tripPillTextActive]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Origem e Destino com Autocomplete + Swap */}
        <View style={styles.airportsStack}>
          <AirportAutocomplete
            label="Origem"
            placeholder="De onde você sai?"
            value={origin}
            categoryFilter={categoryFilter === 'nacional' ? 'nacional' : 'todos'}
            onSelect={onChangeOrigin}
            iconName="airplane-outline"
          />

          <View style={styles.swapWrapper}>
            <Pressable
              onPress={handleSwap}
              style={({ pressed }) => [styles.swapBtn, pressed && { opacity: 0.75 }]}
              accessibilityLabel="Inverter origem e destino"
            >
              <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
            </Pressable>
          </View>

          <AirportAutocomplete
            label="Destino"
            placeholder="Para onde você vai?"
            value={destination}
            categoryFilter={categoryFilter}
            onSelect={onChangeDestination}
            iconName="location-outline"
          />
        </View>

        {/* Datas */}
        <View style={styles.datesRow}>
          <Pressable
            onPress={() => setDateModalMode('departure')}
            style={styles.dateBox}
            accessibilityRole="button"
            accessibilityLabel={`Data de ida: ${formatDateBR(departureDate)}`}
          >
            <Text style={styles.fieldLabel}>DATA DE IDA</Text>
            <View style={styles.dateValueRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              <Text style={styles.dateValue}>{formatDateBR(departureDate)}</Text>
            </View>
          </Pressable>

          {tripType === 'round-trip' && (
            <Pressable
              onPress={() => setDateModalMode('return')}
              style={styles.dateBox}
              accessibilityRole="button"
              accessibilityLabel={`Data de volta: ${formatDateBR(returnDate)}`}
            >
              <Text style={styles.fieldLabel}>DATA DE VOLTA</Text>
              <View style={styles.dateValueRow}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                <Text style={styles.dateValue}>{formatDateBR(returnDate)}</Text>
              </View>
            </Pressable>
          )}
        </View>

        {/* Passageiros e Classe */}
        <View style={styles.paxRow}>
          <View style={styles.paxBox}>
            <Text style={styles.fieldLabel}>ADULTOS</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setAdults((a) => Math.max(1, a - 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="remove" size={16} color={COLORS.text} />
              </Pressable>
              <Text style={styles.stepValue}>{adults}</Text>
              <Pressable
                onPress={() => setAdults((a) => Math.min(9, a + 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="add" size={16} color={COLORS.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.paxBox}>
            <Text style={styles.fieldLabel}>CRIANÇAS</Text>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setChildren((c) => Math.max(0, c - 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="remove" size={16} color={COLORS.text} />
              </Pressable>
              <Text style={styles.stepValue}>{children}</Text>
              <Pressable
                onPress={() => setChildren((c) => Math.min(6, c + 1))}
                style={styles.stepBtn}
              >
                <Ionicons name="add" size={16} color={COLORS.text} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Classe */}
        <Text style={[styles.fieldLabel, { marginTop: 12 }]}>CLASSE DA CABINE</Text>
        <View style={styles.cabinRow}>
          {CABIN_OPTIONS.map((opt) => {
            const active = cabin === opt.key;
            return (
              <Pressable
                key={opt.key}
                onPress={() => setCabin(opt.key)}
                style={[styles.cabinChip, active && styles.cabinChipActive]}
              >
                <Text style={[styles.cabinChipText, active && styles.cabinChipTextActive]}>
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {/* Botão de Busca */}
        <Pressable
          onPress={handleSearch}
          disabled={isSearching}
          style={({ pressed }) => [
            styles.searchButton,
            pressed && styles.searchButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Buscar Passagens por Pontos"
        >
          {isSearching ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="search" size={19} color={COLORS.white} />
              <Text style={styles.searchButtonText}>Buscar Passagens por Pontos</Text>
            </>
          )}
        </Pressable>

        {/* Rotas populares rápidas */}
        <Text style={styles.popularLabel}>Rotas populares ({categoryFilter === 'todos' ? 'Nacionais & Internacionais' : categoryFilter})</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularRow}>
          {visiblePopularRoutes.map((route) => (
            <Pressable
              key={route.label}
              onPress={() => handleApplyPopularRoute(route.originCode, route.destCode)}
              style={styles.popularChip}
            >
              <Text style={styles.popularChipText}>{route.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Resultados Comparativos */}
      {summary && (
        <View style={styles.resultsSection}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>
                {summary.originLabel} → {summary.destinationLabel}
              </Text>
              <View
                style={[
                  styles.summaryBadge,
                  summary.category === 'nacional' ? styles.summaryBadgeNac : styles.summaryBadgeInt,
                ]}
              >
                <Text
                  style={[
                    styles.summaryBadgeText,
                    summary.category === 'nacional'
                      ? styles.summaryBadgeTextNac
                      : styles.summaryBadgeTextInt,
                  ]}
                >
                  {summary.category === 'nacional' ? 'Voo Nacional' : 'Voo Internacional'}
                </Text>
              </View>
            </View>

            <Text style={styles.summarySub}>
              Aeroportos consultados: {summary.searchedOriginCodes.join(', ')} →{' '}
              {summary.searchedDestinationCodes.join(', ')}
            </Text>

            <View style={styles.kpiRow}>
              <View style={[styles.kpiBox, styles.kpiBoxHighlight]}>
                <Text style={styles.kpiLabelHighlight}>Menor pontuação</Text>
                <Text style={styles.kpiValueHighlight}>{formatNumberBR(summary.lowestPoints)} pts</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>Menor preço</Text>
                <Text style={styles.kpiValue}>{formatCurrencyBRL(summary.lowestCashBRL)}</Text>
              </View>
              <View style={styles.kpiBox}>
                <Text style={styles.kpiLabel}>Programas</Text>
                <Text style={styles.kpiValue}>{summary.totalProgramsCompared}</Text>
              </View>
            </View>
          </View>

          {/* Filtros de resultado */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            {[
              { key: 'all' as const, label: `Todos (${summary.offers.length})` },
              { key: 'airline' as const, label: `Companhias (${summary.airlineOffersCount})` },
              { key: 'bank' as const, label: `Bancos & Pontos (${summary.bankOffersCount})` },
            ].map((f) => {
              const active = programTypeFilter === f.key;
              return (
                <Pressable
                  key={f.key}
                  onPress={() => setProgramTypeFilter(f.key)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {f.label}
                  </Text>
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => setOnlyDirect((d) => !d)}
              style={[styles.filterChip, onlyDirect && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, onlyDirect && styles.filterChipTextActive]}>
                Somente voo direto
              </Text>
            </Pressable>
          </ScrollView>

          {/* Ordenação */}
          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>
            {[
              { key: 'points' as const, label: 'Menor pontuação' },
              { key: 'cash' as const, label: 'Menor preço' },
              { key: 'value' as const, label: 'Custo-benefício' },
              { key: 'duration' as const, label: 'Menor duração' },
              { key: 'taxes' as const, label: 'Menor taxa' },
            ].map((opt) => {
              const active = sortBy === opt.key;
              return (
                <Pressable
                  key={opt.key}
                  onPress={() => setSortBy(opt.key)}
                  style={[styles.sortBtn, active && styles.sortBtnActive]}
                >
                  <Text style={[styles.sortBtnText, active && styles.sortBtnTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {visibleOffers.length === 0 ? (
            <View style={styles.emptyResults}>
              <Ionicons name="airplane-outline" size={28} color={COLORS.textMuted} />
              <Text style={styles.emptyResultsText}>
                Nenhuma oferta encontrada com esses filtros. Tente desmarcar &quot;Somente voo direto&quot;.
              </Text>
            </View>
          ) : (
            visibleOffers.map((offer, idx) => (
              <FlightOfferCard key={offer.id} offer={offer} rank={idx + 1} />
            ))
          )}
        </View>
      )}

      {/* Modais de Calendário */}
      <DatePickerModal
        visible={dateModalMode === 'departure'}
        title="Data de Ida"
        selectedDate={departureDate}
        minDate={today}
        onSelect={handleDepartureSelect}
        onClose={() => setDateModalMode(null)}
      />

      <DatePickerModal
        visible={dateModalMode === 'return'}
        title="Data de Volta"
        selectedDate={returnDate}
        minDate={departureDate}
        onSelect={setReturnDate}
        onClose={() => setDateModalMode(null)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.white,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#CBD5E1',
    marginTop: 4,
    lineHeight: 18,
  },
  categoryTabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.navyLight,
    borderRadius: 12,
    padding: 4,
    marginTop: 14,
    gap: 4,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  categoryTabActive: {
    backgroundColor: COLORS.primary,
  },
  categoryTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  categoryTabTextActive: {
    color: COLORS.white,
  },
  searchCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 14,
    marginTop: -14,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tripTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tripPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tripPillActive: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  tripPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tripPillTextActive: {
    color: COLORS.primary,
  },
  airportsStack: {
    gap: 6,
  },
  swapWrapper: {
    alignItems: 'center',
    marginVertical: -6,
    zIndex: 2,
  },
  swapBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  dateBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 5,
    letterSpacing: 0.4,
  },
  dateValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  paxRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  paxBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  cabinRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  cabinChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cabinChipActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  cabinChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  cabinChipTextActive: {
    color: COLORS.white,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.dangerSoft,
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
    flex: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  searchButtonPressed: {
    backgroundColor: COLORS.primaryDark,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '800',
  },
  popularLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 14,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  popularRow: {
    gap: 8,
  },
  popularChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: COLORS.primarySoft,
  },
  popularChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultsSection: {
    marginTop: 16,
    paddingHorizontal: 14,
  },
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  summaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  summaryBadgeNac: {
    backgroundColor: COLORS.accentSoft,
  },
  summaryBadgeInt: {
    backgroundColor: COLORS.warningSoft,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  summaryBadgeTextNac: {
    color: COLORS.accent,
  },
  summaryBadgeTextInt: {
    color: COLORS.warning,
  },
  summarySub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  kpiBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  kpiBoxHighlight: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  kpiLabelHighlight: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryBright,
    textTransform: 'uppercase',
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  kpiValueHighlight: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.goldLight,
    marginTop: 2,
  },
  filterRow: {
    gap: 8,
    marginBottom: 10,
  },
  filterChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginRight: 2,
  },
  sortBtn: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sortBtnActive: {
    backgroundColor: COLORS.navy,
    borderColor: COLORS.navy,
  },
  sortBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  sortBtnTextActive: {
    color: COLORS.white,
  },
  emptyResults: {
    alignItems: 'center',
    padding: 28,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyResultsText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
