import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import ProjectScreen from "../screens/ProjectScreen"; // Import your existing ProjectScreen
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Drawer = createDrawerNavigator();

const CustomSidebarMenu = (props) => {
  return (
    <View style={styles.sidebar}>
      <Text style={styles.sidebarHeader}>Hello, {props.route.params.email}</Text>
      <Button
        title="Logout"
        onPress={() => {
          // Implement your logout logic here
        }}
      />
    </View>
  );
};

const Sidebar = ({ navigation, route }) => {
  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Projects"
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
      >
        <Drawer.Screen
          name="Projects"
          component={ProjectScreen}
          initialParams={{ email: route.params.email }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    flex: 1,
    backgroundColor: "#9DB5B2",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidebarHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
});

export default Sidebar;
