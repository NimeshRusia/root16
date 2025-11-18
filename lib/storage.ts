import { UserProfile, Transaction } from "@/types/budget";

const STORAGE_KEY = "spendsmart_user_profile";

export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const profile: UserProfile = JSON.parse(stored);

    // Ensure transactions array exists
    if (!Array.isArray(profile.transactions)) {
      profile.transactions = [];
    }

    // Safely convert timestamps
    profile.transactions = profile.transactions.map((t) => ({
      ...t,
      timestamp: new Date(t.timestamp),
    }));

    return profile;
  } catch (err) {
    console.error("Corrupted profile data:", err);
    return null;
  }
};

export const updateWalletBalance = (amount: number): void => {
  const profile = getUserProfile();
  if (!profile) return;

  profile.walletBalance += amount;
  saveUserProfile(profile);
};

export const addTransaction = (transaction: Omit<Transaction, "id">): void => {
  const profile = getUserProfile();
  if (!profile) return;

  const newTransaction: Transaction = {
    ...transaction,
    id: Date.now().toString(),
  };

  // Ensure transactions always exists
  if (!Array.isArray(profile.transactions)) profile.transactions = [];

  profile.transactions.unshift(newTransaction);

  // Update balance
  if (transaction.type === "debit") {
    profile.walletBalance -= transaction.amount;
  } else {
    profile.walletBalance += transaction.amount;
  }

  saveUserProfile(profile);
};

export const clearUserProfile = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
