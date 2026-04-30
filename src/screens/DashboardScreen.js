import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const fadeAnim = new Animated.Value(0);

  const [stats, setStats] = useState({
    totalOrders: 156,
    totalRevenue: 112450,
    totalProducts: 48,
    totalCustomers: 89,
    pendingOrders: 23,
    completedOrders: 133,
    growth: '+15%',
  });

  const [revenueData, setRevenueData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [3200, 4500, 2800, 5800, 6900, 8700, 12500],
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
      color: colors.accent,
      legendFontColor: colors.textPrimary,
    },
  ]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const StatCard = ({ title, value, icon, color, growth }) => (
    <TouchableOpacity style={styles.statCard} activeOpacity={0.9}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={28} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {growth && (
        <View style={styles.growthBadge}>
          <Ionicons name="trending-up" size={12} color={colors.success} />
          <Text style={styles.growthText}>{growth}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, title, color, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <FontAwesome5 name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back 👋</Text>
            <Text style={styles.userName}>Admin</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color={colors.white} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileIcon}>
              <Ionicons name="person-circle-outline" size={40} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard 
            title="Total Revenue" 
            value={`₹${(stats.totalRevenue / 1000).toFixed(1)}k`} 
            icon="wallet-outline"
            color={colors.success}
            growth={stats.growth}
          />
          <StatCard 
            title="Total Orders" 
 value={stats.totalOrders} 
            icon="cart-outline"
            color={colors.primary}
          />
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts} 
            icon="cube-outline"
            color={colors.info}
          />
          <StatCard 
            title="Customers" 
            value={stats.totalCustomers} 
            icon="people-outline"
            color={colors.accent}
          />
        </View>

        {/* Period Selector */}
        <View style={styles.periodSelector}>
          {['week', 'month', 'year'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period && styles.periodTextActive,
                ]}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Revenue Overview</Text>
            <TouchableOpacity>
              <Text style={styles.detailsText}>Details →</Text>
            </TouchableOpacity>
          </View>
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

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickAction 
              icon="plus-circle" 
              title="Add Product" 
              color={colors.primary}
              onPress={() => navigation.navigate('AddProduct')}
            />
            <QuickAction 
              icon="shopping-bag" 
              title="Manage Orders" 
              color={colors.success}
              onPress={() => navigation.navigate('Orders')}
            />
            <QuickAction 
              icon="edit" 
              title="Edit Products" 
              color={colors.info}
              onPress={() => navigation.navigate('Products')}
            />
            <QuickAction 
              icon="chart-line" 
              title="Analytics" 
              color={colors.accent}
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Category & Recent Orders Row */}
        <View style={styles.rowContainer}>
          {/* Category Distribution */}
          <View style={[styles.chartContainer, styles.halfWidth]}>
            <Text style={styles.sectionTitle}>Top Categories</Text>
            <PieChart
              data={categoryData}
              width={width / 2 - 30}
              height={160}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          </View>

          {/* Pending Orders Summary */}
          <View style={[styles.pendingContainer, styles.halfWidth]}>
            <Text style={styles.sectionTitle}>Pending Orders</Text>
            <Text style={styles.pendingCount}>{stats.pendingOrders}</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Orders')}
            >
              <Text style={styles.viewAllButtonText}>View Orders</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            {[
              { id: 1, action: 'New order #ORD-001', time: '2 min ago', icon: 'cart' },
              { id: 2, action: 'Product "Mango Premium" added', time: '1 hour ago', icon: 'add-circle' },
              { id: 3, action: 'Order #ORD-002 delivered', time: '3 hours ago', icon: 'checkmark-circle' },
              { id: 4, action: 'New customer registered', time: '5 hours ago', icon: 'person-add' },
            ].map((activity) => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name={activity.icon} size={20} color={colors.primary} />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </ScrollView>
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
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: colors.white + 'CC',
    marginBottom: 5,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationIcon: {
    marginRight: 15,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileIcon: {
    marginLeft: 5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 15,
    marginTop: -20,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.card,
    margin: '1%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  growthText: {
    fontSize: 10,
    color: colors.success,
    marginLeft: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    margin: 15,
    padding: 5,
    borderRadius: 25,
    elevation: 2,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  chartContainer: {
    backgroundColor: colors.card,
    margin: 15,
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  detailsText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActionsContainer: {
    margin: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionCard: {
    width: '23%',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickActionIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 5,
  },
  pendingContainer: {
    backgroundColor: colors.warningLight,
    padding: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingCount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.warning,
    marginVertical: 10,
  },
  viewAllButton: {
    backgroundColor: colors.warning,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewAllButtonText: {
    color: colors.white,
    marginRight: 5,
    fontWeight: '600',
  },
  activityContainer: {
    backgroundColor: colors.card,
    margin: 15,
    padding: 15,
    borderRadius: 20,
    marginBottom: 30,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewAllText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  activityList: {
    marginTop: 5,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityIcon: {
    width: 35,
    height: 35,
    borderRadius: 17,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
};

export default DashboardScreen;