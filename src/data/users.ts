export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this should be hashed
  enterpriseGuid?: string;
  createdAt: string;
}

// Local storage key for users
export const USERS_STORAGE_KEY = "local_registered_users";

// Get all registered users from localStorage
export const getLocalUsers = (): LocalUser[] => {
  try {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error("Error reading local users:", error);
    return [];
  }
};

// Save users to localStorage
export const saveLocalUsers = (users: LocalUser[]): void => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error("Error saving local users:", error);
  }
};

// Add a new user
export const addLocalUser = (user: Omit<LocalUser, "id" | "createdAt">): LocalUser => {
  const users = getLocalUsers();
  
  // Check if user already exists
  const existingUser = users.find((u) => u.email === user.email);
  if (existingUser) {
    throw new Error("El usuario ya está registrado");
  }

  const newUser: LocalUser = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveLocalUsers(users);
  
  return newUser;
};

// Find user by email and password
export const findLocalUser = (email: string, password: string): LocalUser | null => {
  const users = getLocalUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
};
