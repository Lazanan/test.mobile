import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserDTO } from '../dtos/UserDTO';

const TOKEN_KEY = '@Auth:token';
const USER_KEY = '@Auth:user';

// gerer token
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error("Failed to save token to storage", e);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error("Failed to fetch token from storage", e);
    return null;
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error("Failed to remove token from storage", e);
  }
};


// gerer user
export const storeUser = async (user: UserDTO): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save user to storage", e);
  }
};

export const getUser = async (): Promise<UserDTO | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to fetch user from storage", e);
    return null;
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    console.error("Failed to remove user from storage", e);
  }
};

export default {
    storeToken,
    getToken,
    removeToken,
    storeUser,
    getUser,
    removeUser,
};