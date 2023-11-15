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

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEY);
    const users = userData ? JSON.parse(userData) : [];
    const usersWithHourlySalary = users.map(user => {
      switch (user.email) {
        case "user1@example.com":
          return { ...user, hourlySalary: 20 };
        case "user2@example.com":
          return { ...user, hourlySalary: 25 };
        case "user3@example.com":
          return { ...user, hourlySalary: 20 };
        case "user4@example.com":
          return { ...user, hourlySalary: 25 };
        case "user5@example.com":
          return { ...user, hourlySalary: 20 };
        default:
          return { ...user, hourlySalary: 0 }; 
      }
    });

    return usersWithHourlySalary;
  } catch (error) {
    console.error("Error getting user data: ", error);
    return [];
  }
};

// Usage in your component
const retrieveUserData = async () => {
  try {
    const users = await getUserData();
    if (users.length > 0) {
      // For instance, if you want the email of the first user
      const userEmail = users[0].email;
      console.log('User email:', userEmail);
      // Use userEmail or loop through users to find the desired user
    } else {
      console.log('No users found');
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
};

// Call retrieveUserData in your component to check if it retrieves the user's email properly


// Function to set user data
const setUserData = async (data) => {
  try {
    // Modify the existing user data with hourly salary
    const userData = await AsyncStorage.getItem(STORAGE_KEY);
    const users = userData ? JSON.parse(userData) : [];

    const updatedUsers = users.map(user => {
      const foundUser = data.find(u => u.email === user.email);
      if (foundUser) {
        return {
          ...user,
          hourlySalary: foundUser.hourlySalary,
        };
      }
      return user;
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
  } catch (error) {
    console.error("Error setting user data: ", error);
  }
};
initializeDummyUsers();
export { initializeDummyUsers, getUserData, setUserData };
