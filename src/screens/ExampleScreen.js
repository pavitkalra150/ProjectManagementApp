import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {
  Provider as PaperProvider,
  TextInput,
  Button as PaperButton,
} from 'react-native-paper';
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
  {
    id: '3',
    name: 'Sample Task',
    description: 'This is a sample task for testing.',
  },
  {
    id: '4',
    name: 'Task 1',
    description: 'Description of Task 1',
  },
  
];

const user = {
  name: 'John Doe',
};

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Projects"
          activeColor="#00A9B4"
          inactiveColor="#cccccc"
          barStyle={styles.tabBar}
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
            }}
          />
          <Tab.Screen
            name="TaskDetails"
            component={TaskDetailsScreen}
            options={{
              tabBarLabel: 'Task Details',
              tabBarIcon: TaskDetailsIcon,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
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
        <View style={styles.inputContainer}>
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
          <PaperButton mode="contained" onPress={addNewProject} style={styles.button}>
            Add Project
          </PaperButton>
        </View>
      )}

      <PaperButton
        mode="contained"
        onPress={() => setShowInputs(!showInputs)}
        style={styles.toggleButton}
      >
        {showInputs ? 'Cancel' : 'Add'}
      </PaperButton>
    </View>
  );
};

const TasksScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const [numColumns, setNumColumns] = useState(2); // 2 columns view

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tasks for {project.name}</Text>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('TaskDetails', { task: item })
            }
            style={styles.taskItem}
          >
            <View style={styles.taskDetails}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  const [showMarkCompleted, setShowMarkCompleted] = useState(false);
  const [hoursWorked, setHoursWorked] = useState('');
  const [comment, setComment] = useState('');

  const handleMarkCompleted = () => {
    setShowMarkCompleted(true);
  };

  const handleMarkCompletedConfirm = () => {
    // Implement the logic to mark the task as completed here
    // You can also close the confirmation dialog by setting showMarkCompleted to false
    setShowMarkCompleted(false);
  };

  const handleAddComment = () => {
    // Implement logic to add a comment
    // You can use the "comment" state for the comment input
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Details</Text>
      <Text style={styles.taskName}>{task.name}</Text>
      <Text style={styles.taskDescription}>{task.description}</Text>

      {/* Comment Input */}
      <TextInput
        label="Add Comment"
        value={comment}
        onChangeText={setComment}
        style={styles.commentInput}
      />

      {/* "Add Comment" Button */}
      <PaperButton
        mode="contained"
        onPress={handleAddComment}
        style={styles.button}
      >
        Add Comment
      </PaperButton>

      {/* "Mark Completed" Button */}
      <PaperButton
        mode="contained"
        onPress={() => setShowMarkCompleted(true)}
        style={styles.detailButton}
      >
        Mark Completed
      </PaperButton>

      <Modal visible={showMarkCompleted} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalHeader}>Mark Completed</Text>
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskDescription}>{task.description}</Text>

          {/* Hours Worked Input */}
          <TextInput
            label="Hours Worked"
            value={hoursWorked}
            onChangeText={setHoursWorked}
            style={styles.input}
          />

          {/* "Confirm" Button */}
          <PaperButton
            mode="contained"
            onPress={handleMarkCompletedConfirm}
            style={styles.button}
          >
            Confirm
          </PaperButton>

          {/* "Cancel" Button */}
          <PaperButton
            mode="contained"
            onPress={() => setShowMarkCompleted(false)}
            style={styles.button}
          >
            Cancel
          </PaperButton>
        </View>
      </Modal>
    </View>
  );
};

const HomeIcon = () => (
  <MaterialCommunityIcons name="home" color="white" size={26} />
);

const TasksIcon = () => (
  <MaterialCommunityIcons name="format-list-checkbox" color="white" size={26} />
);

const TaskDetailsIcon = () => (
  <MaterialCommunityIcons name="format-list-checkbox" color="white" size={26} />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  tabBar: {
    backgroundColor: '#4d8d89',
  },
  userInfo: {
    marginTop: 30,
    padding: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4d8d89',
  },
  projectHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4d8d89',
  },
  projectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
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
    backgroundColor: '#eeeeee',
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {
    flex: 1,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  taskDescription: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  inputContainer: {
    marginTop: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    backgroundColor: '#4d8d89',
  },
  toggleButton: {
    marginTop: 16,
    backgroundColor: '#4d8d89',
  },
  detailButton: {
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#eeeeee',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#4d8d89',
  },
  commentInput: {
    marginBottom: 8,
    backgroundColor: '#f0f0f0', 
    borderRadius: 8,
    padding: 12,
  },
});

export default App;
