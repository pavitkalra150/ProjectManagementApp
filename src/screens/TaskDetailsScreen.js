import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.header}>Task Details</Title>

          <View style={styles.detailsContainer}>
            <Title style={styles.label}>Task Name</Title>
            <Paragraph style={styles.value}>{task.name}</Paragraph>
          </View>

          <View style={styles.detailsContainer}>
            <Title style={styles.label}>Description</Title>
            <Paragraph style={styles.value}>{task.description}</Paragraph>
          </View>

          <View style={styles.detailsContainer}>
            <Title style={styles.label}>Project</Title>
            <Paragraph style={styles.value}>{task.projectId}</Paragraph>
          </View>

          <View style={styles.detailsContainer}>
            <Title style={styles.label}>Due Date</Title>
            <Paragraph style={styles.value}>{task.dueDate}</Paragraph>
          </View>

          <View style={styles.detailsContainer}>
            <Title style={styles.label}>Assigned To</Title>
            <Paragraph style={styles.value}>{task.assignedTo}</Paragraph>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    margin: 10,
    elevation: 4, // Card elevation
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4d8d89',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
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
