import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const SuccessScreen = ({ lastWithdrawal = [], onComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

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
      if (onComplete) {
        onComplete();
      }
    }, 4000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular total de itens com segurança
  const totalItems = Array.isArray(lastWithdrawal) 
    ? lastWithdrawal.reduce((sum, item) => sum + (item.quantity || 0), 0)
    : 0;

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
            Você retirou <Text style={styles.summaryHighlight}>{totalItems}</Text> {totalItems === 1 ? 'item' : 'itens'}:
          </Text>

          <View style={styles.totalBox}>
            <Text style={styles.totalNumber}>{totalItems}</Text>
          </View>
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
  totalBox: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    marginTop: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    ...theme.shadows.md,
  },
  totalNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: theme.colors.primary,
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
