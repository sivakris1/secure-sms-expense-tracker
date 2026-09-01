import React, { useState } from 'react';
import { StyleSheet, Text, SafeAreaView, View, StatusBar } from 'react-native';
import {Wallet, TrendingDown} from 'lucide-react-native'

export default function App() {
  const [balance, setBalance] = useState(23300.00);
  const [spentToday, setSpentToday] = useState(1550.00);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor='#0F0F12' />

      {/* Header */}
      <View style={styles.header}>
        <Wallet size={20} color='#1E90FF'/>
        <Text style={styles.headerText}>SecureTracker</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>Total Balance</Text>
        <Text style={styles.balanceText}> 
          ₹{balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
        </Text>

        <View style={styles.spentRow}>
          <View style={styles.statsHalf}>
            <Text style={styles.statsSublabel}>Spent Today</Text>
            <View style={styles.spentRow}>
              <TrendingDown size={16} color="#FF4757" style={styles.iconMargin}/>
              <Text style={styles.spentText}>₹{spentToday.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F12', // Premium deep dark theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  headerIcon: {
    marginRight: 8,
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#1C1C1E', // Dark card container
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  statsLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  statsHalf: {
    flex: 1,
  },
  statsSublabel: {
    color: '#8E8E93',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  spentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginRight: 4,
  },
  spentText: {
    color: '#FF4757', // Alert red color for expenses
    fontSize: 16,
    fontWeight: 'bold',
  },
});