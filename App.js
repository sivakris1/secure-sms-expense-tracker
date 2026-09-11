import React, { useState, useEffect } from "react";
import { StyleSheet, Text, SafeAreaView, View, StatusBar, FlatList, Modal, TextInput, TouchableOpacity } from "react-native";
import { Wallet, TrendingDown, TrendingUp, Flame, X, Plus } from "lucide-react-native";
import { getTransactions, saveTransactions } from "./src/utils/storage";

export default function App() {
  const [balance, setBalance] = useState(23300.0);
  const [spentToday, setSpentToday] = useState(1550.0);

  const [transactions, setTransactions] = useState([]);

  const [latestTxn, setLatestTxn] = useState({
    title: "Starbucks",
    amount: 350.0,
    type: "CREDIT", // 'DEBIT' or 'CREDIT'
  });

  const [roastText, setRoastText] = useState(
    "₹1,550 spent today? Are you training to be a professional consumer or is your money just burning a hole in your pocket? Starbucks AND Zara? Calm down, millionaire.",
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Food & Drink');
  const [typeInput, setTypeInput] = useState('DEBIT');


    useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const storedTxns = await getTransactions();
    if (storedTxns && storedTxns.length > 0) {
      setTransactions(storedTxns);
    } else {
      // First time opening app: save mock data to phone disk
      setTransactions(MOCK_TRANSACTIONS);
      await saveTransactions(MOCK_TRANSACTIONS);
    }
  };


  const MOCK_TRANSACTIONS = [
    {
      id: "1",
      title: "Starbucks Coffee",
      amount: 350.0,
      category: "Food & Drink",
      time: "10:30 AM",
    },
    {
      id: "2",
      title: "Nike Store",
      amount: 4999.0,
      category: "Shopping",
      time: "Yesterday",
    },
    {
      id: "3",
      title: "Mobile Recharge",
      amount: 299.0,
      category: "Utilities",
      time: "02 Sep",
    },
  ];

  const handleAddTransactions = async() => {
    if (!titleInput || !amountInput) return;

    const parsedAmount = parseFloat(amountInput);

    const newTxn = {
      id : Date.now().toString(),
      title: titleInput,
      amount: parsedAmount,
      category: categoryInput || 'General',
      time: 'Just now',
      type: typeInput,
    }

     const updatedTxns = [newTxn, ...transactions];
     setTransactions(updatedTxns);
     await saveTransactions(updatedTxns);

       // Update Balance & Spent Today metrics
    if (typeInput === 'DEBIT') {
      setSpentToday((prev) => prev + parsedAmount);
      setBalance((prev) => prev - parsedAmount);
    } else {
      setBalance((prev) => prev + parsedAmount);
    }
    // Update Latest Txn Badge
    setLatestTxn({
      title: newTxn.title,
      amount: newTxn.amount,
      type: newTxn.type,
    });
    // Reset Form & Close Modal
    setTitleInput('');
    setAmountInput('');
    setModalVisible(false)

  }

  const renderTransactionItem = ({item}) => {
    return(
    <View style={styles.txItem}>
      <View style={styles.txDetails}>
        <Text style={styles.txTitle}>{item.title}</Text>
        <Text style={styles.txSubtitle}>{item.category} • {item.time}</Text>
      </View>
      <Text style={styles.txAmount}>-₹{item.amount.toFixed(2)}</Text>
    </View>
)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F12" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Wallet size={20} color="#1E90FF" style={styles.headerIcon} />
          <Text style={styles.headerText}>SecureTracker</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>Total Balance</Text>
        <Text style={styles.balanceText}>
          ₹{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Text>

        <View style={styles.spentRow}>
          <View style={styles.statsHalf}>
            <Text style={styles.statsSublabel}>Spent Today</Text>
            <View style={styles.spentRow}>
              <TrendingDown
                size={16}
                color="#FF4757"
                style={styles.iconMargin}
              />
              <Text style={styles.spentText}>₹{spentToday.toFixed(2)}</Text>
            </View>
          </View>

          {/* Latest Transaction  */}
          <View style={styles.statsHalf}>
            <Text style={styles.statsSublabel}>Latest {latestTxn.title}</Text>
            <View style={styles.spentRow}>
              {latestTxn.type === "DEBIT" ? (
                <TrendingDown
                  size={16}
                  color="#FF4757"
                  style={styles.iconMargin}
                />
              ) : (
                <TrendingUp
                  size={16}
                  color="#2ED573"
                  style={styles.iconMargin}
                />
              )}
              <Text
                style={
                  latestTxn.type === "DEBIT"
                    ? styles.spentText
                    : styles.creditText
                }
              >
                {latestTxn.type === "DEBIT" ? "-" : "+"}₹
                {latestTxn.amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* AI Roast Bot Card  */}
      <View style={styles.roastCard}>
        <View style={styles.roastHeader}>
          <Flame size={18} color="#FFA502" fill="#FFA502" />
          <Text style={styles.roastTitle}>AI Roast Bot</Text>
        </View>

        <Text style={styles.roastContent}>"{roastText}"</Text>
        <View style={styles.roastFooter}>
          <Text style={styles.roastPersona}>
            Personality: Sarcastic Accountant
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Recent Transactions </Text>
      <FlatList
       data = {transactions}
       keyExtractor={(item) => item.id}
       renderItem={renderTransactionItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F12", // Premium deep dark theme
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1C1C1E",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "#1C1C1E", // Dark card container
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#2C2C2E",
  },
  statsLabel: {
    color: "#8E8E93",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceText: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  statsHalf: {
    flex: 1,
  },
  statsSublabel: {
    color: "#8E8E93",
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  spentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginRight: 4,
  },
  spentText: {
    color: "#FF4757", // Alert red color for expenses
    fontSize: 16,
    fontWeight: "bold",
  },
  roastCard: {
    backgroundColor: "rgba(255, 165, 2, 0.05)", // Subtle gold tint
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 2, 0.2)", // Fire accent border
  },
  roastHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  roastTitle: {
    color: "#FFA502",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginLeft: 6,
  },
  roastContent: {
    color: "#E5E5EA",
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
    marginBottom: 12,
  },
  roastFooter: {
    alignItems: "flex-start",
  },
  roastPersona: {
    color: "#8E8E93",
    fontSize: 11,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2E",
  },
  creditText: {
    color: "#2ED573", // Vibrant green for credited money
    fontSize: 16,
    fontWeight: "bold",
  },
    sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  txDetails: {
    flex: 1,
  },
  txTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  txSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    color: '#FF4757',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
