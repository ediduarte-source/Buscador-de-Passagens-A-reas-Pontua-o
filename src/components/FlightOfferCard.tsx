import React from 'react';
import { Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FlightOffer } from '../types/flight';
import {
  formatCurrencyBRL,
  formatDateShortBR,
  formatDuration,
  formatNumberBR,
} from '../utils/dateUtils';

interface FlightOfferCardProps {
  offer: FlightOffer;
  rank: number;
}

async function openExternalUrl(url: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}

export const FlightOfferCard: React.FC<FlightOfferCardProps> = ({ offer, rank }) => {
  const isTopOffer = rank === 1;

  return (
    <View style={[styles.card, isTopOffer && styles.topCard]}>
      {/* Header do programa */}
      <View style={styles.headerRow}>
        <View style={styles.programInfo}>
          <View style={[styles.programBadge, { backgroundColor: offer.programColor }]}>
            <Text style={[styles.programBadgeText, { color: offer.programTextColor }]}>
              {offer.programShortName}
            </Text>
          </View>
          <View style={styles.programMeta}>
            <Text style={styles.programName} numberOfLines={1}>
              {offer.programName}
            </Text>
            <Text style={styles.airlineSub} numberOfLines={1}>
              {offer.programType === 'bank' ? 'Programa de Pontos' : 'Companhia Aérea'} •{' '}
              {offer.airlineName}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.categoryPill,
            offer.category === 'nacional' ? styles.categoryNac : styles.categoryInt,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              offer.category === 'nacional' ? styles.categoryTextNac : styles.categoryTextInt,
            ]}
          >
            {offer.category === 'nacional' ? 'Nacional' : 'Internacional'}
          </Text>
        </View>
      </View>

      {/* Badges */}
      {offer.badges.length > 0 && (
        <View style={styles.badgesRow}>
          {offer.badges.map((badge) => (
            <View
              key={badge}
              style={[
                styles.badgeChip,
                badge === 'Menor pontuação' && styles.badgeBest,
                badge === 'Melhor custo-benefício' && styles.badgeValue,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  badge === 'Menor pontuação' && styles.badgeBestText,
                  badge === 'Melhor custo-benefício' && styles.badgeValueText,
                ]}
              >
                {badge}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Rota e horários */}
      <View style={styles.routeBox}>
        <View style={styles.endpoint}>
          <Text style={styles.timeText}>{offer.departureTime}</Text>
          <Text style={styles.iataText}>{offer.originAirport.code}</Text>
          <Text style={styles.citySmall} numberOfLines={1}>
            {offer.originAirport.city}
          </Text>
        </View>

        <View style={styles.flightPath}>
          <Text style={styles.durationText}>{formatDuration(offer.durationMinutes)}</Text>
          <View style={styles.pathLineRow}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <Ionicons name="airplane" size={14} color={COLORS.primary} />
            <View style={styles.line} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.stopsText}>
            {offer.stops === 0
              ? 'Voo direto'
              : offer.stops === 1
                ? `1 escala (${offer.stopAirports.join(', ')})`
                : `${offer.stops} escalas (${offer.stopAirports.join(', ')})`}
          </Text>
        </View>

        <View style={[styles.endpoint, styles.endpointRight]}>
          <Text style={styles.timeText}>{offer.arrivalTime}</Text>
          <Text style={styles.iataText}>{offer.destinationAirport.code}</Text>
          <Text style={styles.citySmall} numberOfLines={1}>
            {offer.destinationAirport.city}
          </Text>
        </View>
      </View>

      {/* Datas, pontuação e valor em moeda (R$) */}
      <View style={styles.priceRow}>
        <View style={styles.pointsBlock}>
          <Text style={styles.priceBlockLabel}>EM PONTOS</Text>
          <Text style={styles.pointsValue}>
            {formatNumberBR(offer.totalPoints)}{' '}
            <Text style={styles.pointsUnit}>{offer.currencyName}</Text>
          </Text>
          <Text style={styles.taxesText}>
            + {formatCurrencyBRL(offer.taxesBRL)} taxas •{' '}
            {offer.tripType === 'round-trip' && offer.returnDate
              ? `${formatDateShortBR(offer.departureDate)} → ${formatDateShortBR(offer.returnDate)}`
              : `Ida ${formatDateShortBR(offer.departureDate)}`}
          </Text>
        </View>

        <View style={styles.cashBox}>
          <Text style={styles.cashLabel}>VALOR EM MOEDA</Text>
          <Text style={styles.cashValue}>{formatCurrencyBRL(offer.estimatedCashBRL)}</Text>
          <Text style={styles.cpmSub}>≈ {formatCurrencyBRL(offer.cpmBRL)}/milheiro</Text>
        </View>
      </View>

      {offer.transferNote && (
        <View style={styles.transferBox}>
          <Ionicons name="swap-horizontal" size={14} color={COLORS.primary} />
          <Text style={styles.transferText}>{offer.transferNote}</Text>
        </View>
      )}

      {/* Botões de simulação direta nos sites */}
      <View style={styles.actionsRow}>
        <Pressable
          onPress={() => openExternalUrl(offer.simulationUrl)}
          style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
          accessibilityRole="link"
          accessibilityLabel={`Simular no site ${offer.programShortName}`}
        >
          <Text style={styles.primaryBtnText}>
            Simular em {offer.programShortName}
          </Text>
          <Ionicons name="open-outline" size={16} color={COLORS.white} />
        </Pressable>

        {offer.partnerSimulationUrl && offer.partnerProgramName && (
          <Pressable
            onPress={() => openExternalUrl(offer.partnerSimulationUrl!)}
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.btnPressed]}
            accessibilityRole="link"
            accessibilityLabel={`Simular na parceira ${offer.partnerProgramName}`}
          >
            <Text style={styles.secondaryBtnText}>
              Ver em {offer.partnerProgramName}
            </Text>
            <Ionicons name="open-outline" size={15} color={COLORS.primary} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topCard: {
    borderColor: COLORS.gold,
    borderWidth: 1.8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  programInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  programBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  programBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  programMeta: {
    flex: 1,
  },
  programName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  airlineSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 1,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  categoryNac: {
    backgroundColor: COLORS.accentSoft,
  },
  categoryInt: {
    backgroundColor: COLORS.warningSoft,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  categoryTextNac: {
    color: COLORS.accent,
  },
  categoryTextInt: {
    color: COLORS.warning,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  badgeChip: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeBest: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accent,
  },
  badgeValue: {
    backgroundColor: COLORS.primarySoft,
    borderColor: COLORS.primary,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  badgeBestText: {
    color: COLORS.accent,
  },
  badgeValueText: {
    color: COLORS.primary,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  endpoint: {
    width: 82,
  },
  endpointRight: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  iataText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
  },
  citySmall: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  flightPath: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  pathLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  line: {
    flex: 1,
    height: 1.5,
    backgroundColor: COLORS.borderStrong,
    marginHorizontal: 3,
  },
  stopsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  pointsBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  priceBlockLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 21,
    fontWeight: '900',
    color: COLORS.navy,
  },
  pointsUnit: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  taxesText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  cashBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: COLORS.goldSoft,
    borderWidth: 1,
    borderColor: COLORS.goldBorder,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 126,
  },
  cashLabel: {
    fontSize: 9,
    color: COLORS.goldDark,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  cashValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.navy,
    marginTop: 2,
  },
  cpmSub: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  transferBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
  },
  transferText: {
    fontSize: 12,
    color: COLORS.navy,
    flex: 1,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  primaryBtn: {
    flex: 1,
    minWidth: 165,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '800',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  secondaryBtnText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  btnPressed: {
    opacity: 0.82,
  },
});
