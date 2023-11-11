import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, useTheme } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { tasks } from "../data/tasksData";
import { projects } from "../data/projectsData";

const TaskScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const project = projects.find((project) => project.id === projectId);
  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const groupedTasks = groupTasksByStatus(projectTasks);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddingTask, setAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const filteredTasks =
    selectedStatus === "All"
      ? projectTasks
      : groupedTasks[selectedStatus] || [];

  const statusButtons = [
    { label: "All", value: "All" },
    ...Object.keys(groupedTasks).map((status) => ({
      label: status,
      value: status,
    })),
  ];

  const openAddTaskModal = () => {
    setAddingTask(true);
  };

  const closeAddTaskModal = () => {
    setAddingTask(false);
  };

  const handleAddTask = () => {
    console.log("Adding Task", {
      taskName,
      taskDescription,
      dueDate,
      assignedTo,
    });
    closeAddTaskModal();
  };

  const theme = useTheme();

  const [dueDatePickerVisible, setDueDatePickerVisible] = useState(false);

  const openDueDatePicker = () => {
    setDueDatePickerVisible(true);
  };

  const closeDueDatePicker = () => {
    setDueDatePickerVisible(false);
  };

  const handleDueDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    setDueDate(formattedDate);
    closeDueDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          Tasks for {project ? project.name : ""}
        </Text>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.buttonContainer}
        >
          {statusButtons.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    item.value === selectedStatus ? "#4d8d89" : "#eeeeee",
                },
              ]}
              onPress={() => setSelectedStatus(item.value)}
            >
              <Text style={styles.buttonText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        contentContainerStyle={styles.contentContainer}
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("TaskDetails", { task: item })}
            style={styles.taskItem}
          >
            <View style={styles.taskDetails}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addTaskButton} onPress={openAddTaskModal}>
        <Text style={styles.addTaskButtonText}>Add Task</Text>
      </TouchableOpacity>

      <Modal
        visible={isAddingTask}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddTaskModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { width: modalWidth, maxHeight: modalHeight },
            ]}
          >
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              label="Task Name"
              value={taskName}
              onChangeText={setTaskName}
              style={[
                styles.input,
                { backgroundColor: theme.colors.background },
              ]}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TextInput
              label="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
              style={[
                styles.input,
                { backgroundColor: theme.colors.background },
              ]}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <TouchableOpacity
              onPress={openDueDatePicker}
              style={[
                styles.input,
                { backgroundColor: theme.colors.background },
                styles.datePickerInput,
              ]}
            >
              <Text>{dueDate ? dueDate : "Select Due Date"}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={dueDatePickerVisible}
              onCancel={closeDueDatePicker}
              date={dueDate ? new Date(dueDate) : new Date()}
              onConfirm={handleDueDateChange}
            />
            <TextInput
              label="Assigned To"
              value={assignedTo}
              onChangeText={setAssignedTo}
              style={[
                styles.input,
                { backgroundColor: theme.colors.background },
              ]}
              theme={{ colors: { primary: theme.colors.primary } }}
            />
            <Button
              mode="contained"
              onPress={handleAddTask}
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
            >
              Add Task
            </Button>
            <Button
              mode="outlined"
              onPress={closeAddTaskModal}
              style={[styles.button, { borderColor: theme.colors.primary }]}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const groupTasksByStatus = (tasks) => {
  return tasks.reduce((grouped, task) => {
    const status = task.status || "Open";
    if (!grouped[status]) {
      grouped[status] = [];
    }
    grouped[status].push(task);
    return grouped;
  }, {});
};

const { width, height } = Dimensions.get("window");
const modalWidth = width - 32;
const modalHeight = height * 0.7;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
    flexGrow: 1,
    flexBasis: "0%",
  },
  headerContainer: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4d8d89",
  },
  contentContainer: {
    marginTop: 8,
    flexGrow: 1,
  },
  taskItem: {
    flex: 1,
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
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
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  taskDescription: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 8,
    height: 40,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addTaskButton: {
    marginTop: 16,
    backgroundColor: "#4d8d89",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addTaskButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  datePickerInput: {
    justifyContent: "center",
    padding: 10,
  },
});

export default TaskScreen;
