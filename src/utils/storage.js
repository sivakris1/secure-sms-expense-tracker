import AsyncStorage from "@react-native-async-storage/async-storage";

const TRANSACTION_KEY = "@sms_tracker_transaction";

//saving transactions to disk
export const saveTransactions = async (transactions) => {
  try {
    const jsonValue = JSON.stringify(transactions);
    await AsyncStorage.setItem(TRANSACTION_KEY, jsonValue);
  } catch (error) {
    console.error("Error saving transactions:", e);
  }
};

//Load transactions
export const getTransactions = async (transactions) => {
  try {
    const jsonValue = await AsyncStorage.getItem(TRANSACTION_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading transactions:", e);
    return [];
  }
};
