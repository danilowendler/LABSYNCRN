import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const StockAlert = ({ items, onClose }) => {
  const criticalItems = items.filter(item => item.stock === 'critical' && item.quantity === 0);

  if (criticalItems.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.alertContainer}>
        <Ionicons name="warning" size={24} color={theme.colors.warning} />
        <View style={styles.textContainer}>
          <Text style={styles.alertTitle}>Estoque Crítico</Text>
          <Text style={styles.alertText}>
            {criticalItems.length} item{criticalItems.length > 1 ? 'ns' : ''} com estoque baixo
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={20} color={theme.colors.dark} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
    color: '#856404',
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
});

export default StockAlert;
