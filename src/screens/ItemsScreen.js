import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import StockAlert from '../components/StockAlert';

const { width } = Dimensions.get('window');

const ItemsScreen = ({ 
  items, 
  currentUser, 
  isLoading, 
  onItemAdd,
  onItemRemove,
  onItemClick, 
  onLogout, 
  onReviewItems,
  onViewHistory,
  cartItemCount 
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const [alertVisible, setAlertVisible] = useState(true);
  const [imageErrors, setImageErrors] = useState({});
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (searchText) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (item.code && item.code.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [items, searchText]);

  const clearSearch = () => {
    setSearchText('');
  };

  const renderItem = ({ item }) => {
    const isSelected = item.quantity > 0;
    const atMaxStock = item.quantity >= item.maxStock;

    return (
      <TouchableOpacity
        style={[
          styles.itemCard,
          isSelected && styles.itemCardSelected,
          item.stock === 'critical' && styles.itemCardCritical
        ]}
        onPress={() => onItemClick(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          {item.imageUrl && !imageErrors[item.id] ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.itemImage}
              resizeMode="contain"
              onError={() => {
                // Silenciosamente trata erro de imagem - mostra placeholder
                setImageErrors(prev => ({ ...prev, [item.id]: true }));
              }}
            />
          ) : (
            <View style={[styles.itemImage, styles.placeholderImage]}>
              <Ionicons name="image-outline" size={40} color={theme.colors.gray} />
              <Text style={styles.placeholderText}>Sem imagem</Text>
            </View>
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={3} ellipsizeMode="tail">
              {item.name}
            </Text>
            {item.code && (
              <Text style={styles.itemCode} numberOfLines={1} ellipsizeMode="tail">
                {item.code}
              </Text>
            )}
            <Text style={[
              styles.itemStock,
              atMaxStock && styles.itemStockMax
            ]}>
              Em estoque: {item.maxStock}
            </Text>
            <View style={styles.buttonsContainer}>
              {isSelected && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => onItemRemove(item.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="trash-outline" size={20} color={theme.colors.danger} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[
                  styles.addButton,
                  isSelected && styles.addButtonSelected,
                  atMaxStock && styles.addButtonDisabled
                ]}
                onPress={() => !atMaxStock && onItemAdd(item.id)}
                disabled={atMaxStock}
                activeOpacity={0.7}
              >
              {atMaxStock ? (
                <Text style={styles.addButtonTextDisabled}>Máx</Text>
              ) : isSelected ? (
                <View style={styles.addButtonContent}>
                  <Ionicons name="add-circle" size={18} color={theme.colors.white} />
                  <Text style={styles.addButtonTextSelected}>{item.quantity}</Text>
                </View>
              ) : (
                <Ionicons name="add-circle" size={32} color={theme.colors.primary} />
              )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSkeleton = () => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, styles.skeletonLineShort]} />
        <View style={styles.skeletonButton} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Olá, {currentUser?.name || 'Visitante'}</Text>
          <View style={styles.headerActions}>
            <View style={styles.cartContainer}>
              <Ionicons name="bag" size={24} color={theme.colors.primary} />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>0</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={Array(6).fill(0)}
          renderItem={renderSkeleton}
          keyExtractor={(_, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText} numberOfLines={1} ellipsizeMode="tail">
          Olá, {currentUser?.name || 'Visitante'}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.historyButton}
            onPress={onViewHistory}
          >
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cartContainer}
            onPress={cartItemCount > 0 ? onReviewItems : null}
          >
            <Ionicons name="bag" size={24} color={theme.colors.primary} />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stock Alert */}
      {alertVisible && <StockAlert items={items} onClose={() => setAlertVisible(false)} />}

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color={theme.colors.gray} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar item por nome ou código..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor={theme.colors.gray}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close" size={20} color={theme.colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Items List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + theme.spacing.md + 80 } // Footer height + safe area + extra padding
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
          </View>
        }
      />

      {/* Review Button */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + theme.spacing.md }]}>
        <TouchableOpacity
          style={[
            styles.reviewButton,
            cartItemCount === 0 && styles.reviewButtonDisabled
          ]}
          onPress={onReviewItems}
          disabled={cartItemCount === 0}
        >
          <Text style={[
            styles.reviewButtonText,
            cartItemCount === 0 && styles.reviewButtonTextDisabled
          ]}>
            Revisar Itens ({cartItemCount})
          </Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.sm : theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
    minHeight: 60,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyButton: {
    marginRight: theme.spacing.sm,
  },
  cartContainer: {
    position: 'relative',
    marginRight: theme.spacing.md,
  },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    color: theme.colors.gray,
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.dark,
  },
  clearButton: {
    padding: theme.spacing.sm,
  },
  listContainer: {
    padding: theme.spacing.sm,
  },
  itemCard: {
    flex: 1,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  itemCardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  itemCardCritical: {
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  itemContent: {
    flexDirection: 'column',
    padding: theme.spacing.sm,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    borderWidth: 1,
    borderColor: theme.colors.lightGray,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 12,
    color: theme.colors.gray,
    marginTop: 4,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 100,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
    lineHeight: 18,
    minHeight: 54,
  },
  itemCode: {
    fontSize: 12,
    color: theme.colors.gray,
    marginBottom: 4,
  },
  itemStock: {
    fontSize: 12,
    color: theme.colors.gray,
    marginBottom: theme.spacing.sm,
  },
  itemStockMax: {
    color: theme.colors.danger,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.light,
    borderWidth: 1,
    borderColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.xs,
  },
  addButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  addButtonSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
    borderColor: theme.colors.lightGray,
  },
  addButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButtonTextSelected: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButtonTextDisabled: {
    color: theme.colors.gray,
    fontSize: 12,
  },
  skeletonCard: {
    flex: 1,
    margin: theme.spacing.sm,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    flexDirection: 'row',
    padding: theme.spacing.sm,
  },
  skeletonImage: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonLineShort: {
    width: '60%',
  },
  skeletonButton: {
    height: 32,
    backgroundColor: theme.colors.lightGray,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    paddingTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightGray,
  },
  reviewButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  reviewButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
  },
  reviewButtonText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  reviewButtonTextDisabled: {
    color: theme.colors.gray,
  },
});

export default ItemsScreen;
