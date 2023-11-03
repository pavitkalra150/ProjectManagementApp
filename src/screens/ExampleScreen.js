import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider as PaperProvider, TextInput, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();

const projects = [
  {
    id: '1',
    name: 'Project 1',
    description: 'Description of Project 1',
  },
  {
    id: '2',
    name: 'Project 2',
    description: 'Description of Project 2',
  },
];

const tasks = [
  {
    id: '1',
    name: 'Task 1',
    description: 'Description of Task 1',
  },
  {
    id: '2',
    name: 'Task 2',
    description: 'Description of Task 2',
  },
];

const user = {
  name: 'John Doe',
};

const ProjectScreen = ({ navigation }) => {
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [showInputs, setShowInputs] = useState(false);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Tasks', { project: item })}
      style={styles.projectItem}
    >
      <View style={styles.projectDetails}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const addNewProject = () => {
    if (newProjectName.trim() === '') {
      alert('Project name cannot be empty');
      return;
    }

    const newProject = {
      id: (projects.length + 1).toString(),
      name: newProjectName,
      description: newProjectDescription,
    };

    projects.push(newProject);
    setNewProjectName('');
    setNewProjectDescription('');
    setShowInputs(false);
    navigation.navigate('Projects');
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>Hello, {user.name}!</Text>
        <Text style={styles.projectHeader}>Your Projects:</Text>
      </View>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

{showInputs && (
  <View>
    <TextInput
      label="Project Name"
      value={newProjectName}
      onChangeText={setNewProjectName}
      style={styles.input}
    />
    <TextInput
      label="Project Description"
      value={newProjectDescription}
      onChangeText={setNewProjectDescription}
      style={styles.input}
    />
    <View style={styles.centeredContainer}>
      <Button mode="contained" onPress={addNewProject} style={styles.button}>
        Add Project
      </Button>
    </View>
  </View>
)}

     

      <Button
        mode="contained"
        onPress={() => setShowInputs(!showInputs)}
        style={styles.button}
      >
        {showInputs ? 'Cancel' : 'Add'}
      </Button>
    </View>
  );
};

const numColumns = 2;

const TasksScreen = ({ route }) => {
  const { project } = route.params;

  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <Text style={styles.taskName}>{item.name}</Text>
      <Text style={styles.taskDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.projectName}>Tasks for {project.name}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
};

const HomeIcon = () => (
  <MaterialCommunityIcons name="home" color="white" size={26} />
);
const TasksIcon = () => (
  <MaterialCommunityIcons name="format-list-checkbox" color="white" size={26} />
);

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Projects"
          activeColor="white"
          inactiveColor="#cccccc"
          barStyle={{ backgroundColor: '#9DB5B2' }}
        >
          <Tab.Screen
            name="Projects"
            component={ProjectScreen}
            options={{
              tabBarLabel: 'Projects',
              tabBarIcon: HomeIcon,
            }}
          />
          <Tab.Screen
            name="Tasks"
            component={TasksScreen}
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: TasksIcon,
              tabBarStyle: { backgroundColor: 'grey' },
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9DB5B2',
    padding: 16,
  },
  userInfo: {
    marginTop: 30,
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  projectHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'white',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  projectDetails: {
    flex: 1,
  },
  projectName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
  },
  taskItem: {
    flex: 1,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
