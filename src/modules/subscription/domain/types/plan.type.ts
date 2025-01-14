export interface Plan {
  id: number;
  userId: number;
  planId: number;
  plan: {
    id: number;
    name: string;
    price: number;
  };
  planPrice: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
