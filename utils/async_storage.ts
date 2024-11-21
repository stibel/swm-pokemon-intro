import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeValueInAsyncStorage = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        console.error(e);
    }
}

export const getValueFromAsyncStorage = async (key: string) => {
    try {
        return await AsyncStorage.getItem(key)
    } catch (e) {
        console.error(e);
    }
}