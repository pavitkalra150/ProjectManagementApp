import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Provider as PaperProvider, TextInput, Button as PaperButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ProjectScreen from './ProjectScreen';
const Tab = createMaterialBottomTabNavigator();
import { projects, addProject, deleteProject } from '../data/projectsData'; // Import projects data, addProject, and deleteProject functions
import { tasks, addTask } from '../data/tasksData'; // Import tasks data and addTask function



const TaskScreen = ({ route, navigation }) => {
  //const { project } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tasks for project.name</Text>
      <View style={styles.contentContainer}>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('TaskDetails', { task: item })}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d8d89',
  },
  contentContainer: {
    flex: 1,
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
});

export default TaskScreen;
