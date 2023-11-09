import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { tasks } from '../data/tasksData'; // Import tasks data
import { projects } from '../data/projectsData'; // Import projects data

const TaskScreen = ({ route, navigation }) => {
  const { projectId } = route.params;

  // Find the project with the given projectId
  const project = projects.find((project) => project.id === projectId);

  // Filter tasks based on the projectId
  const projectTasks = tasks.filter((task) => task.projectId === projectId);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Tasks for {project ? project.name : ''}</Text>
      <View style={styles.contentContainer}>
        <FlatList
          data={projectTasks}
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
