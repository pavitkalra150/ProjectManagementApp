import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import AuthScreen from "./src/screens/AuthScreen";
import ProjectScreen from "./src/screens/ProjectScreen";
import TaskScreen from "./src/screens/TaskScreen";
import TaskDetailsScreen from "./src/screens/TaskDetailsScreen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; // Import your desired icon set

const Stack = createStackNavigator();
const Tab = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Auth"
          options={{ headerShown: false }}
          component={AuthScreen}
        />
        <Stack.Screen
          name="Main"
          options={{ headerShown: false }}
        >
          {props => <MainNavigator {...props} />}
        </Stack.Screen>
        <Stack.Screen name="TaskDetails" component={TaskDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainNavigator({ route }) {
  const { email } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Projects"
      activeColor="#00A9B4"
      inactiveColor="#cccccc"
      barStyle={styles.tabBar}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Project"
        options={{
          tabBarLabel: "Projects",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
          tabBarStyle: styles.tab,
        }}
      >
        {props => <ProjectScreen {...props} email={email} />}
      </Tab.Screen>
      <Tab.Screen
        name="Task"
        component={TaskScreen}
        options={{
          tabBarLabel: "Tasks",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="format-list-checkbox"
              color={color}
              size={26}
            />
          ),
          tabBarStyle: styles.tab,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = {
  tabBar: {
    backgroundColor: "#4d8d89",
  },
  tab: {
    minHeight: 50, // Adjust the height as needed
  },
};

export default App;
