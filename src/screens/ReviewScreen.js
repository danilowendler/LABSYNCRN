import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const ReviewScreen = ({ 
  items, 
  onQuantityChange, 
  onConfirmWithdrawal, 
  onCancel 
}) => {
  const itemsInCart = items.filter(item => item.quantity > 0);
  const totalItems = itemsInCart.reduce((sum, item) => sum + item.quantity, 0);

  const handleConfirm = () => {
    Alert.alert(
      'Confirmar Retirada',
      `Deseja confirmar a retirada de ${totalItems} item(ns)?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: onConfirmWithdrawal,
          style: 'default'
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const atMaxStock = item.quantity >= item.maxStock;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>
            {item.code} (Máx: {item.maxStock})
          </Text>
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.id, -1)}
            activeOpacity={0.7}
          >
            <Ionicons name="remove-circle" size={36} color={theme.colors.danger} />
          </TouchableOpacity>
          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>{item.quantity}</Text>
          </View>
          <TouchableOpacity
            style={[styles.quantityButton, atMaxStock && styles.quantityButtonDisabled]}
            onPress={() => !atMaxStock && onQuantityChange(item.id, 1)}
            disabled={atMaxStock}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="add-circle" 
              size={36} 
              color={atMaxStock ? theme.colors.gray : theme.colors.success} 
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Revisar e Confirmar</Text>
      </View>

      {itemsInCart.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total de itens:</Text>
          <Text style={styles.totalValue}>{totalItems}</Text>
        </View>
      )}

      <FlatList
        data={itemsInCart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={64} color={theme.colors.gray} />
            <Text style={styles.emptyText}>Nenhum item selecionado</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.footerActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <View style={styles.confirmSection}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Ionicons name="checkmark" size={24} color={theme.colors.white} />
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <Text style={styles.confirmHint}>Toque para confirmar a retirada</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.sm : theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    minHeight: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
  },
  totalContainer: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  listContainer: {
    padding: theme.spacing.md,
    paddingBottom: 120, // Space for footer
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    ...theme.shadows.sm,
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  quantityDisplay: {
    minWidth: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: theme.spacing.sm,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.gray,
    marginTop: theme.spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
  },
  cancelButtonText: {
    color: theme.colors.gray,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmSection: {
    alignItems: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.success,
    borderRadius: 30,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.md,
  },
  confirmButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  confirmHint: {
    fontSize: 12,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});

export default ReviewScreen;
