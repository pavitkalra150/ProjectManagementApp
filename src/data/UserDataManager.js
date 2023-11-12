import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dummyUserData";

// Define your initial dummy user data
const initialDummyUserData = [
  { email: "user1@example.com", password: "password1", hourlySalary: 20 },
  { email: "user2@example.com", password: "password2", hourlySalary: 25 },
  { email: "user3@example.com", password: "password3", hourlySalary: 18 },
  { email: "user4@example.com", password: "password4", hourlySalary: 22 },
  { email: "user5@example.com", password: "password5", hourlySalary: 30 },
];

// Initialize user data in AsyncStorage if it's not already set
const initializeDummyUsers = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!userData) {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialDummyUserData)
      );
    }
  } catch (error) {
    console.error("Error initializing dummy users: ", error);
  }
};

// Function to get user data
const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEY);
    return userData ? JSON.parse(userData) : [];
  } catch (error) {
    console.error("Error getting user data: ", error);
    return [];
  }
};

// Function to set user data
const setUserData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error setting user data: ", error);
  }
};
initializeDummyUsers();
export { initializeDummyUsers, getUserData, setUserData };
