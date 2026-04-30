import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import DashboardScreen from '../screens/DashboardScreen'
import OrdersScreen from '../screens/OrdersScreen'
import ProductsScreen from '../screens/ProductsScreen'
import ProfileScreen from '../screens/ProfileScreen'
import colors from '../constants/colors'
import CategoriesScreen from '../screens/CategoriesScreen'

const Tab = createBottomTabNavigator()

// Placeholder for missing screens
const PlaceholderScreen = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{title} Screen (Coming Soon)</Text>
  </View>
)

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline'
          } else if (route.name === 'Orders') {
            iconName = focused ? 'cart' : 'cart-outline'
          } else if (route.name === 'Products') {
            iconName = focused ? 'cube' : 'cube-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 10,
          paddingTop: 5
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500'
        },
        headerShown: false
      })}
    >
      <Tab.Screen name='Dashboard' component={DashboardScreen} />
      <Tab.Screen
        name='Categories'
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? 'apps' : 'apps-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />
      <Tab.Screen name='Profile' component={ProfileScreen} />
      <Tab.Screen name='Orders' component={OrdersScreen} />
      <Tab.Screen name='Products' component={ProductsScreen} />
    </Tab.Navigator>
  )
}

export default BottomTabNavigator
