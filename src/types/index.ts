
export enum PaymentMethod {
  PIX = 'PIX',
  Dinheiro = 'Dinheiro',
  Cartão = 'Cartão'
}


export type Event = {
  id: string;
  date: string;
  time: string;
  artist: string;
  artistId: string;
  contractor: string;
  contractorId: string;
  value: number;
  isDone: boolean;
  isPaid: boolean;
  paymentMethod?: PaymentMethod | null;
  pixKey?: string | null;
  observations?: string;
  isTransferred: boolean;
  transferredToBankAccountId?: string | null;
  transferDate?: string | null;
  paidTo?: string | null;
};

export type Artist = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type Contractor = {
  id: string;
  name: string;
};

export type BankAccount = {
  id: string;
  bankName: string;
  agency: string;
  accountNumber: string;
  balance: number;
  imageUrl?: string;
};

export type Transaction = {
    id: string;
    description: string;
    value: number;
    date: string;
    type: 'Receita' | 'Despesa';
    categoryId?: string | null;
    categoryName?: string;
    isTransferred: boolean;
    transferredToBankAccountId?: string | null;
    transferDate?: string;
    bankAccountId?: string | null;
    paymentMethod?: PaymentMethod | null;
    pixKey?: string | null;
    paidTo?: string | null;
    contractorId?: string | null;
}

export type ExpenseCategory = {
    id: string;
    name: string;
}

export type FontOption = 'Poppins' | 'PT Sans' | 'Roboto' | 'Lato' | 'Open Sans' | 'Montserrat' | 'Nunito' | 'Raleway' | 'Merriweather' | 'Playfair Display';
export type FontSize = 'sm' | 'base' | 'lg';
export type ColorTheme = 'slate' | 'zinc' | 'stone';

export type ThemeSettings = {
    theme: 'light' | 'dark';
    fontHeadline: FontOption;
    fontBody: FontOption;
    primaryColor: string;
    fontSize: FontSize;
    colorTheme: ColorTheme;
    pageBackgroundColor: string;
}

export type UserRole = 'admin' | 'user';

export type User = {
  id: string;
  username: string;
  pass: string;
  role: UserRole;
}
