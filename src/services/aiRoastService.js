// AI Roast Generator Engine

const HIGH_SPEND_ROASTS = [
  "₹{spent} spent today? Are you training to be a professional consumer or is your money just burning a hole in your pocket?",
  "Your wallet is on life support! ₹{spent} spent today? Calm down, Warren Buffett!",
  "₹{spent} in a single day? Your bank account is crying louder than your morning alarm clock! 😭💸",
];

const FOOD_ROASTS = [
  "You spent ₹{amount} on food & coffee? Your bank account needs energy drinks more than you need caffeine! ☕🔥",
  "₹{amount} for bean water and snacks? You could have bought shares in Starbucks by now!",
];

const SHOPPING_ROASTS = [
  "₹{amount} at {title}? Retail therapy won't heal your bank account's trauma! 🛍️💀",
  "Shopping at {title} again? Your savings are running away faster than you ever will!",
];

const LOW_SPEND_ROASTS = [
  "Only ₹{spent} spent today? Did your internet connection die, or are you actually saving money? Impressive! 👏",
  "Low spending detected today! Your wallet is finally getting a well-deserved nap. 💤",
];

export const generateAIRoast = (transactions, spentToday) => {
  if (!spentToday || spentToday === 0) {
    const randomIndex = Math.floor(Math.random() * LOW_SPEND_ROASTS.length);
    return LOW_SPEND_ROASTS[randomIndex];
  }

  const latest = transactions && transactions.length > 0 ? transactions[0] : null;

  if (latest && (latest.category?.toLowerCase().includes('food') || latest.title?.toLowerCase().includes('coffee'))) {
    const template = FOOD_ROASTS[Math.floor(Math.random() * FOOD_ROASTS.length)];
    return template.replace('{amount}', latest.amount.toFixed(0));
  }

  if (latest && (latest.category?.toLowerCase().includes('shopping') || latest.amount > 2000)) {
    const template = SHOPPING_ROASTS[Math.floor(Math.random() * SHOPPING_ROASTS.length)];
    return template.replace('{amount}', latest.amount.toFixed(0)).replace('{title}', latest.title || 'the store');
  }

  const template = HIGH_SPEND_ROASTS[Math.floor(Math.random() * HIGH_SPEND_ROASTS.length)];
  return template.replace('{spent}', spentToday.toFixed(0));
};
