export interface Transaction {
  type: String;
  title?: String;
  amount: number;
  date: Date;
  category?: String;
  account?: String;
  notes?: String;
  applied?: Boolean;
}
