import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
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
} from "../data/projectsData"; // Import projects data, addProject, and deleteProject functions
import { tasks, addTask } from "../data/tasksData"; // Import tasks data and addTask function

const ProjectScreen = ({ navigation, route, email }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [isAddingProject, setAddingProject] = useState(false);

  const [filteredProjects, setFilteredProjects] = useState([]); // State to hold filtered projects

  const { width, height } = Dimensions.get("window");
  const modalWidth = width - 32;
  const modalHeight = height * 0.7;

  useEffect(() => {
    if (route.params && route.params.email) {
      setEmail(route.params.email);
    }
  }, [route.params]);

  useEffect(() => {
    if (email) {
      const retrieveProjects = async () => {
        const loadedProjects = await loadProjectsFromStorage(email);
        if (loadedProjects) {
          // Compute project status for each project
          const projectsWithStatus = loadedProjects.map((project) => {
            const status = computeProjectStatus(project.id, tasks);
            return { ...project, status };
          });
          setFilteredProjects(projectsWithStatus);
        } else {
          console.log("Error loading projects or no projects found.");
        }
      };
      retrieveProjects();
    }
  }, [email, tasks]);

  const openAddProjectModal = () => {
    setAddingProject(true);
  };

  const closeAddProjectModal = () => {
    setAddingProject(false);
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Task", { projectId: item.id })}
        style={styles.projectItem}
      >
        <View style={styles.projectDetails}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectDescription}>{item.description}</Text>
          <Text style={styles.projectStatus}>Status: {item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const addNewProject = async () => {
    if (newProjectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }
  
    const added = addProject(newProjectName, newProjectDescription, email);
    if (added) {
      setNewProjectName("");
      setNewProjectDescription("");
      closeAddProjectModal();
  
      // Fetch the updated projects
      const updatedProjects = await loadProjectsFromStorage(email);
  
    if (updatedProjects) {
      try {
        const user = await getUserData(); // Assuming this function returns a Promise
        const projectsWithStatusAndCost = updatedProjects.map((project) => {
          const status = computeProjectStatus(project.id, tasks);
          const hourlyRate = user.find((u) => u.email === project.createdBy)?.hourlySalary || 0;
          const cost = computeProjectCost(project.id, tasks, hourlyRate);
          return { ...project, status, cost };
        });
  
        setFilteredProjects(projectsWithStatusAndCost);
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    } else {
      console.log("Error loading projects.");
    }
  
    navigation.navigate("Projects", { createdBy: email });
  } else {
    console.log("Error adding the project.");
  }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>Hello, {email}</Text>
        <Text style={styles.projectHeader}>Your Projects:</Text>
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <Button
        mode="contained"
        onPress={openAddProjectModal}
        style={styles.addButton}
      >
        Add Project
      </Button>

      <Modal
        visible={isAddingProject}
        animationType="slide"
        transparent={true}
        onRequestClose={closeAddProjectModal}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { width: modalWidth, maxHeight: modalHeight },
            ]}
          >
            <Text style={styles.modalTitle}>Add Project</Text>
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
            <Button
              mode="contained"
              onPress={addNewProject}
              style={styles.button}
            >
              Add Project
            </Button>
            <Button
              mode="outlined"
              onPress={closeAddProjectModal}
              style={styles.button}
            >
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9DB5B2",
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
  swipeItemLeft: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    paddingLeft: 20,
  },
  swipeItemRight: {
    flex: 1,
    backgroundColor: "red",
    justifyContent: "center",
    paddingLeft: 20,
    flexDirection: "row",
  },
});

export default ProjectScreen;
