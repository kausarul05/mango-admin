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
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const { width, height } = Dimensions.get('window');

const OrdersScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      orderNumber: 'MGO-2024-0001',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 98765 43210',
        address: '123 Main St, Mumbai, Maharashtra 400001',
        avatar: '👨'
      },
      items: [
        { name: 'Alphonso Mango', quantity: 2, price: 599, total: 1198, image: '🥭' },
        { name: 'Organic Mango', quantity: 1, price: 799, total: 799, image: '🥭' }
      ],
      totalAmount: 1997,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      orderDate: '2024-01-15T10:30:00',
      deliveryDate: '2024-01-18',
      trackingId: 'TRK123456789',
      deliveryPartner: 'BlueDart'
    },
    {
      id: 'ORD-002',
      orderNumber: 'MGO-2024-0002',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 87654 32109',
        address: '456 Park Avenue, Delhi, 110001',
        avatar: '👩'
      },
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 2499, total: 2499, image: '🎧' },
        { name: 'Power Bank', quantity: 2, price: 1299, total: 2598, image: '🔋' }
      ],
      totalAmount: 5097,
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-14T15:45:00',
      deliveryDate: '2024-01-19',
      trackingId: 'TRK987654321',
      deliveryPartner: 'Delhivery'
    },
    {
      id: 'ORD-003',
      orderNumber: 'MGO-2024-0003',
      customer: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 76543 21098',
        address: '789 Lake View, Bangalore, 560001',
        avatar: '👨‍💼'
      },
      items: [
        { name: 'Premium Mango Box', quantity: 3, price: 1299, total: 3897, image: '🥭' }
      ],
      totalAmount: 3897,
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Net Banking',
      orderDate: '2024-01-13T09:15:00',
      deliveryDate: '2024-01-17',
      trackingId: 'TRK456789123',
      deliveryPartner: 'DTDC'
    },
    {
      id: 'ORD-004',
      orderNumber: 'MGO-2024-0004',
      customer: {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+91 65432 10987',
        address: '321 Beach Road, Chennai, 600001',
        avatar: '👩‍🦰'
      },
      items: [
        { name: 'Smart Watch', quantity: 1, price: 3999, total: 3999, image: '⌚' },
        { name: 'Phone Case', quantity: 2, price: 499, total: 998, image: '📱' }
      ],
      totalAmount: 4997,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'COD',
      orderDate: '2024-01-12T14:20:00',
      deliveryDate: '2024-01-16',
      trackingId: 'TRK789123456',
      deliveryPartner: 'Amazon Logistics'
    },
    {
      id: 'ORD-005',
      orderNumber: 'MGO-2024-0005',
      customer: {
        name: 'Tom Brown',
        email: 'tom@example.com',
        phone: '+91 54321 09876',
        address: '654 Forest Hill, Pune, 411001',
        avatar: '👨‍🦱'
      },
      items: [
        { name: 'Organic Mangoes', quantity: 5, price: 799, total: 3995, image: '🥭' }
      ],
      totalAmount: 3995,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'UPI',
      orderDate: '2024-01-11T11:00:00',
      deliveryDate: null,
      trackingId: null,
      deliveryPartner: null
    }
  ]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: '#FFF9C4', text: '#F57C00', icon: '#F57C00' };
      case 'processing': return { bg: '#E3F2FD', text: '#1976D2', icon: '#1976D2' };
      case 'shipped': return { bg: '#E8F5E9', text: '#388E3C', icon: '#388E3C' };
      case 'delivered': return { bg: '#E8F5E9', text: '#2E7D32', icon: '#4CAF50' };
      case 'cancelled': return { bg: '#FFEBEE', text: '#D32F2F', icon: '#F44336' };
      default: return { bg: '#F5F5F5', text: '#9E9E9E', icon: '#9E9E9E' };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return 'time-outline';
      case 'processing': return 'sync-outline';
      case 'shipped': return 'car-outline';
      case 'delivered': return 'checkmark-circle-outline';
      case 'cancelled': return 'close-circle-outline';
      default: return 'help-outline';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setStatusModalVisible(false);
    
    // Show success message
    Alert.alert(
      'Status Updated ✓',
      `Order #${updatedOrders.find(o => o.id === orderId)?.orderNumber} is now ${getStatusText(newStatus)}`,
      [{ text: 'OK', onPress: () => {} }]
    );
  };

  const getStatusOptions = (currentStatus) => {
    const statusFlow = {
      pending: [
        { value: 'processing', label: 'Process Order', icon: 'sync', color: colors.info },
        { value: 'cancelled', label: 'Cancel Order', icon: 'close', color: colors.error }
      ],
      processing: [
        { value: 'shipped', label: 'Mark as Shipped', icon: 'car', color: colors.secondary },
        { value: 'cancelled', label: 'Cancel Order', icon: 'close', color: colors.error }
      ],
      shipped: [
        { value: 'delivered', label: 'Mark as Delivered', icon: 'checkmark', color: colors.success },
        { value: 'cancelled', label: 'Cancel Order', icon: 'close', color: colors.error }
      ],
      delivered: [],
      cancelled: []
    };
    return statusFlow[currentStatus] || [];
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab !== 'all' && order.status !== selectedTab) return false;
    if (searchQuery) {
      return order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             order.id.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const OrderCard = ({ order, index }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const expandAnim = useRef(new Animated.Value(0)).current;
    const statusStyle = getStatusColor(order.status);
    
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
      Animated.spring(expandAnim, {
        toValue: isExpanded ? 0 : 1,
        useNativeDriver: false,
      }).start();
    };

    const cardHeight = expandAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [140, 320]
    });

    return (
      <Animated.View style={[styles.orderCard, { transform: [{ translateX: slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50 * (index + 1), 0]
      })}] }]}>
        <TouchableOpacity activeOpacity={0.9} onPress={toggleExpand}>
          {/* Order Header */}
          <View style={styles.orderHeader}>
            <View style={styles.orderLeft}>
              <View style={[styles.orderIcon, { backgroundColor: statusStyle.bg }]}>
                <Ionicons name={getStatusIcon(order.status)} size={20} color={statusStyle.icon} />
              </View>
              <View>
                <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                <Text style={styles.orderDate}>{formatDate(order.orderDate)}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>
                {getStatusText(order.status)}
              </Text>
            </View>
          </View>

          {/* Customer Info */}
          <View style={styles.customerSection}>
            <Text style={styles.customerAvatar}>{order.customer.avatar}</Text>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{order.customer.name}</Text>
              <Text style={styles.customerContact}>{order.customer.phone}</Text>
            </View>
            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Total</Text>
              <Text style={styles.amountValue}>₹{order.totalAmount.toLocaleString()}</Text>
            </View>
          </View>

          {/* Expandable Content */}
          <Animated.View style={{ maxHeight: expandAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 500]
          }), overflow: 'hidden' }}>
            <View style={styles.expandedContent}>
              {/* Items List */}
              <View style={styles.itemsSection}>
                <Text style={styles.sectionLabel}>Items:</Text>
                {order.items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemEmoji}>{item.image}</Text>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>₹{item.total.toLocaleString()}</Text>
                  </View>
                ))}
              </View>

              {/* Delivery Info */}
              {order.deliveryDate && (
                <View style={styles.deliverySection}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.deliveryText}>
                    Est. Delivery: {new Date(order.deliveryDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long'
                    })}
                  </Text>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.viewDetailsBtn}
                  onPress={() => {
                    setSelectedOrder(order);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons name="eye-outline" size={18} color={colors.primary} />
                  <Text style={styles.viewDetailsBtnText}>View Details</Text>
                </TouchableOpacity>
                
                {getStatusOptions(order.status).length > 0 && (
                  <TouchableOpacity 
                    style={styles.updateStatusBtn}
                    onPress={() => {
                      setSelectedOrder(order);
                      setStatusModalVisible(true);
                    }}
                  >
                    <Ionicons name="refresh-outline" size={18} color={colors.white} />
                    <Text style={styles.updateStatusBtnText}>Update Status</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const FilterChip = ({ label, count, isActive, onPress }) => (
    <TouchableOpacity 
      style={[styles.filterChip, isActive && styles.filterChipActive]}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
        {label}
      </Text>
      {count > 0 && (
        <View style={[styles.filterChipBadge, isActive && styles.filterChipBadgeActive]}>
          <Text style={[styles.filterChipBadgeText, isActive && styles.filterChipBadgeTextActive]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const OrderDetailModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Details</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedOrder && (
              <>
                {/* Order Info */}
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                    <Text style={styles.detailTitle}>Order Information</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Order ID:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.orderNumber}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>
                      {new Date(selectedOrder.orderDate).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <View style={[styles.statusChip, { backgroundColor: getStatusColor(selectedOrder.status).bg }]}>
                      <Text style={[styles.statusChipText, { color: getStatusColor(selectedOrder.status).text }]}>
                        {getStatusText(selectedOrder.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Customer Info */}
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="person-outline" size={20} color={colors.primary} />
                    <Text style={styles.detailTitle}>Customer Details</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customer.name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customer.email}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customer.phone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Address:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.customer.address}</Text>
                  </View>
                </View>

                {/* Payment Info */}
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="card-outline" size={20} color={colors.primary} />
                    <Text style={styles.detailTitle}>Payment Details</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status:</Text>
                    <Text style={[styles.detailValue, { color: selectedOrder.paymentStatus === 'paid' ? colors.success : colors.error }]}>
                      {selectedOrder.paymentStatus.toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Method:</Text>
                    <Text style={styles.detailValue}>{selectedOrder.paymentMethod}</Text>
                  </View>
                </View>

                {/* Order Items */}
                <View style={styles.detailSection}>
                  <View style={styles.detailHeader}>
                    <Ionicons name="cube-outline" size={20} color={colors.primary} />
                    <Text style={styles.detailTitle}>Order Items</Text>
                  </View>
                  {selectedOrder.items.map((item, idx) => (
                    <View key={idx} style={styles.modalItemRow}>
                      <Text style={styles.modalItemEmoji}>{item.image}</Text>
                      <View style={styles.modalItemDetails}>
                        <Text style={styles.modalItemName}>{item.name}</Text>
                        <Text style={styles.modalItemQty}>Quantity: {item.quantity}</Text>
                      </View>
                      <Text style={styles.modalItemTotal}>₹{item.total.toLocaleString()}</Text>
                    </View>
                  ))}
                  <View style={styles.modalTotalRow}>
                    <Text style={styles.modalTotalLabel}>Total Amount:</Text>
                    <Text style={styles.modalTotalValue}>₹{selectedOrder.totalAmount.toLocaleString()}</Text>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const StatusUpdateModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={statusModalVisible}
      onRequestClose={() => setStatusModalVisible(false)}
    >
      <View style={styles.statusModalOverlay}>
        <View style={styles.statusModalContent}>
          <View style={styles.statusModalHeader}>
            <Ionicons name="refresh-circle" size={40} color={colors.primary} />
            <Text style={styles.statusModalTitle}>Update Order Status</Text>
            <Text style={styles.statusModalSubtitle}>
              Order: {selectedOrder?.orderNumber}
            </Text>
          </View>
          
          {getStatusOptions(selectedOrder?.status).map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.statusOptionCard}
              onPress={() => updateOrderStatus(selectedOrder.id, option.value)}
            >
              <View style={[styles.statusOptionIcon, { backgroundColor: option.color + '15' }]}>
                <Ionicons name={option.icon} size={28} color={option.color} />
              </View>
              <View style={styles.statusOptionContent}>
                <Text style={styles.statusOptionTitle}>{option.label}</Text>
                <Text style={styles.statusOptionDesc}>
                  {option.value === 'processing' && 'Confirm and start processing this order'}
                  {option.value === 'shipped' && 'Order has been dispatched for delivery'}
                  {option.value === 'delivered' && 'Mark order as successfully delivered'}
                  {option.value === 'cancelled' && 'Cancel this order and process refund'}
                </Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={option.color} />
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.statusCancelButton}
            onPress={() => setStatusModalVisible(false)}
          >
            <Text style={styles.statusCancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <Text style={styles.headerSubtitle}>Manage all customer orders</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by order ID or customer name..."
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

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        <FilterChip 
          label="All Orders" 
          count={statusCounts.all}
          isActive={selectedTab === 'all'}
          onPress={() => setSelectedTab('all')}
        />
        <FilterChip 
          label="Pending" 
          count={statusCounts.pending}
          isActive={selectedTab === 'pending'}
          onPress={() => setSelectedTab('pending')}
        />
        <FilterChip 
          label="Processing" 
          count={statusCounts.processing}
          isActive={selectedTab === 'processing'}
          onPress={() => setSelectedTab('processing')}
        />
        <FilterChip 
          label="Shipped" 
          count={statusCounts.shipped}
          isActive={selectedTab === 'shipped'}
          onPress={() => setSelectedTab('shipped')}
        />
        <FilterChip 
          label="Delivered" 
          count={statusCounts.delivered}
          isActive={selectedTab === 'delivered'}
          onPress={() => setSelectedTab('delivered')}
        />
        <FilterChip 
          label="Cancelled" 
          count={statusCounts.cancelled}
          isActive={selectedTab === 'cancelled'}
          onPress={() => setSelectedTab('cancelled')}
        />
      </ScrollView>

      {/* Orders List */}
      <Animated.FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <OrderCard order={item} index={index} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="cart-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyStateTitle}>No Orders Found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try different search terms' : 'No orders in this category'}
            </Text>
          </View>
        }
      />

      {/* Modals */}
      <OrderDetailModal />
      <StatusUpdateModal />
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
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white + 'CC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  filtersContainer: {
    marginBottom: 10,
    maxHeight: 100
  },
  filtersContent: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    maxHeight: 100
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 36
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 6,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  filterChipBadge: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  filterChipBadgeActive: {
    backgroundColor: colors.white,
  },
  filterChipBadgeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipBadgeTextActive: {
    color: colors.primary,
  },
  ordersList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  orderNumber: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  customerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.backgroundLight,
  },
  customerAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  customerContact: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  amountSection: {
    alignItems: 'flex-end',
  },
  amountLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  expandedContent: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    backgroundColor: colors.white,
  },
  itemsSection: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success,
  },
  deliverySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  deliveryText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 5,
  },
  viewDetailsBtnText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 5,
  },
  updateStatusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.primary,
    marginLeft: 5,
  },
  updateStatusBtnText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 5,
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
  closeBtn: {
    padding: 5,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 13,
    color: colors.textSecondary,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: colors.textPrimary,
  },
  statusChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  modalItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  modalItemDetails: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  modalItemQty: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  modalItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
  },
  modalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  modalTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.success,
  },
  statusModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: height * 0.8,
  },
  statusModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statusModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginTop: 10,
  },
  statusModalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 5,
  },
  statusOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statusOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  statusOptionContent: {
    flex: 1,
  },
  statusOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statusOptionDesc: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusCancelButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: colors.grayLight,
  },
  statusCancelButtonText: {
    fontSize: 14,
    color: colors.textSecondary,
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
  },
};

export default OrdersScreen;