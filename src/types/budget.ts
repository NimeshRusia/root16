export interface CategoryBudget {
  food: number;
  travel: number;
  shelter: number;
  quickCommerce: number;
  healthcare: number;
  gyms: number;
}

export interface MonthlyBudget {
  total: number;
  categories: CategoryBudget;
  payCycleDay: number;
}

export interface Transaction {
  id: string;
  amount: number;
  category: keyof CategoryBudget;
  vendor: string;
  timestamp: Date;
  description: string;
  type: 'debit' | 'credit';
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  monthlyBudget: MonthlyBudget;
  walletBalance: number;
  transactions: Transaction[];
  subscriptionTier: 'free' | 'pro' | 'premium';
}

export type CategoryName = keyof CategoryBudget;
