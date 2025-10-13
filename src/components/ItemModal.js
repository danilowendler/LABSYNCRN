import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const ItemModal = ({ 
  visible, 
  item, 
  onClose, 
  onQuantityChange 
}) => {
  if (!item) return null;

  const atMaxStock = item.quantity >= item.maxStock;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color={theme.colors.gray} />
              </TouchableOpacity>

              <View style={styles.modalContent}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.code} | Em estoque: {item.maxStock}
                </Text>

                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => onQuantityChange(item.id, -1)}
                  >
                    <Ionicons name="remove" size={24} color={theme.colors.danger} />
                  </TouchableOpacity>

                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      atMaxStock && styles.quantityButtonDisabled
                    ]}
                    onPress={() => !atMaxStock && onQuantityChange(item.id, 1)}
                    disabled={atMaxStock}
                  >
                    <Ionicons 
                      name="add" 
                      size={24} 
                      color={atMaxStock ? theme.colors.gray : theme.colors.success} 
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modal: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxWidth: 400,
    ...theme.shadows.lg,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1,
    padding: theme.spacing.sm,
  },
  modalContent: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  itemName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.dark,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  itemDetails: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
    borderColor: theme.colors.lightGray,
  },
  quantityDisplay: {
    minWidth: 80,
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
  },
  quantityText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.dark,
  },
});

export default ItemModal;
