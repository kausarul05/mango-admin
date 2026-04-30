import React, { useState, useEffect, useRef } from 'react'
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
  Image,
  Switch,
  Dimensions
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import colors from '../constants/colors'
import globalStyles from '../constants/styles'

const { width } = Dimensions.get('window')

const ProductsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Alphonso Mango',
      category: 'mangoes',
      price: 599,
      originalPrice: 799,
      discount: 25,
      quantity: 50,
      unit: 'kg',
      description:
        'Premium Alphonso mangoes directly from Ratnagiri. Known for their rich taste and aroma.',
      images: ['🥭'],
      rating: 4.8,
      reviews: 124,
      isActive: true,
      isFeatured: true,
      stock: 45,
      sku: 'MAN-ALP-001',
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: 'Organic Mango',
      category: 'mangoes',
      price: 799,
      originalPrice: 999,
      discount: 20,
      quantity: 1,
      unit: 'kg',
      description: '100% organic certified mangoes, no pesticides used.',
      images: ['🥭'],
      rating: 4.9,
      reviews: 89,
      isActive: true,
      isFeatured: true,
      stock: 30,
      sku: 'MAN-ORG-002',
      createdAt: '2024-01-02'
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      category: 'electronics',
      price: 2499,
      originalPrice: 3999,
      discount: 38,
      quantity: 1,
      unit: 'piece',
      description: 'Bluetooth 5.0, 20hr battery life, noise cancellation.',
      images: ['🎧'],
      rating: 4.6,
      reviews: 234,
      isActive: true,
      isFeatured: false,
      stock: 25,
      sku: 'ELE-HP-003',
      createdAt: '2024-01-03'
    },
    {
      id: '4',
      name: 'Power Bank 20000mAh',
      category: 'electronics',
      price: 1299,
      originalPrice: 1999,
      discount: 35,
      quantity: 1,
      unit: 'piece',
      description: 'Fast charging, dual USB ports, LED indicator.',
      images: ['🔋'],
      rating: 4.5,
      reviews: 178,
      isActive: true,
      isFeatured: false,
      stock: 40,
      sku: 'ELE-PB-004',
      createdAt: '2024-01-04'
    },
    {
      id: '5',
      name: 'Smart Watch',
      category: 'electronics',
      price: 3999,
      originalPrice: 5999,
      discount: 33,
      quantity: 1,
      unit: 'piece',
      description: 'Fitness tracker, heart rate monitor, waterproof.',
      images: ['⌚'],
      rating: 4.7,
      reviews: 312,
      isActive: true,
      isFeatured: true,
      stock: 15,
      sku: 'ELE-SW-005',
      createdAt: '2024-01-05'
    },
    {
      id: '6',
      name: 'Premium Mango Box',
      category: 'mangoes',
      price: 1299,
      originalPrice: 1599,
      discount: 19,
      quantity: 3,
      unit: 'kg',
      description: 'Handpicked premium mangoes in eco-friendly box.',
      images: ['📦'],
      rating: 4.9,
      reviews: 56,
      isActive: true,
      isFeatured: true,
      stock: 20,
      sku: 'MAN-BOX-006',
      createdAt: '2024-01-06'
    },
    {
      id: '7',
      name: 'Phone Case',
      category: 'accessories',
      price: 499,
      originalPrice: 999,
      discount: 50,
      quantity: 1,
      unit: 'piece',
      description: 'Shockproof, slim design, multiple colors available.',
      images: ['📱'],
      rating: 4.3,
      reviews: 456,
      isActive: true,
      isFeatured: false,
      stock: 100,
      sku: 'ACC-PC-007',
      createdAt: '2024-01-07'
    },
    {
      id: '8',
      name: 'USB-C Cable',
      category: 'accessories',
      price: 299,
      originalPrice: 499,
      discount: 40,
      quantity: 1,
      unit: 'piece',
      description: 'Fast charging, durable, 2m length.',
      images: ['🔌'],
      rating: 4.4,
      reviews: 234,
      isActive: true,
      isFeatured: false,
      stock: 200,
      sku: 'ACC-USB-008',
      createdAt: '2024-01-08'
    }
  ])

  const categories = [
    { id: 'all', name: 'All Products', icon: '', count: products.length },
    {
      id: 'mangoes',
      name: 'Mangoes',
      icon: '🥭',
      count: products.filter(p => p.category === 'mangoes').length
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '💻',
      count: products.filter(p => p.category === 'electronics').length
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: '📱',
      count: products.filter(p => p.category === 'accessories').length
    }
  ]

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    }).start()
  }, [])

  const onRefresh = async () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 1500)
  }

  const toggleProductStatus = productId => {
    const updatedProducts = products.map(product =>
      product.id === productId
        ? { ...product, isActive: !product.isActive }
        : product
    )
    setProducts(updatedProducts)
    Alert.alert('Success', 'Product status updated successfully')
  }

  const deleteProduct = () => {
    const updatedProducts = products.filter(
      product => product.id !== selectedProduct.id
    )
    setProducts(updatedProducts)
    setDeleteModalVisible(false)
    setModalVisible(false)
    Alert.alert('Deleted', `${selectedProduct.name} has been removed`)
  }

  const filteredProducts = products.filter(product => {
    if (selectedCategory !== 'all' && product.category !== selectedCategory)
      return false
    if (searchQuery) {
      return (
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  const getCategoryIcon = category => {
    switch (category) {
      case 'mangoes':
        return '🥭'
      case 'electronics':
        return '💻'
      case 'accessories':
        return '📱'
      default:
        return '📦'
    }
  }

  const ProductCardGrid = ({ product, index }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 50,
        useNativeDriver: true
      }).start()
    }, [])

    return (
      <Animated.View
        style={[styles.gridCard, { transform: [{ scale: scaleAnim }] }]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedProduct(product)
            setModalVisible(true)
          }}
        >
          <View style={styles.gridCardImage}>
            <Text style={styles.productEmoji}>{product.images[0]}</Text>
            {product.discount > 0 && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}% OFF</Text>
              </View>
            )}
            {product.isFeatured && (
              <View style={styles.featuredBadge}>
                <Ionicons name='star' size={12} color={colors.white} />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
          </View>

          <View style={styles.gridCardContent}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>₹{product.price}</Text>
              {product.originalPrice > product.price && (
                <Text style={styles.originalPrice}>
                  ₹{product.originalPrice}
                </Text>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name='star' size={14} color='#FFB800' />
              <Text style={styles.ratingText}>{product.rating}</Text>
              <Text style={styles.reviewsText}>({product.reviews})</Text>
            </View>
            <View style={styles.stockContainer}>
              <View
                style={[
                  styles.stockIndicator,
                  {
                    backgroundColor:
                      product.stock > 20
                        ? colors.success
                        : product.stock > 5
                        ? colors.warning
                        : colors.error
                  }
                ]}
              />
              <Text style={styles.stockText}>
                {product.stock > 20
                  ? 'In Stock'
                  : product.stock > 5
                  ? 'Limited'
                  : 'Low Stock'}
              </Text>
            </View>
          </View>

          <View style={styles.gridCardActions}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate('AddEditProduct', { product })}
            >
              <Ionicons
                name='create-outline'
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
            <Switch
              value={product.isActive}
              onValueChange={() => toggleProductStatus(product.id)}
              trackColor={{
                false: colors.grayLight,
                true: colors.primary + '80'
              }}
              thumbColor={product.isActive ? colors.primary : colors.gray}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const ProductCardList = ({ product, index }) => {
    const slideAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.timing(slideAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true
      }).start()
    }, [])

    return (
      <Animated.View
        style={[
          styles.listCard,
          {
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            setSelectedProduct(product)
            setModalVisible(true)
          }}
          style={styles.listCardTouchable}
        >
          <View style={styles.listCardImage}>
            <Text style={styles.listProductEmoji}>{product.images[0]}</Text>
            {product.discount > 0 && (
              <View style={styles.listDiscountBadge}>
                <Text style={styles.listDiscountText}>{product.discount}%</Text>
              </View>
            )}
          </View>

          <View style={styles.listCardContent}>
            <View style={styles.listCardHeader}>
              <Text style={styles.listProductName}>{product.name}</Text>
              <Switch
                value={product.isActive}
                onValueChange={() => toggleProductStatus(product.id)}
                trackColor={{
                  false: colors.grayLight,
                  true: colors.primary + '80'
                }}
                thumbColor={product.isActive ? colors.primary : colors.gray}
                style={styles.listSwitch}
              />
            </View>

            <Text style={styles.productSku}>SKU: {product.sku}</Text>

            <View style={styles.listPriceContainer}>
              <Text style={styles.listCurrentPrice}>₹{product.price}</Text>
              {product.originalPrice > product.price && (
                <Text style={styles.listOriginalPrice}>
                  ₹{product.originalPrice}
                </Text>
              )}
            </View>

            <View style={styles.listMetaContainer}>
              <View style={styles.listRatingContainer}>
                <Ionicons name='star' size={12} color='#FFB800' />
                <Text style={styles.listRatingText}>{product.rating}</Text>
                <Text style={styles.listReviewsText}>({product.reviews})</Text>
              </View>
              <View style={styles.listStockContainer}>
                <View
                  style={[
                    styles.listStockIndicator,
                    {
                      backgroundColor:
                        product.stock > 20
                          ? colors.success
                          : product.stock > 5
                          ? colors.warning
                          : colors.error
                    }
                  ]}
                />
                <Text style={styles.listStockText}>{product.stock} left</Text>
              </View>
            </View>
          </View>

          <View style={styles.listCardActions}>
            <TouchableOpacity
              style={styles.listEditButton}
              onPress={() => navigation.navigate('AddEditProduct', { product })}
            >
              <Ionicons name='create-outline' size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  const ProductDetailModal = () => (
    <Modal
      animationType='slide'
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedProduct && (
              <>
                <View style={styles.modalImageContainer}>
                  <Text style={styles.modalEmoji}>
                    {selectedProduct.images[0]}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name='close' size={24} color={colors.white} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Text style={styles.modalProductName}>
                    {selectedProduct.name}
                  </Text>

                  <View style={styles.modalRatingRow}>
                    <View style={styles.modalRating}>
                      <Ionicons name='star' size={16} color='#FFB800' />
                      <Text style={styles.modalRatingText}>
                        {selectedProduct.rating}
                      </Text>
                    </View>
                    <Text style={styles.modalReviews}>
                      ({selectedProduct.reviews} reviews)
                    </Text>
                    <View style={styles.modalSku}>
                      <Text style={styles.modalSkuText}>
                        SKU: {selectedProduct.sku}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalPriceRow}>
                    <Text style={styles.modalCurrentPrice}>
                      ₹{selectedProduct.price}
                    </Text>
                    {selectedProduct.originalPrice > selectedProduct.price && (
                      <>
                        <Text style={styles.modalOriginalPrice}>
                          ₹{selectedProduct.originalPrice}
                        </Text>
                        <Text style={styles.modalDiscount}>
                          {selectedProduct.discount}% OFF
                        </Text>
                      </>
                    )}
                  </View>

                  <View style={styles.modalInfoGrid}>
                    <View style={styles.modalInfoItem}>
                      <Ionicons
                        name='cube-outline'
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.modalInfoLabel}>Stock</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedProduct.stock} units
                      </Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Ionicons
                        name='scale-outline'
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.modalInfoLabel}>Quantity</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedProduct.quantity} {selectedProduct.unit}
                      </Text>
                    </View>
                    <View style={styles.modalInfoItem}>
                      <Ionicons
                        name='calendar-outline'
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.modalInfoLabel}>Added</Text>
                      <Text style={styles.modalInfoValue}>
                        {selectedProduct.createdAt}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Description</Text>
                    <Text style={styles.modalDescription}>
                      {selectedProduct.description}
                    </Text>
                  </View>

                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={styles.modalEditButton}
                      onPress={() => {
                        setModalVisible(false)
                        navigation.navigate('AddEditProduct', {
                          product: selectedProduct
                        })
                      }}
                    >
                      <Ionicons
                        name='create-outline'
                        size={20}
                        color={colors.white}
                      />
                      <Text style={styles.modalEditButtonText}>
                        Edit Product
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.modalDeleteButton}
                      onPress={() => setDeleteModalVisible(true)}
                    >
                      <Ionicons
                        name='trash-outline'
                        size={20}
                        color={colors.error}
                      />
                      <Text style={styles.modalDeleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )

  const DeleteConfirmationModal = () => (
    <Modal
      animationType='fade'
      transparent={true}
      visible={deleteModalVisible}
      onRequestClose={() => setDeleteModalVisible(false)}
    >
      <View style={styles.deleteModalOverlay}>
        <View style={styles.deleteModalContent}>
          <View style={styles.deleteModalIcon}>
            <Ionicons name='alert-triangle' size={50} color={colors.error} />
          </View>
          <Text style={styles.deleteModalTitle}>Delete Product?</Text>
          <Text style={styles.deleteModalText}>
            Are you sure you want to delete "{selectedProduct?.name}"? This
            action cannot be undone.
          </Text>
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={styles.deleteModalCancelBtn}
              onPress={() => setDeleteModalVisible(false)}
            >
              <Text style={styles.deleteModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteModalConfirmBtn}
              onPress={deleteProduct}
            >
              <Text style={styles.deleteModalConfirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Products</Text>
          <Text style={styles.headerSubtitle}>Manage your product catalog</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddEditProduct')}
        >
          <Ionicons name='add' size={24} color={colors.white} />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>

      {/* Search and View Toggle */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons
            name='search-outline'
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder='Search products...'
            placeholderTextColor={colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name='close-circle'
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.viewToggle}
          onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
        >
          <Ionicons
            name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
            size={22}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text
              style={[
                styles.categoryName,
                selectedCategory === category.id && styles.categoryNameActive
              ]}
            >
              {category.name}
            </Text>
            <View
              style={[
                styles.categoryCount,
                selectedCategory === category.id && styles.categoryCountActive
              ]}
            >
              <Text
                style={[
                  styles.categoryCountText,
                  selectedCategory === category.id &&
                    styles.categoryCountTextActive
                ]}
              >
                {category.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Products List/Grid */}
      <Animated.FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        renderItem={({ item, index }) =>
          viewMode === 'grid' ? (
            <ProductCardGrid product={item} index={index} />
          ) : (
            <ProductCardList product={item} index={index} />
          )
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name='cube-outline' size={80} color={colors.gray} />
            <Text style={styles.emptyStateTitle}>No Products Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery
                ? 'Try different search terms'
                : 'Add your first product to get started'}
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('AddEditProduct')}
            >
              <Text style={styles.emptyStateButtonText}>Add Product +</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modals */}
      <ProductDetailModal />
      <DeleteConfirmationModal />
    </View>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.white + 'CC'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white + '20',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 25
  },
  addButtonText: {
    color: colors.white,
    marginLeft: 5,
    fontWeight: '600',
    fontSize: 14
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    gap: 10
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10
  },
  viewToggle: {
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 12,
    elevation: 3
  },

  categoriesContainer: {
    marginBottom: 10,
    maxHeight: 50 // Fixed height to prevent overflow
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    alignItems: 'center' // Center items vertically
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6, // Reduced from 8
    borderRadius: 20,
    marginRight: 8,
    elevation: 2,
    minHeight: 36 // Fixed minimum height
  },
  categoryChipActive: {
    backgroundColor: colors.primary
  },
  categoryIcon: {
    fontSize: 14, // Reduced from 16
    marginRight: 4
  },
  categoryName: {
    fontSize: 12, // Reduced from 13
    color: colors.textSecondary,
    marginRight: 4,
    fontWeight: '500'
  },
  categoryNameActive: {
    color: colors.white,
    fontWeight: '600'
  },
  categoryCount: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center'
  },
  categoryCountActive: {
    backgroundColor: colors.white
  },
  categoryCountText: {
    fontSize: 10, // Reduced from 11
    color: colors.textSecondary,
    fontWeight: '600'
  },
  categoryCountTextActive: {
    color: colors.primary
  },

  productsList: {
    paddingHorizontal: 12,
    paddingBottom: 20
  },
  // Grid View Styles
  gridCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 15,
    margin: 6,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  gridCardImage: {
    height: 140,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  productEmoji: {
    fontSize: 60
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  discountText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold'
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.warning,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  featuredText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3
  },
  gridCardContent: {
    padding: 12
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
    marginRight: 6
  },
  originalPrice: {
    fontSize: 12,
    color: colors.textDisabled,
    textDecorationLine: 'line-through'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 3,
    marginRight: 3
  },
  reviewsText: {
    fontSize: 10,
    color: colors.textDisabled
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5
  },
  stockText: {
    fontSize: 10,
    color: colors.textSecondary
  },
  gridCardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 10
  },
  editButton: {
    padding: 6
  },
  // List View Styles
  listCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2
  },
  listCardTouchable: {
    flexDirection: 'row',
    padding: 12
  },
  listCardImage: {
    width: 80,
    height: 80,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  listProductEmoji: {
    fontSize: 40
  },
  listDiscountBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: colors.error,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8
  },
  listDiscountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: 'bold'
  },
  listCardContent: {
    flex: 1,
    marginLeft: 12
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  listProductName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1
  },
  listSwitch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }]
  },
  productSku: {
    fontSize: 11,
    color: colors.textDisabled,
    marginBottom: 4
  },
  listPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6
  },
  listCurrentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
    marginRight: 8
  },
  listOriginalPrice: {
    fontSize: 13,
    color: colors.textDisabled,
    textDecorationLine: 'line-through'
  },
  listMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listRatingText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 3,
    marginRight: 3
  },
  listReviewsText: {
    fontSize: 11,
    color: colors.textDisabled
  },
  listStockContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listStockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5
  },
  listStockText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  listCardActions: {
    justifyContent: 'center',
    marginLeft: 8
  },
  listEditButton: {
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)'
  },
  modalContent: {
    flex: 1,
    backgroundColor: colors.white
  },
  modalImageContainer: {
    height: 300,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  modalEmoji: {
    fontSize: 120
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBody: {
    padding: 20
  },
  modalProductName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10
  },
  modalRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10
  },
  modalRatingText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 4
  },
  modalReviews: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 10
  },
  modalSku: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  modalSkuText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight
  },
  modalCurrentPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.success,
    marginRight: 10
  },
  modalOriginalPrice: {
    fontSize: 16,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
    marginRight: 10
  },
  modalDiscount: {
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold'
  },
  modalInfoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 12
  },
  modalInfoItem: {
    alignItems: 'center'
  },
  modalInfoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 5,
    marginBottom: 2
  },
  modalInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary
  },
  modalSection: {
    marginBottom: 20
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10
  },
  modalDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 30
  },
  modalEditButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8
  },
  modalEditButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  modalDeleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.errorLight,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8
  },
  modalDeleteButtonText: {
    color: colors.error,
    fontSize: 16,
    fontWeight: '600'
  },
  // Delete Modal Styles
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  deleteModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    alignItems: 'center'
  },
  deleteModalIcon: {
    marginBottom: 15
  },
  deleteModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10
  },
  deleteModalText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%'
  },
  deleteModalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10
  },
  deleteModalCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600'
  },
  deleteModalConfirmBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 10
  },
  deleteModalConfirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600'
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 15,
    marginBottom: 5
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20
  },
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25
  },
  emptyStateButtonText: {
    color: colors.white,
    fontWeight: '600'
  }
}

export default ProductsScreen
