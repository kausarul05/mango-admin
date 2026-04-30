import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Sample data - replace with API call
  const [revenueData, setRevenueData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [12500, 15800, 14200, 18900, 22400, 26800],
    }],
  });

  const [categoryData, setCategoryData] = useState([
    {
      name: 'Mangoes',
      population: 45,
      color: colors.primary,
      legendFontColor: colors.textPrimary,
    },
    {
      name: 'Electronics',
      population: 25,
      color: colors.secondary,
      legendFontColor: colors.textPrimary,
    },
    {
      name: 'Clothing',
      population: 20,
      color: colors.info,
      legendFontColor: colors.textPrimary,
    },
    {
      name: 'Others',
      population: 10,
      color: colors.warning,
      legendFontColor: colors.textPrimary,
    },
  ]);

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'John Doe', amount: 299, status: 'pending', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', amount: 549, status: 'processing', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Mike Johnson', amount: 199, status: 'delivered', date: '2024-01-13' },
    { id: 'ORD-004', customer: 'Sarah Wilson', amount: 899, status: 'shipped', date: '2024-01-12' },
    { id: 'ORD-005', customer: 'Tom Brown', amount: 449, status: 'pending', date: '2024-01-11' },
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalOrders: 156,
        totalRevenue: 112450,
        totalProducts: 48,
        totalCustomers: 89,
        pendingOrders: 23,
        completedOrders: 133,
      });
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return colors.warning;
      case 'processing': return colors.info;
      case 'shipped': return colors.secondary;
      case 'delivered': return colors.success;
      default: return colors.gray;
    }
  };

  const getStatusBadge = (status) => {
    return {
      backgroundColor: getStatusColor(status) + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    };
  };

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  return (
    <ScrollView 
      style={globalStyles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          icon="📦" 
          color={colors.primary}
        />
        <StatCard 
          title="Total Revenue" 
          value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} 
          icon="💰" 
          color={colors.success}
        />
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon="🛍️" 
          color={colors.info}
        />
        <StatCard 
          title="Customers" 
          value={stats.totalCustomers} 
          icon="👥" 
          color={colors.secondary}
        />
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Revenue Overview</Text>
        <LineChart
          data={revenueData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: colors.white,
            backgroundGradientFrom: colors.white,
            backgroundGradientTo: colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) => colors.primary,
            labelColor: (opacity = 1) => colors.textSecondary,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: colors.primary,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      {/* Category Distribution */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Sales by Category</Text>
        <PieChart
          data={categoryData}
          width={width - 40}
          height={200}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Recent Orders */}
      <View style={styles.recentOrdersContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {recentOrders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>{order.id}</Text>
              <View style={getStatusBadge(order.status)}>
                <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.customerName}>{order.customer}</Text>
              <Text style={styles.orderDate}>{order.date}</Text>
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.orderAmount}>₹{order.amount}</Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddProduct')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionText}>Add Product</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Manage Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionText}>Edit Products</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = {
  header: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.white + 'CC',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    marginTop: -20,
  },
  statCard: {
    width: '46%',
    backgroundColor: colors.card,
    margin: '2%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  chartContainer: {
    backgroundColor: colors.card,
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  recentOrdersContainer: {
    backgroundColor: colors.card,
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  orderCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  orderStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderDetails: {
    marginBottom: 8,
  },
  customerName: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 11,
    color: colors.gray,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.success,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary + '10',
    borderRadius: 6,
  },
  viewButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  quickActions: {
    backgroundColor: colors.card,
    margin: 15,
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
};

export default DashboardScreen;