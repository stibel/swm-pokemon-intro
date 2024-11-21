import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeValueInAsyncStorage = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
};

export const getValueFromAsyncStorage = async (key: string) => {
  try {
    const url = await AsyncStorage.getItem(key);
    return { url: url };
  } catch (e) {
    console.error(e);
  }
};

export const removeValueFromAsyncStorage = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};
