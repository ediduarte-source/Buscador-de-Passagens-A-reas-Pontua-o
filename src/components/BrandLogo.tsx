import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../theme/colors';

const LOGO_SOURCE = require('../../assets/logo.png');

interface BrandLogoProps {
  compact?: boolean;
  subtitle?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ compact = false, subtitle }) => {
  const iconSize = compact ? 36 : 48;

  return (
    <View style={styles.row}>
      <Image
        source={LOGO_SOURCE}
        style={{ width: iconSize, height: iconSize, borderRadius: compact ? 10 : 12 }}
        resizeMode="contain"
        accessibilityLabel="Logotipo Buscador de Passagens"
      />
      <View style={styles.textWrap}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            Buscador de <Text style={styles.titleAccent}>Passagens</Text>
          </Text>
          {!compact && (
            <View style={styles.pointsPill}>
              <Text style={styles.pointsPillText}>PONTOS</Text>
            </View>
          )}
        </View>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.3,
  },
  titleCompact: {
    fontSize: 17,
  },
  titleAccent: {
    color: COLORS.primaryBright,
  },
  pointsPill: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pointsPillText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.navy,
    letterSpacing: 0.6,
  },
  subtitle: {
    fontSize: 12,
    color: '#CBD5E1',
    marginTop: 3,
    lineHeight: 17,
  },
});
