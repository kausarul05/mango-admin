import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const AddEditProductScreen = ({ navigation, route }) => {
  const product = route.params?.product || null;
  const isEditing = !!product;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'mangoes',
    price: '',
    originalPrice: '',
    discount: '',
    quantity: '',
    unit: 'kg',
    description: '',
    stock: '',
    isActive: true,
    isFeatured: false,
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { id: 'mangoes', name: 'Mangoes', icon: '🥭', unit: 'kg' },
    { id: 'electronics', name: 'Electronics', icon: '💻', unit: 'piece' },
    { id: 'accessories', name: 'Accessories', icon: '📱', unit: 'piece' },
  ];

  const units = ['kg', 'piece', 'box', 'pack', 'dozen'];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        originalPrice: product.originalPrice.toString(),
        discount: product.discount.toString(),
        quantity: product.quantity.toString(),
        unit: product.unit,
        description: product.description,
        stock: product.stock.toString(),
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      });
    }
  }, [product]);

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDiscount = (original, current) => {
    if (original && current) {
      const discountPercent = ((original - current) / original) * 100;
      return Math.round(discountPercent);
    }
    return 0;
  };

  const handlePriceChange = (type, value) => {
    if (type === 'price') {
      setFormData({ ...formData, price: value });
      if (formData.originalPrice) {
        const discount = calculateDiscount(parseFloat(formData.originalPrice), parseFloat(value));
        setFormData(prev => ({ ...prev, price: value, discount: discount.toString() }));
      }
    } else if (type === 'originalPrice') {
      setFormData({ ...formData, originalPrice: value });
      if (formData.price) {
        const discount = calculateDiscount(parseFloat(value), parseFloat(formData.price));
        setFormData(prev => ({ ...prev, originalPrice: value, discount: discount.toString() }));
      }
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        isEditing ? 'Product updated successfully!' : 'Product added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 1500);
  };

  const InputField = ({ label, icon, placeholder, value, onChangeText, keyboardType, required, error }) => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelContainer}>
        <Ionicons name={icon} size={18} color={colors.primary} />
        <Text style={styles.inputLabel}>{label}</Text>
        {required && <Text style={styles.requiredStar}>*</Text>}
      </View>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDisabled}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const CategorySelector = () => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelContainer}>
        <Ionicons name="apps-outline" size={18} color={colors.primary} />
        <Text style={styles.inputLabel}>Category</Text>
        <Text style={styles.requiredStar}>*</Text>
      </View>
      <View style={styles.categoriesContainer}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryOption,
              formData.category === cat.id && styles.categoryOptionActive
            ]}
            onPress={() => {
              setFormData({ 
                ...formData, 
                category: cat.id,
                unit: cat.unit 
              });
            }}
          >
            <Text style={styles.categoryOptionIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryOptionText,
              formData.category === cat.id && styles.categoryOptionTextActive
            ]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const UnitSelector = () => (
    <View style={styles.inputGroup}>
      <View style={styles.inputLabelContainer}>
        <Ionicons name="scale-outline" size={18} color={colors.primary} />
        <Text style={styles.inputLabel}>Unit</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.unitsContainer}>
          {units.map((unit) => (
            <TouchableOpacity
              key={unit}
              style={[
                styles.unitOption,
                formData.unit === unit && styles.unitOptionActive
              ]}
              onPress={() => setFormData({ ...formData, unit })}
            >
              <Text style={[
                styles.unitOptionText,
                formData.unit === unit && styles.unitOptionTextActive
              ]}>
                {unit}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const SwitchField = ({ label, icon, value, onValueChange, description }) => (
    <View style={styles.switchContainer}>
      <View style={styles.switchLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <View>
          <Text style={styles.switchLabel}>{label}</Text>
          {description && <Text style={styles.switchDescription}>{description}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.grayLight, true: colors.primary + '80' }}
        thumbColor={value ? colors.primary : colors.gray}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <InputField
            label="Product Name"
            icon="cube-outline"
            placeholder="Enter product name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            required
            error={errors.name}
          />

          <CategorySelector />

          <InputField
            label="Description"
            icon="document-text-outline"
            placeholder="Enter product description"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            required
            error={errors.description}
            multiline
          />
        </View>

        {/* Pricing Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pricing Information</Text>
          
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <InputField
                label="Selling Price"
                icon="cash-outline"
                placeholder="0"
                value={formData.price}
                onChangeText={(text) => handlePriceChange('price', text)}
                keyboardType="numeric"
                required
                error={errors.price}
              />
            </View>
            <View style={styles.rowItem}>
              <InputField
                label="Original Price"
                icon="pricetag-outline"
                placeholder="0"
                value={formData.originalPrice}
                onChangeText={(text) => handlePriceChange('originalPrice', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {formData.discount > 0 && (
            <View style={styles.discountBadge}>
              <Ionicons name="pricetag" size={16} color={colors.error} />
              <Text style={styles.discountBadgeText}>
                {formData.discount}% OFF
              </Text>
            </View>
          )}
        </View>

        {/* Inventory Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inventory Information</Text>
          
          <View style={styles.row}>
            <View style={styles.rowItem}>
              <InputField
                label="Stock Quantity"
                icon="layers-outline"
                placeholder="0"
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="numeric"
                required
                error={errors.stock}
              />
            </View>
            <View style={styles.rowItem}>
              <InputField
                label="Quantity Per Unit"
                icon="repeat-outline"
                placeholder="1"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                keyboardType="numeric"
              />
            </View>
          </View>

          <UnitSelector />
        </View>

        {/* Product Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product Status</Text>
          
          <SwitchField
            label="Active Product"
            icon="checkmark-circle-outline"
            value={formData.isActive}
            onValueChange={(value) => setFormData({ ...formData, isActive: value })}
            description="Active products will be visible to customers"
          />

          <SwitchField
            label="Featured Product"
            icon="star-outline"
            value={formData.isFeatured}
            onValueChange={(value) => setFormData({ ...formData, isFeatured: value })}
            description="Featured products appear on homepage"
          />
        </View>

        {/* Preview Section */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Product Preview</Text>
          <View style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewEmoji}>
                {categories.find(c => c.id === formData.category)?.icon || '📦'}
              </Text>
              <View>
                <Text style={styles.previewName}>{formData.name || 'Product Name'}</Text>
                <Text style={styles.previewCategory}>
                  {categories.find(c => c.id === formData.category)?.name || 'Category'}
                </Text>
              </View>
            </View>
            <View style={styles.previewPrice}>
              <Text style={styles.previewCurrentPrice}>
                ₹{formData.price || '0'}
              </Text>
              {formData.originalPrice && formData.originalPrice > formData.price && (
                <>
                  <Text style={styles.previewOriginalPrice}>
                    ₹{formData.originalPrice}
                  </Text>
                  <Text style={styles.previewDiscount}>
                    {formData.discount}% OFF
                  </Text>
                </>
              )}
            </View>
            <View style={styles.previewMeta}>
              <Text style={styles.previewStock}>
                Stock: {formData.stock || '0'} {formData.unit}s
              </Text>
              <View style={[
                styles.previewStatus,
                { backgroundColor: formData.isActive ? colors.success + '20' : colors.error + '20' }
              ]}>
                <Text style={[
                  styles.previewStatusText,
                  { color: formData.isActive ? colors.success : colors.error }
                ]}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons 
                name={isEditing ? "checkmark-done-outline" : "add-circle-outline"} 
                size={24} 
                color={colors.white} 
              />
              <Text style={styles.submitButtonText}>
                {isEditing ? 'Update Product' : 'Add Product'}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  requiredStar: {
    color: colors.error,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: 11,
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    gap: 15,
  },
  rowItem: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 10,
    gap: 8,
  },
  categoryOptionActive: {
    backgroundColor: colors.primary,
  },
  categoryOptionIcon: {
    fontSize: 20,
  },
  categoryOptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryOptionTextActive: {
    color: colors.white,
  },
  unitsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 5,
  },
  unitOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.grayLight,
    borderRadius: 20,
  },
  unitOptionActive: {
    backgroundColor: colors.primary,
  },
  unitOptionText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  unitOptionTextActive: {
    color: colors.white,
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  discountBadgeText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewSection: {
    marginBottom: 20,
  },
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  previewName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  previewCategory: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  previewCurrentPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    marginRight: 8,
  },
  previewOriginalPrice: {
    fontSize: 14,
    color: colors.textDisabled,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  previewDiscount: {
    fontSize: 12,
    color: colors.error,
    fontWeight: 'bold',
  },
  previewMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewStock: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  previewStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  previewStatusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    gap: 10,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export default AddEditProductScreen;