import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Task Details</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Task Name:</Text>
        <Text style={styles.value}>{task.name}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{task.description}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Project:</Text>
        <Text style={styles.value}>{task.projectId}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Due Date:</Text>
        <Text style={styles.value}>{task.dueDate}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.label}>Assigned To:</Text>
        <Text style={styles.value}>{task.assignedTo}</Text>
      </View>
    </View>
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
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    fontSize: 14,
    color: '#666',
  },
});

export default TaskDetailsScreen;
