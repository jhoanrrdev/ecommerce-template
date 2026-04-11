export type Promotion = {
  id: number;
  title: string;
  type: "PERCENTAGE" | "FIXED" | "PRICE_OVERRIDE";
  value: number;
  active: boolean;
};
