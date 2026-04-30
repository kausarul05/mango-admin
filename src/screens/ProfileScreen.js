import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const ProfileScreen = ({ navigation }) => {
  const [adminData, setAdminData] = useState({
    name: 'Admin User',
    email: 'admin@mangostore.com',
    phone: '+91 98765 43210',
    role: 'Super Admin',
    storeName: 'Mango Store',
    storeEmail: 'store@mangostore.com',
    storePhone: '+91 12345 67890',
    address: '123 Business Park, Mumbai, Maharashtra 400001',
    joinDate: 'January 1, 2024',
    avatar: '👨‍💼',
  });

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');

  const stats = [
    { label: 'Total Sales', value: '₹1,24,500', icon: 'trending-up', color: colors.success },
    { label: 'Products', value: '48', icon: 'cube', color: colors.primary },
    { label: 'Orders', value: '156', icon: 'cart', color: colors.info },
    { label: 'Customers', value: '89', icon: 'people', color: colors.accent },
  ];

  const menuItems = [
    { icon: 'storefront-outline', title: 'Store Settings', subtitle: 'Manage your store information', color: colors.primary },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Configure alert preferences', color: colors.info },
    { icon: 'shield-checkmark-outline', title: 'Security', subtitle: 'Password & security settings', color: colors.success },
    { icon: 'language-outline', title: 'Language', subtitle: 'Choose your preferred language', color: colors.accent },
    { icon: 'help-circle-outline', title: 'Help & Support', subtitle: 'Get help or contact support', color: colors.warning },
    { icon: 'information-circle-outline', title: 'About', subtitle: 'App version & information', color: colors.gray },
  ];

  const handleEdit = (field, currentValue) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    setAdminData({ ...adminData, [editField]: editValue });
    setEditModalVisible(false);
    Alert.alert('Success', `${editField} updated successfully`);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userRole');
    navigation.replace('Login');
  };

  const StatCard = ({ label, value, icon, color }) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const MenuItem = ({ icon, title, subtitle, color, onPress }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{title}</Text>
        <Text style={styles.menuSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.gray} />
    </TouchableOpacity>
  );

  const InfoRow = ({ label, value, icon, onEdit }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <Ionicons name={icon} size={20} color={colors.primary} />
        <View>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} style={styles.editButton}>
          <Ionicons name="create-outline" size={18} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  const EditModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
      onRequestClose={() => setEditModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit {editField}</Text>
          <TextInput
            style={styles.modalInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder={`Enter ${editField}`}
            placeholderTextColor={colors.textDisabled}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalSaveButton}
              onPress={saveEdit}
            >
              <Text style={styles.modalSaveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const LogoutModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={logoutModalVisible}
      onRequestClose={() => setLogoutModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.logoutModalContent}>
          <View style={styles.logoutIcon}>
            <Ionicons name="log-out-outline" size={60} color={colors.error} />
          </View>
          <Text style={styles.logoutTitle}>Logout?</Text>
          <Text style={styles.logoutText}>
            Are you sure you want to logout? You'll need to login again to access your account.
          </Text>
          <View style={styles.logoutButtons}>
            <TouchableOpacity 
              style={styles.logoutCancelButton}
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.logoutCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.logoutConfirmButton}
              onPress={handleLogout}
            >
              <Text style={styles.logoutConfirmText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account</Text>
        </View>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.profileImageContainer}>
          <Text style={styles.profileEmoji}>{adminData.avatar}</Text>
          <TouchableOpacity style={styles.editProfileButton}>
            <Ionicons name="camera" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>{adminData.name}</Text>
        <Text style={styles.profileRole}>{adminData.role}</Text>
        <View style={styles.profileBadge}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.profileBadgeText}>Verified Account</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </View>
      </View>

      {/* Personal Information */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Bulk edit feature coming soon!')}>
            <Text style={styles.editAllText}>Edit All</Text>
          </TouchableOpacity>
        </View>
        
        <InfoRow 
          label="Full Name" 
          value={adminData.name} 
          icon="person-outline"
          onEdit={() => handleEdit('name', adminData.name)}
        />
        <InfoRow 
          label="Email Address" 
          value={adminData.email} 
          icon="mail-outline"
          onEdit={() => handleEdit('email', adminData.email)}
        />
        <InfoRow 
          label="Phone Number" 
          value={adminData.phone} 
          icon="call-outline"
          onEdit={() => handleEdit('phone', adminData.phone)}
        />
        <InfoRow 
          label="Member Since" 
          value={adminData.joinDate} 
          icon="calendar-outline"
        />
      </View>

      {/* Store Information */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Store Information</Text>
        
        <InfoRow 
          label="Store Name" 
          value={adminData.storeName} 
          icon="storefront-outline"
          onEdit={() => handleEdit('storeName', adminData.storeName)}
        />
        <InfoRow 
          label="Store Email" 
          value={adminData.storeEmail} 
          icon="mail-outline"
          onEdit={() => handleEdit('storeEmail', adminData.storeEmail)}
        />
        <InfoRow 
          label="Store Phone" 
          value={adminData.storePhone} 
          icon="call-outline"
          onEdit={() => handleEdit('storePhone', adminData.storePhone)}
        />
        <InfoRow 
          label="Store Address" 
          value={adminData.address} 
          icon="location-outline"
          onEdit={() => handleEdit('address', adminData.address)}
        />
      </View>

      {/* Preferences */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="notifications-outline" size={22} color={colors.primary} />
            <View>
              <Text style={styles.preferenceTitle}>Push Notifications</Text>
              <Text style={styles.preferenceSubtitle}>Receive order updates and alerts</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: colors.grayLight, true: colors.primary + '80' }}
            thumbColor={notifications ? colors.primary : colors.gray}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="mail-outline" size={22} color={colors.primary} />
            <View>
              <Text style={styles.preferenceTitle}>Email Alerts</Text>
              <Text style={styles.preferenceSubtitle}>Receive email notifications</Text>
            </View>
          </View>
          <Switch
            value={emailAlerts}
            onValueChange={setEmailAlerts}
            trackColor={{ false: colors.grayLight, true: colors.primary + '80' }}
            thumbColor={emailAlerts ? colors.primary : colors.gray}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="moon-outline" size={22} color={colors.primary} />
            <View>
              <Text style={styles.preferenceTitle}>Dark Mode</Text>
              <Text style={styles.preferenceSubtitle}>Switch to dark theme</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.grayLight, true: colors.primary + '80' }}
            thumbColor={darkMode ? colors.primary : colors.gray}
          />
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Settings & Support</Text>
        {menuItems.map((item, index) => (
          <MenuItem 
            key={index}
            {...item}
            onPress={() => Alert.alert('Coming Soon', `${item.title} feature coming soon!`)}
          />
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => setLogoutModalVisible(true)}
      >
        <Ionicons name="log-out-outline" size={22} color={colors.error} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.copyrightText}>© 2024 Mango Store. All rights reserved.</Text>
      </View>

      {/* Modals */}
      <EditModal />
      <LogoutModal />
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
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerContent: {
    alignItems: 'center',
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
  profileCard: {
    backgroundColor: colors.white,
    margin: 20,
    marginTop: -30,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileEmoji: {
    fontSize: 70,
    width: 100,
    height: 100,
    textAlign: 'center',
    lineHeight: 100,
    backgroundColor: colors.primaryLight + '20',
    borderRadius: 50,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  profileBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoSection: {
    backgroundColor: colors.white,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  editAllText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  editButton: {
    padding: 5,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  preferenceSubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    gap: 10,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  copyrightText: {
    fontSize: 11,
    color: colors.textDisabled,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSaveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
  },
  modalSaveText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutModalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  },
  logoutIcon: {
    marginBottom: 15,
  },
  logoutTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButtons: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.grayLight,
    borderRadius: 10,
  },
  logoutCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  logoutConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: 10,
  },
  logoutConfirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
};

export default ProfileScreen;