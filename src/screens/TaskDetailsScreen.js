import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchProjectNameById,
  updateProjectStatus,
} from "../data/projectsData";
import {
  tasks,
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../data/tasksData";

const TaskDetailsScreen = ({ route }) => {
  const { task } = route.params;
  const projectName = fetchProjectNameById(task.projectId);
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(task.hoursWorked.toString()); // New state for hours worked

  const handleStatusChange = async (status) => {
    const storedTasks = await loadTasksFromStorage();

    const currentIndex = storedTasks.findIndex((t) => t.id === task.id);
    const previousTask = storedTasks[currentIndex - 1];

    if (status === "In Progress" && hasPendingDependencies(task, storedTasks)) {
      Alert.alert(
        "Cannot Update to In Progress",
        "Please complete the previous tasks first.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
      return;
    }

    setTaskStatus(status);
    setShowStatusOptions(false);

    const updatedTasks = storedTasks.map((t) =>
      t.id === task.id ? { ...t, status: status } : t
    );

    saveTasksToStorage(updatedTasks);

    // Update the project status after saving the tasks
    const updatedProjectStatus = updateProjectStatus(
      task.projectId,
      updatedTasks
    );
    if (updatedProjectStatus) {
      updateProjectStatus(task.projectId, updatedTasks);
    }
  };

  const hasPendingDependencies = (currentTask, tasks) => {
    const dependentTasks = tasks.filter(
      (t) => t.id !== currentTask.id && t.dependencyId === currentTask.id
    );

    return dependentTasks.some((t) => t.status !== "Done");
  };

  const loadStatusFromAsyncStorage = async () => {
    try {
      const storedStatus = await AsyncStorage.getItem(`task_status_${task.id}`);
      if (storedStatus !== null) {
        setTaskStatus(storedStatus);
      }
    } catch (error) {
      console.error("Error loading status from AsyncStorage:", error);
    }
  };
  const loadHoursWorkedFromAsyncStorage = async () => {
    try {
      const storedHoursWorked = await AsyncStorage.getItem(
        `hours_worked_${task.id}`
      );
      if (storedHoursWorked !== null) {
        setHoursWorked(storedHoursWorked);
      }
    } catch (error) {
      console.error("Error loading hours worked from AsyncStorage:", error);
    }
  };
  useEffect(() => {
    loadStatusFromAsyncStorage();
    loadHoursWorkedFromAsyncStorage();
  }, []);

  useEffect(() => {
    saveStatusToAsyncStorage();
  }, [taskStatus, hoursWorked]);

  const saveStatusToAsyncStorage = async () => {
    try {
      await AsyncStorage.setItem(`task_status_${task.id}`, taskStatus);
      await AsyncStorage.setItem(`hours_worked_${task.id}`, hoursWorked); // Save hoursWorked to AsyncStorage
    } catch (error) {
      console.error("Error saving status to AsyncStorage:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={80}
    >
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
              <Paragraph style={styles.value}>{projectName}</Paragraph>
            </View>

            <View style={styles.detailsContainer}>
              <Title style={styles.label}>Due Date</Title>
              <Paragraph style={styles.value}>{task.dueDate}</Paragraph>
            </View>

            <View style={styles.detailsContainer}>
              <Title style={styles.label}>Assigned To</Title>
              <Paragraph style={styles.value}>{task.assignedTo}</Paragraph>
            </View>
            <View style={styles.detailsContainer}>
              <Title style={styles.label}>Hours Worked</Title>
              <TextInput
                value={hoursWorked}
                onChangeText={(value) => setHoursWorked(value)}
                keyboardType="numeric" // Enable numeric keyboard
                style={[
                  styles.value,
                  {
                    borderWidth: 1,
                    borderColor: "#4d8d89",
                    borderRadius: 5,
                    padding: 8,
                  },
                ]}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Title style={styles.label}>Status</Title>
              <TouchableOpacity
                onPress={() => setShowStatusOptions(!showStatusOptions)}
              >
                <View style={styles.statusDropdown}>
                  <Text style={styles.value}>{taskStatus}</Text>
                </View>
              </TouchableOpacity>

              {showStatusOptions && (
                <View style={styles.statusOptions}>
                  <TouchableOpacity onPress={() => handleStatusChange("Open")}>
                    <Text style={styles.statusOption}>Open</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatusChange("In Progress")}
                  >
                    <Text style={styles.statusOption}>In Progress</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleStatusChange("Completed")}
                  >
                    <Text style={styles.statusOption}>Completed</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    margin: 10,
    elevation: 4,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4d8d89",
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 14,
    color: "#666",
  },
  statusDropdown: {
    padding: 10,
    borderColor: "#4d8d89",
    borderWidth: 1,
    borderRadius: 5,
  },
  statusOptions: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  statusOption: {
    padding: 10,
    fontSize: 16,
    color: "#4d8d89",
  },
});

export default TaskDetailsScreen;
