import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Button, useTheme } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  tasks,
  addTask,
  loadTasksFromStorage,
  saveTasksToStorage,
} from "../data/tasksData";
import { projects, loadProjectsFromStorage } from "../data/projectsData";

const TaskScreen = ({ route, navigation }) => {
  const { projectId } = route.params;
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddingTask, setAddingTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projects = await loadProjectsFromStorage();
        if (projects && projects.length > 0) {
          const foundProject = projects.find(
            (project) => project.id === projectId
          );
          if (foundProject) {
            setProject(foundProject);
            const loadedTasks = await loadTasksFromStorage();
            const filteredTasks = loadedTasks.filter(
              (task) => task.projectId === projectId
            );
            setProjectTasks(filteredTasks);
          } else {
            console.log("Project not found.");
          }
        } else {
          console.log("Projects not found or empty.");
        }
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };

    fetchData();
  }, [projectId]);
  const groupedTasks = groupTasksByStatus(projectTasks);
  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered =
      query.length === 0
        ? groupedTasks[selectedStatus] || []
        : projectTasks.filter(
            (task) =>
              task.name.toLowerCase().includes(query.toLowerCase()) ||
              task.description.toLowerCase().includes(query.toLowerCase())
          );

    setProjectTasks(
      filtered.length > 0 ? filtered : groupedTasks[selectedStatus] || []
    );
  };
  const handleEdit = (task) => {
    setEditingTask(task);
    setAddingTask(true);
    setTaskName(task.name);
    setTaskDescription(task.description);
    setAssignedTo(task.assignedTo);
    setDueDate(task.dueDate);
  };

  const saveEditedTask = () => {
    const updatedTasks = projectTasks.map((task) =>
      task.id === editingTask.id
        ? {
            ...task,
            name: taskName,
            description: taskDescription,
            assignedTo: assignedTo,
            dueDate: dueDate,
          }
        : task
    );

    setProjectTasks(updatedTasks);
    saveTasksToStorage(updatedTasks);
    closeAddTaskModal();
    setEditingTask(null);
  };
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
  const handleDelete = async (taskId) => {
    try {
      const updatedTasks = projectTasks.filter((task) => task.id !== taskId);
      setProjectTasks(updatedTasks);
      await saveTasksToStorage(updatedTasks);
      //console.log("Task deleted successfully.");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  const openAddTaskModal = () => {
    setAddingTask(true);
  };

  const closeAddTaskModal = () => {
    setAddingTask(false);
  };

  const handleAddTask = async () => {
    try {
      const lastTask = projectTasks[projectTasks.length - 1];

      const newTask = {
        projectId: projectId,
        name: taskName,
        description: taskDescription,
        assignedTo: assignedTo,
        dueDate: dueDate,
        status: "Open",
        dependencyId: lastTask ? lastTask.id : null,
        hoursWorked: 0,
      };

      await addTask(
        projectId,
        taskName,
        taskDescription,
        assignedTo,
        dueDate,
        "Open",
        lastTask ? lastTask.id : null
      );
      saveTasksToStorage([...projectTasks, newTask]);
      console.log("Adding Task", newTask);

      const updatedTasks = [...projectTasks, newTask];
      setProjectTasks(updatedTasks);

      setTaskName("");
      setTaskDescription("");
      setAssignedTo("");
      setDueDate("");

      closeAddTaskModal();
    } catch (error) {
      console.error("Error adding task:", error);
    }
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
  const handleCancel = () => {
    setAddingTask(false);
    setEditingTask(null);
    setTaskName("");
    setTaskDescription("");
    setAssignedTo("");
    setDueDate("");
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
        <TextInput
          label="Search by name or description"
          value={searchQuery}
          onChangeText={handleSearch}
          style={[styles.searchInput, { width: 380, height: 45 }]}
          theme={{ colors: { primary: "#9DB5B2" } }}
        />
        <FlatList
          contentContainerStyle={styles.contentContainer}
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("TaskDetails", { task: item })}
              style={styles.taskItem}
            >
              <View style={styles.taskRow}>
                <View style={styles.taskDetails}>
                  <Text style={styles.taskName}>{item.name}</Text>
                  <Text style={styles.taskDescription}>{item.description}</Text>
                </View>
                <View style={styles.editDeleteButtons}>
                  <Button icon="pencil" onPress={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button icon="delete" onPress={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.addTaskButton}
          onPress={openAddTaskModal}
        >
          <Text style={styles.addTaskButtonText}>Add Task</Text>
        </TouchableOpacity>
        <Modal
          visible={isAddingTask || editingTask !== null}
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
                onBlur={dismissKeyboard}
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
                onBlur={dismissKeyboard}
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <TouchableOpacity
                onPress={openDueDatePicker}
                onBlur={dismissKeyboard}
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
                onBlur={dismissKeyboard}
                style={[
                  styles.input,
                  { backgroundColor: theme.colors.background },
                ]}
                theme={{ colors: { primary: theme.colors.primary } }}
              />
              <Button
                mode="contained"
                onPress={editingTask ? saveEditedTask : handleAddTask}
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                {editingTask ? "Save Task" : "Add Task"}
              </Button>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={[styles.button, { borderColor: theme.colors.primary }]}
              >
                Cancel
              </Button>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    backgroundColor: "#9DB5B2",
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
    color: "white",
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
    margin: 6,
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
  searchInput: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 8,
    // padding: 16,
    // margin: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskDetails: {},
  taskName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  taskDescription: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  editDeleteButtons: {
    //flexDirection: 'row',
    alignItems: "center",
  },
});

export default TaskScreen;
