import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const SuccessScreen = ({ lastWithdrawal, onComplete }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Animação de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-redirect após 4 segundos
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const totalItems = lastWithdrawal.reduce((sum, item) => sum + item.quantity, 0);

  const renderWithdrawalItem = ({ item }) => (
    <View style={styles.withdrawalItem}>
      <Text style={styles.withdrawalItemName}>{item.name}</Text>
      <View style={styles.withdrawalItemBadge}>
        <Text style={styles.withdrawalItemQuantity}>{item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Checkmark de sucesso */}
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color={theme.colors.success} />
        </View>

        {/* Título */}
        <Text style={styles.title}>Retirada Confirmada!</Text>

        {/* Resumo */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Você retirou <Text style={styles.summaryHighlight}>{totalItems}</Text> itens:
          </Text>

          <FlatList
            data={lastWithdrawal}
            renderItem={renderWithdrawalItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.withdrawalList}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Indicador de redirecionamento */}
        <View style={styles.redirectIndicator}>
          <Text style={styles.redirectText}>
            Redirecionando em alguns segundos...
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.success,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  summary: {
    width: '100%',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 18,
    color: theme.colors.dark,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  summaryHighlight: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  withdrawalList: {
    width: '100%',
    maxHeight: 200,
  },
  withdrawalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  withdrawalItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
    flex: 1,
  },
  withdrawalItemBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawalItemQuantity: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  redirectIndicator: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  redirectText: {
    fontSize: 14,
    color: theme.colors.gray,
    textAlign: 'center',
  },
});

export default SuccessScreen;
