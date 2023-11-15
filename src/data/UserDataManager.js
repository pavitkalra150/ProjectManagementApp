import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "dummyUserData";

const initialDummyUserData = [
  { email: "user1@example.com", password: "password1", hourlySalary: 20 },
  { email: "user2@example.com", password: "password2", hourlySalary: 25 },
  { email: "user3@example.com", password: "password3", hourlySalary: 18 },
  { email: "user4@example.com", password: "password4", hourlySalary: 22 },
  { email: "user5@example.com", password: "password5", hourlySalary: 30 },
];

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


const retrieveUserData = async () => {
  try {
    const users = await getUserData();
    if (users.length > 0) {
      const userEmail = users[0].email;
      console.log('User email:', userEmail);
    } else {
      console.log('No users found');
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
  }
};


const setUserData = async (data) => {
  try {
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
