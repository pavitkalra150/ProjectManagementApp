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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Swipeable from "react-native-swipeable";

const Tab = createMaterialBottomTabNavigator();

import { projects, addProject, deleteProject } from "../data/projectsData"; // Import projects data, addProject, and deleteProject functions
import { tasks, addTask } from "../data/tasksData"; // Import tasks data and addTask function

const ProjectScreen = ({ navigation, route }) => {
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [showInputs, setShowInputs] = useState(false);
  const [isAddingProject, setAddingProject] = useState(false);

  // Get the device's screen dimensions
  const { width, height } = Dimensions.get("window");
  // Set the modal height and width based on screen dimensions
  const modalWidth = width - 32; // Adjust as needed
  const modalHeight = height * 0.7; // Adjust as needed

  const openAddProjectModal = () => {
    setAddingProject(true);
  };

  const closeAddProjectModal = () => {
    setAddingProject(false);
  };

  const renderItem = ({ item }) => {
    const leftContent = (
      <View style={styles.swipeItemLeft}>
        <MaterialCommunityIcons name="pencil" size={30} color="white" />
      </View>
    );

    const rightContent = [
      <TouchableOpacity
        onPress={() => handleEditProject(item)}
        style={styles.swipeItemRight}
      >
        <MaterialCommunityIcons name="pencil" size={30} color="white" />
      </TouchableOpacity>,
      <TouchableOpacity
        onPress={() => handleDeleteProject(item.id)}
        style={styles.swipeItemRight}
      >
        <MaterialCommunityIcons name="delete" size={30} color="white" />
      </TouchableOpacity>,
    ];


    return (
      <Swipeable leftContent={leftContent} rightButtons={rightContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Task", { projectId: item.id })} // Pass the project's ID as 'projectId'
          style={styles.projectItem}
        >
          <View style={styles.projectDetails}>
            <Text style={styles.projectName}>{item.name}</Text>
            <Text style={styles.projectDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  const handleEditProject = (project) => {
    // Implement edit project functionality here
  };

  const handleDeleteProject = (projectId) => {
    deleteProject(projectId); // Implement this function to delete a project
  };

  const addNewProject = () => {
    if (newProjectName.trim() === "") {
      alert("Project name cannot be empty");
      return;
    }
    addProject(newProjectName, newProjectDescription); // Use the addProject function from the data file
    setNewProjectName("");
    setNewProjectDescription("");
    setShowInputs(false);
    closeAddProjectModal();
    navigation.navigate("Projects");
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <Text style={styles.greeting}>Hello, username</Text>
        <Text style={styles.projectHeader}>Your Projects:</Text>
      </View>

      <FlatList
        data={projects}
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
