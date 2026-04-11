export type Order = {
  id: number;
  customerName: string;
  customerPhone: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELED";
};
