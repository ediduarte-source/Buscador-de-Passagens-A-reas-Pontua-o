import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { addDaysToIso, formatIsoDate, getTodayIso, parseIsoDate } from '../utils/dateUtils';

interface DatePickerModalProps {
  visible: boolean;
  title: string;
  selectedDate: string;
  minDate?: string;
  onSelect: (isoDate: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  title,
  selectedDate,
  minDate,
  onSelect,
  onClose,
}) => {
  const initialDate = useMemo(
    () => parseIsoDate(selectedDate || getTodayIso()),
    [selectedDate],
  );
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const effectiveMin = minDate || getTodayIso();

  const daysGrid = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstDayOfMonth.getDay();
    const totalDays = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ iso: string | null; day: number | null; disabled: boolean }> = [];
    for (let i = 0; i < startWeekday; i += 1) {
      cells.push({ iso: null, day: null, disabled: true });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const iso = formatIsoDate(new Date(viewYear, viewMonth, day));
      cells.push({
        iso,
        day,
        disabled: iso < effectiveMin,
      });
    }
    return cells;
  }, [viewYear, viewMonth, effectiveMin]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const quickShortcuts = [7, 15, 30, 60];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.shortcutRow}>
            {quickShortcuts.map((days) => {
              const target = addDaysToIso(effectiveMin, days);
              return (
                <Pressable
                  key={days}
                  onPress={() => {
                    onSelect(target);
                    onClose();
                  }}
                  style={styles.shortcutChip}
                >
                  <Text style={styles.shortcutText}>+{days}d</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.monthHeader}>
            <Pressable onPress={handlePrevMonth} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color={COLORS.text} />
            </Pressable>
            <Text style={styles.monthLabel}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={handleNextMonth} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
            </Pressable>
          </View>

          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map((wd) => (
              <Text key={wd} style={styles.weekdayText}>
                {wd}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {daysGrid.map((cell, index) => {
              if (!cell.iso || !cell.day) {
                return <View key={`empty-${index}`} style={styles.dayCell} />;
              }
              const isSelected = cell.iso === selectedDate;
              return (
                <Pressable
                  key={cell.iso}
                  disabled={cell.disabled}
                  onPress={() => {
                    onSelect(cell.iso!);
                    onClose();
                  }}
                  style={[
                    styles.dayCell,
                    isSelected && styles.dayCellSelected,
                    cell.disabled && styles.dayCellDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isSelected && styles.dayTextSelected,
                      cell.disabled && styles.dayTextDisabled,
                    ]}
                  >
                    {cell.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 31, 58, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  shortcutRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  shortcutChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.primarySoft,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  navBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceAlt,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  weekdayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellDisabled: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.white,
    fontWeight: '800',
  },
  dayTextDisabled: {
    color: COLORS.textMuted,
  },
});
