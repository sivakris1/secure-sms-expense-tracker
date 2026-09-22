package com.anonymous.smstracker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log

class SmsReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            for (sms in messages) {
                val body = sms.messageBody
                val sender = sms.originatingAddress ?: "Unknown"

                Log.d("SMSReceiver", "Received SMS from: $sender")
                Log.d("SMSReceiver", "Body: $body")

                // Check if incoming SMS is a bank transaction text
                if (isBankTransaction(body)) {
                    val amount = extractAmount(body)
                    val isDebit = body.lowercase().contains("debited") || body.lowercase().contains("spent")
                    val type = if (isDebit) "DEBIT" else "CREDIT"

                    Log.d("SMSReceiver", "Extracted Transaction: Amount=₹$amount, Type=$type")

                    // Push transaction event across bridge to React Native!
                    val params = com.facebook.react.bridge.Arguments.createMap().apply {
                        putString("title", sender)
                        putDouble("amount", amount)
                        putString("type", type)
                        putString("category", "Bank SMS")
                    }
                    SmsModule.sendEvent("onSMSReceived", params)
                }
            }
        }
    }

    private fun isBankTransaction(body: String): Boolean {
        val lower = body.lowercase()
        return lower.contains("debited") || lower.contains("credited") || lower.contains("spent") || lower.contains("vpa")
    }

    private fun extractAmount(body: String): Double {
        val regex = Regex("""(?i)(?:rs|inr|₹)\.?\s*([\d,]+(?:\.\d{1,2})?)""")
        val match = regex.find(body)
        return match?.groupValues?.get(1)?.replace(",", "")?.toDoubleOrNull() ?: 0.0
    }
}
