import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import {
  Provider as PaperProvider,
  TextInput,
  Button,
} from "react-native-paper";
import { getUserData } from "../data/UserDataManager";
import {
  projects,
  addProject,
  deleteProject,
  loadProjectsFromStorage,
  computeProjectStatus,
  computeProjectCost,
  editProject,
} from "../data/projectsData";
import { tasks, addTask, loadTasksFromStorage } from "../data/tasksData";
import { SafeAreaFrameContext } from "react-native-safe-area-context";

const ProjectScreen = ({ navigation, route, email }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isAddingProject, setAddingProject] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [itemWidth, setItemWidth] = useState(0);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { width, height } = Dimensions.get("window");
  const modalWidth = width - 32;
  const modalHeight = height * 0.7;
  const getItemWidth = () => {
    const itemWidth = Dimensions.get("window").width - 32 - 32;
    setItemWidth(itemWidth);
  };

  useEffect(() => {
    getItemWidth();
  }, []);
  useEffect(() => {
    if (route.params && route.params.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);
  const addNewProject = async () => {
    if (newProjectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }

    try {
      await addProject(newProjectName, newProjectDescription, email);

      const updatedProjects = await loadProjectsFromStorage(email);

      if (updatedProjects) {
        setFilteredProjects(updatedProjects);
      } else {
        console.log("Error loading projects.");
      }

      setNewProjectName("");
      setNewProjectDescription("");
      closeAddProjectModal();

      navigation.navigate("Projects", { createdBy: email });
    } catch (error) {
      console.log("Error adding the project:", error);
    }
  };
  const handleEdit = (project) => {
    setEditingProject(project);
    setAddingProject(true);
  };
  const saveEditedProject = async () => {
    try {
      await editProject(editingProject.id, editingProject);
      const updatedProjects = filteredProjects.map((project) =>
        project.id === editingProject.id ? editingProject : project
      );
      setFilteredProjects(updatedProjects);

      closeEditProjectModal();
      setEditingProject(null);
    } catch (error) {
      console.log("Error saving edited project:", error);
    }
  };

  const closeEditProjectModal = () => {
    setAddingProject(false);
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      const updatedProjects = filteredProjects.filter(
        (project) => project.id !== projectId
      );
      setFilteredProjects(updatedProjects);
    } catch (error) {
      console.log("Error deleting project:", error);
    }
  };
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length === 0) {
      retrieveProjects();
    } else {
      const filtered = filteredProjects.filter(
        (project) =>
          project.name.toLowerCase().includes(query.toLowerCase()) ||
          project.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };
  const handleBlur = () => {
    if (searchQuery === "") {
      retrieveProjects();
    }
    Keyboard.dismiss();
  };
  const retrieveProjects = useCallback(async () => {
    try {
      const users = await getUserData();

      if (!Array.isArray(users) || users.length === 0) {
        console.error("No user data found or invalid user data format.");
        return;
      }

      const loggedInUser = users.find((user) => user.email === email);
      console.log("Logged-in user:", loggedInUser);

      if (!loggedInUser) {
        console.error("Logged-in user not found.");
        return;
      }

      const loggedInUserHourlyRate = loggedInUser.hourlySalary || 0;
      console.log("Logged-in user hourly rate:", loggedInUserHourlyRate);

      const loadedProjects = await loadProjectsFromStorage();

      if (!Array.isArray(loadedProjects)) {
        console.error("Projects data is not an array or undefined.");
        return;
      }

      const userProjects = loadedProjects.filter(
        (project) => project.createdBy === loggedInUser.email
      );

      if (Array.isArray(userProjects) && userProjects.length > 0) {
        const tasks = await loadTasksFromStorage();
        console.log(tasks);
        const projectsWithCost = userProjects.map((project) => {
          const status = computeProjectStatus(project.id, tasks);
          const cost = computeProjectCost(
            project.id,
            tasks,
            loggedInUserHourlyRate
          );
          return { ...project, status, cost };
        });

        setFilteredProjects(projectsWithCost);
      } else {
        setFilteredProjects([]);
        console.log("No projects found for the logged-in user.");
      }
    } catch (error) {
      console.error("Error retrieving user data or projects:", error);
    }
  }, [email]);

  useEffect(() => {
    retrieveProjects();
  }, [retrieveProjects]);

  const openAddProjectModal = () => {
    setAddingProject(true);
  };

  const closeAddProjectModal = () => {
    setAddingProject(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Task", { projectId: item.id })}
          style={styles.projectItem}
        >
          <View style={styles.projectDetails}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDescription}>{item.description}</Text>
            <Text style={styles.projectStatus}>Status: {item.status}</Text>
            <Text style={styles.projectCost}>Cost: ${item.cost}</Text>
          </View>
          <View style={styles.editDeleteButtons}>
            <Button icon="pencil" onPress={() => handleEdit(item)}>
              Edit
            </Button>
            <Button icon="delete" onPress={() => handleDelete(item.id)}>
              Delete
            </Button>
          </View>
        </TouchableOpacity>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Hello, {email}</Text>
            <Text style={styles.projectHeader}>Your Projects:</Text>
            <TextInput
              label="Search by name or description"
              value={searchQuery}
              onChangeText={handleSearch}
              onBlur={handleBlur}
              style={[styles.searchInput, { width: 380, height: 50 }]}
              theme={{ colors: { primary: "#9DB5B2" } }}
            />
          </View>

          <FlatList
            data={filteredProjects}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            onLayout={getItemWidth}
          />

          <Button
            mode="contained"
            onPress={openAddProjectModal}
            style={styles.addButton}
          >
            Add Project
          </Button>

          <Modal
            visible={isAddingProject || editingProject !== null}
            animationType="slide"
            transparent={true}
            onRequestClose={() => {
              setAddingProject(false);
              setEditingProject(null);
            }}
          >
            <View style={styles.modalContainer}>
              <View
                style={[
                  styles.modalContent,
                  { width: modalWidth, maxHeight: modalHeight },
                ]}
              >
                <Text style={styles.modalTitle}>
                  {editingProject ? "Edit Project" : "Add Project"}
                </Text>
                <TextInput
                  label="Project Name"
                  value={editingProject ? editingProject.name : newProjectName}
                  onChangeText={
                    editingProject
                      ? (value) =>
                          setEditingProject({ ...editingProject, name: value })
                      : setNewProjectName
                  }
                  style={styles.input}
                />
                <TextInput
                  label="Project Description"
                  value={
                    editingProject
                      ? editingProject.description
                      : newProjectDescription
                  }
                  onChangeText={
                    editingProject
                      ? (value) =>
                          setEditingProject({
                            ...editingProject,
                            description: value,
                          })
                      : setNewProjectDescription
                  }
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={editingProject ? saveEditedProject : addNewProject}
                  style={styles.button}
                >
                  {editingProject ? "Save" : "Add Project"}
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setAddingProject(false);
                    setEditingProject(null);
                    setNewProjectName("");
                    setNewProjectDescription("");
                  }}
                  style={styles.button}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#9DB5B2",
    padding: 16,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  projectHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
  },
  projectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "black",
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
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  projectDescription: {
    fontSize: 14,
    color: "#666",
  },
  addButton: {
    marginTop: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
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
  projectCost: {
    fontSize: 14,
    fontWeight: "bold",
    color: "green",
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
});

export default ProjectScreen;
