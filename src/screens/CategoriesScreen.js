import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
  Alert,
  Animated,
  Switch,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const CategoriesScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [categories, setCategories] = useState([
    {
      id: '1',
      name: 'Mangoes',
      icon: '🥭',
      description: 'Fresh and organic mangoes from farms',
      productCount: 45,
      isActive: true,
      isFeatured: true,
      createdAt: '2024-01-01',
      color: '#FF6B35',
      slug: 'mangoes',
    },
    {
      id: '2',
      name: 'Electronics',
      icon: '💻',
      description: 'Latest gadgets and electronic devices',
      productCount: 28,
      isActive: true,
      isFeatured: true,
      createdAt: '2024-01-02',
      color: '#2196F3',
      slug: 'electronics',
    },
    {
      id: '3',
      name: 'Accessories',
      icon: '📱',
      description: 'Mobile accessories and gadgets',
      productCount: 15,
      isActive: true,
      isFeatured: false,
      createdAt: '2024-01-03',
      color: '#9C27B0',
      slug: 'accessories',
    },
    {
      id: '4',
      name: 'Clothing',
      icon: '👕',
      description: 'Fashion and apparel',
      productCount: 0,
      isActive: false,
      isFeatured: false,
      createdAt: '2024-01-04',
      color: '#4CAF50',
      slug: 'clothing',
    },
    {
      id: '5',
      name: 'Home & Living',
      icon: '🏠',
      description: 'Home decor and furniture',
      productCount: 0,
      isActive: true,
      isFeatured: false,
      createdAt: '2024-01-05',
      color: '#FF9800',
      slug: 'home-living',
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    icon: '📦',
    description: '',
    color: colors.primary,
    isActive: true,
    isFeatured: false,
  });

  const availableIcons = [
    '🥭', '💻', '📱', '👕', '🏠', '📚', '🎮', '🎧', '⌚', '🔋',
    '📷', '🎵', '⚽', '🎨', '🚗', '✈️', '🍕', '☕', '💊', '🧴'
  ];

  const colorOptions = [
    '#FF6B35', '#2196F3', '#9C27B0', '#4CAF50', '#FF9800',
    '#F44336', '#E91E63', '#00BCD4', '#8BC34A', '#FFC107'
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleAddCategory = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter category name');
      return;
    }

    const newCategory = {
      id: Date.now().toString(),
      name: formData.name,
      icon: formData.icon,
      description: formData.description,
      productCount: 0,
      isActive: formData.isActive,
      isFeatured: formData.isFeatured,
      createdAt: new Date().toISOString().split('T')[0],
      color: formData.color,
      slug: formData.name.toLowerCase().replace(/ /g, '-'),
    };

    setCategories([...categories, newCategory]);
    setModalVisible(false);
    resetForm();
    Alert.alert('Success', 'Category added successfully');
  };

  const handleEditCategory = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter category name');
      return;
    }

    const updatedCategories = categories.map(cat =>
      cat.id === selectedCategory.id
        ? {
            ...cat,
            name: formData.name,
            icon: formData.icon,
            description: formData.description,
            color: formData.color,
            isActive: formData.isActive,
            isFeatured: formData.isFeatured,
            slug: formData.name.toLowerCase().replace(/ /g, '-'),
          }
        : cat
    );

    setCategories(updatedCategories);
    setModalVisible(false);
    resetForm();
    Alert.alert('Success', 'Category updated successfully');
  };

  const handleDeleteCategory = () => {
    if (selectedCategory.productCount > 0) {
      Alert.alert(
        'Cannot Delete',
        `This category has ${selectedCategory.productCount} products. Please move or delete products first.`
      );
      setDeleteModalVisible(false);
      return;
    }

    const updatedCategories = categories.filter(cat => cat.id !== selectedCategory.id);
    setCategories(updatedCategories);
    setDeleteModalVisible(false);
    Alert.alert('Deleted', `${selectedCategory.name} category has been removed`);
  };

  const toggleCategoryStatus = (categoryId) => {
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? { ...category, isActive: !category.isActive }
        : category
    );
    setCategories(updatedCategories);
  };

  const toggleFeaturedStatus = (categoryId) => {
    const updatedCategories = categories.map(category =>
      category.id === categoryId
        ? { ...category, isFeatured: !category.isFeatured }
        : category
    );
    setCategories(updatedCategories);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📦',
      description: '',
      color: colors.primary,
      isActive: true,
      isFeatured: false,
    });
    setIsEditing(false);
    setSelectedCategory(null);
  };

  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description,
      color: category.color,
      isActive: category.isActive,
      isFeatured: category.isFeatured,
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCategories = categories.filter(c => c.isActive).length;
  const featuredCategories = categories.filter(c => c.isFeatured).length;
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  const CategoryCard = ({ category, index }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View style={[styles.categoryCard, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => openEditModal(category)}
        >
          <View style={styles.categoryCardHeader}>
            <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
            </View>
            <View style={styles.categoryHeaderRight}>
              <Switch
                value={category.isActive}
                onValueChange={() => toggleCategoryStatus(category.id)}
                trackColor={{ false: colors.grayLight, true: category.color + '80' }}
                thumbColor={category.isActive ? category.color : colors.gray}
              />
            </View>
          </View>

          <View style={styles.categoryCardBody}>
            <View style={styles.categoryNameRow}>
              <Text style={styles.categoryName}>{category.name}</Text>
              {category.isFeatured && (
                <View style={styles.featuredChip}>
                  <Ionicons name="star" size={12} color={colors.warning} />
                  <Text style={styles.featuredChipText}>Featured</Text>
                </View>
              )}
            </View>
            <Text style={styles.categoryDescription} numberOfLines={2}>
              {category.description}
            </Text>
          </View>

          <View style={styles.categoryCardFooter}>
            <View style={styles.productCount}>
              <Ionicons name="cube-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.productCountText}>
                {category.productCount} Products
              </Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity 
                style={styles.cardActionButton}
                onPress={() => toggleFeaturedStatus(category.id)}
              >
                <Ionicons 
                  name={category.isFeatured ? "star" : "star-outline"} 
                  size={18} 
                  color={category.isFeatured ? colors.warning : colors.gray} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.cardActionButton}
                onPress={() => openEditModal(category)}
              >
                <Ionicons name="create-outline" size={18} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const CategoryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        resetForm();
      }}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEditing ? 'Edit Category' : 'Add New Category'}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                setModalVisible(false);
                resetForm();
              }}
            >
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Icon Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category Icon</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.iconGrid}>
                  {availableIcons.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        styles.iconOption,
                        formData.icon === icon && styles.iconOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, icon })}
                    >
                      <Text style={styles.iconOptionText}>{icon}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Color Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category Color</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.colorGrid}>
                  {colorOptions.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        formData.color === color && styles.colorOptionActive,
                      ]}
                      onPress={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Category Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Category Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter category name"
                placeholderTextColor={colors.textDisabled}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Enter category description"
                placeholderTextColor={colors.textDisabled}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Status Switches */}
            <View style={styles.formGroup}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Active Category</Text>
                  <Text style={styles.switchDescription}>
                    Active categories will be visible to customers
                  </Text>
                </View>
                <Switch
                  value={formData.isActive}
                  onValueChange={(value) => setFormData({ ...formData, isActive: value })}
                  trackColor={{ false: colors.grayLight, true: colors.primary + '80' }}
                  thumbColor={formData.isActive ? colors.primary : colors.gray}
                />
              </View>

              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.switchLabel}>Featured Category</Text>
                  <Text style={styles.switchDescription}>
                    Featured categories appear on homepage
                  </Text>
                </View>
                <Switch
                  value={formData.isFeatured}
                  onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
                  trackColor={{ false: colors.grayLight, true: colors.warning + '80' }}
                  thumbColor={formData.isFeatured ? colors.warning : colors.gray}
                />
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewContainer}>
              <Text style={styles.formLabel}>Preview</Text>
              <View style={[styles.previewCard, { backgroundColor: formData.color + '10' }]}>
                <View style={styles.previewIcon}>
                  <Text style={styles.previewIconText}>{formData.icon}</Text>
                </View>
                <View>
                  <Text style={styles.previewName}>{formData.name || 'Category Name'}</Text>
                  <Text style={styles.previewDescription}>
                    {formData.description || 'Category description will appear here'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={isEditing ? handleEditCategory : handleAddCategory}
              >
                <Text style={styles.modalSaveBtnText}>
                  {isEditing ? 'Update' : 'Add'} Category
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const DeleteModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteModalIcon}>
            <Ionicons name="alert-triangle" size={50} color={colors.error} />
          </View>
          <Text style={styles.deleteModalTitle}>Delete Category?</Text>
          <Text style={styles.deleteModalText}>
            Are you sure you want to delete "{selectedCategory?.name}"? 
            This action cannot be undone.
          </Text>
          {selectedCategory?.productCount > 0 && (
            <Text style={styles.deleteModalWarning}>
              ⚠️ This category has {selectedCategory.productCount} products. 
              Please delete or move them first.
            </Text>
          )}
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteModalCancelBtn}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.deleteModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.deleteModalConfirmBtn,
                selectedCategory?.productCount > 0 && styles.deleteModalConfirmDisabled
              ]}
              onPress={handleDeleteCategory}
              disabled={selectedCategory?.productCount > 0}
            >
              <Text style={styles.deleteModalConfirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Categories</Text>
          <Text style={styles.headerSubtitle}>Manage product categories</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            resetForm();
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Total Categories</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{activeCategories}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{featuredCategories}</Text>
          <Text style={styles.statLabel}>Featured</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalProducts}</Text>
          <Text style={styles.statLabel}>Total Products</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search categories..."
          placeholderTextColor={colors.textDisabled}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories List */}
      <Animated.FlatList
        data={filteredCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item, index }) => <CategoryCard category={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="apps-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyStateTitle}>No Categories Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try different search terms' : 'Add your first category to get started'}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => {
                resetForm();
                setModalVisible(true);
              }}
            >
              <Text style={styles.emptyStateButtonText}>Add Category +</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modals */}
      <CategoryModal />
      <DeleteModal />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.white + 'CC',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '20',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25,
  },
  addButtonText: {
    color: colors.white,
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    margin: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  categoriesList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    margin: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  categoryIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCardBody: {
    padding: 15,
  },
  categoryNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginRight: 8,
  },
  featuredChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 3,
  },
  featuredChipText: {
    fontSize: 10,
    color: colors.warning,
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  categoryCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.backgroundLight,
  },
  productCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  productCountText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cardActionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconOptionActive: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  iconOptionText: {
    fontSize: 24,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.white,
  },
  colorOptionActive: {
    borderWidth: 3,
    borderColor: colors.primary,
    transform: [{ scale: 1.1 }],
  },
  formInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  switchDescription: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewContainer: {
    marginBottom: 20,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    gap: 12,
  },
  previewIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewIconText: {
    fontSize: 24,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  previewDescription: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10,
  },
  modalCancelBtnText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  modalSaveBtnText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  deleteModalIcon: {
    marginBottom: 15,
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  deleteModalText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  deleteModalWarning: {
    fontSize: 12,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor: colors.errorLight,
    padding: 10,
    borderRadius: 8,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  deleteModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10,
  },
  deleteModalCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 10,
  },
  deleteModalConfirmDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.5,
  },
  deleteModalConfirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
};

export default CategoriesScreen;