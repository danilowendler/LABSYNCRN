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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

const { width } = Dimensions.get('window');

const ItemsScreen = ({ 
  items, 
  currentUser, 
  isLoading, 
  onItemAdd, 
  onItemClick, 
  onLogout, 
  onReviewItems,
  cartItemCount 
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);

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
          <Image
            source={{ uri: item.imageUrl || 'https://via.placeholder.com/90x90' }}
            style={styles.itemImage}
            resizeMode="contain"
          />
          <View style={styles.itemInfo}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            <Text style={styles.itemCode}>{item.code || ''}</Text>
            <Text style={[
              styles.itemStock,
              atMaxStock && styles.itemStockMax
            ]}>
              Em estoque: {item.maxStock}
            </Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                isSelected && styles.addButtonSelected,
                atMaxStock && styles.addButtonDisabled
              ]}
              onPress={() => !atMaxStock && onItemAdd(item.id)}
              disabled={atMaxStock}
            >
              <Text style={[
                styles.addButtonText,
                isSelected && styles.addButtonTextSelected,
                atMaxStock && styles.addButtonTextDisabled
              ]}>
                {atMaxStock ? 'Estoque Máx.' : isSelected ? `Selecionado (${item.quantity})` : 'Adicionar'}
              </Text>
            </TouchableOpacity>
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Olá, {currentUser?.name || 'Visitante'}</Text>
        <View style={styles.headerActions}>
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
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum item encontrado.</Text>
          </View>
        }
      />

      {/* Review Button */}
      <View style={styles.footer}>
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
    </View>
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
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightGray,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.white,
  },
  searchWrapper: {
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
    paddingBottom: 100, // Space for footer
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
    flexDirection: 'row',
    padding: theme.spacing.sm,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.dark,
    marginBottom: 4,
  },
  itemCode: {
    fontSize: 14,
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
  addButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  addButtonSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  addButtonDisabled: {
    backgroundColor: theme.colors.lightGray,
    borderColor: theme.colors.lightGray,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButtonTextSelected: {
    color: theme.colors.white,
  },
  addButtonTextDisabled: {
    color: theme.colors.gray,
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
    padding: theme.spacing.md,
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
