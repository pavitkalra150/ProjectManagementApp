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
import { useNavigation } from '@react-navigation/native';
import { Card, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fetchProjectNameById,
  updateProjectStatus,
} from "../data/projectsData";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../data/tasksData";

const TaskDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { task } = route.params;
  const [projectName, setProjectName] = useState("");
  const [taskStatus, setTaskStatus] = useState(task.status);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [hoursWorked, setHoursWorked] = useState(task.hoursWorked.toString());

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const name = await fetchProjectNameById(task.projectId);
        setProjectName(name);
      } catch (error) {
        console.error("Error fetching project name:", error);
        setProjectName("Project Not Found");
      }
    };

    fetchProjectName();
  }, [task.projectId]);

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
  useEffect(() => {
    if (taskStatus !== task.status || hoursWorked !== task.hoursWorked.toString()) {
      navigation.setParams({
        updatedStatus: taskStatus,
        updatedHoursWorked: hoursWorked,
      });
    }
  }, [taskStatus, hoursWorked, task.status, task.hoursWorked]);
  useEffect(() => {
    //console.log('Hours worked state after set1:', hoursWorked);
  }, [hoursWorked]);
  const hasPendingDependencies = (currentTask, tasks) => {
    console.log("Current Task ID:", currentTask.id);
    const dependentTasks = tasks.filter((t) => t.dependencyId === currentTask.id);
  
    console.log("Dependent Tasks:", dependentTasks);
  
    const pendingDependencies = dependentTasks.some(
      (dependentTask) => dependentTask.status !== "Completed"
    );
  
    return pendingDependencies;
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
      //console.log('Stored hours worked:', storedHoursWorked); // Log the stored value
      if (storedHoursWorked !== null) {
        setHoursWorked(storedHoursWorked);
        //console.log('Hours worked state after set:', hoursWorked); // Log the state after setting
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
      await AsyncStorage.setItem(`hours_worked_${task.id}`, hoursWorked);
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
                keyboardType="numeric"
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
    backgroundColor: "#9DB5B2",
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
