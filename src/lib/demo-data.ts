export type MenuCategory = "mains" | "sides" | "drinks" | "sweets";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  popular?: boolean;
};

export type OrderStatus = "new" | "preparing" | "ready" | "served" | "paid";

export type DemoOrder = {
  id: string;
  table: string | null;
  guest: string;
  items: string[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  type: "dine-in" | "takeaway";
};

export type TableSeat = {
  id: string;
  label: string;
  seats: number;
  status: "open" | "seated" | "ordered" | "clearing";
  orderId?: string;
};

export const restaurant = {
  name: "Garden Restaurant",
  tagline: "Fresh plates under the leaves",
  subtitle:
    "A calm Kathmandu cafe for slow mornings, shared tables, and garden-grown flavors.",
  location: "Lazimpat, Kathmandu",
  hours: "7:00 – 21:00 · Asia/Kathmandu",
  phone: "+977-1-4001234",
  currency: "NPR" as const,
};

export const menuCategories: { id: MenuCategory; label: string }[] = [
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "sweets", label: "Sweets" },
];

export const menuItems: MenuItem[] = [
  {
    id: "dal-bhat",
    name: "Garden Dal Bhat",
    description: "Slow-cooked lentils, steamed rice, seasonal tarkari, pickle.",
    price: 450,
    category: "mains",
    popular: true,
  },
  {
    id: "thukpa",
    name: "Herb Thukpa Bowl",
    description: "Clear broth, hand-pulled noodles, garden greens, chili oil.",
    price: 380,
    category: "mains",
    popular: true,
  },
  {
    id: "momos",
    name: "Steam Momos (8)",
    description: "Chicken or veg, sesame achar, ginger dipping broth.",
    price: 320,
    category: "mains",
  },
  {
    id: "flatbread",
    name: "Wood-oven Flatbread",
    description: "Tomato, buffalo mozzarella, basil from the terrace planters.",
    price: 520,
    category: "mains",
  },
  {
    id: "salad",
    name: "Terrace Green Salad",
    description: "Mixed leaves, cucumber, toasted peanuts, lime-honey dressing.",
    price: 280,
    category: "sides",
  },
  {
    id: "fries",
    name: "Herb Salt Fries",
    description: "Crispy potato wedges with rosemary and smoked chili mayo.",
    price: 220,
    category: "sides",
  },
  {
    id: "chiya",
    name: "Masala Chiya",
    description: "Cardamom, ginger, black tea — served in a clay cup.",
    price: 80,
    category: "drinks",
    popular: true,
  },
  {
    id: "filter-coffee",
    name: "Garden Filter Coffee",
    description: "Single-origin Nepali beans, pour-over, lightly floral.",
    price: 180,
    category: "drinks",
  },
  {
    id: "lemonade",
    name: "Mint Lemonade",
    description: "Fresh lemon, muddled mint, a touch of Himalayan salt.",
    price: 160,
    category: "drinks",
  },
  {
    id: "lassi",
    name: "Mango Lassi",
    description: "Thick yogurt, ripe mango, crushed cardamom.",
    price: 200,
    category: "drinks",
  },
  {
    id: "sel-roti",
    name: "Sel Roti & Honey",
    description: "Crisp rice rings with local wildflower honey.",
    price: 150,
    category: "sweets",
  },
  {
    id: "brownie",
    name: "Walnut Brownie",
    description: "Warm square, cocoa dust, vanilla cream.",
    price: 240,
    category: "sweets",
  },
];

export const demoTables: TableSeat[] = [
  { id: "t1", label: "T1 · Patio", seats: 2, status: "open" },
  { id: "t2", label: "T2 · Patio", seats: 4, status: "seated", orderId: "ord-1042" },
  { id: "t3", label: "T3 · Window", seats: 2, status: "ordered", orderId: "ord-1041" },
  { id: "t4", label: "T4 · Window", seats: 4, status: "open" },
  { id: "t5", label: "T5 · Garden", seats: 6, status: "clearing" },
  { id: "t6", label: "T6 · Garden", seats: 4, status: "ordered", orderId: "ord-1040" },
  { id: "t7", label: "T7 · Counter", seats: 2, status: "open" },
  { id: "t8", label: "T8 · Lounge", seats: 3, status: "seated", orderId: "ord-1043" },
];

export const demoOrders: DemoOrder[] = [
  {
    id: "ord-1043",
    table: "T8",
    guest: "Walk-in",
    items: ["Masala Chiya ×2", "Walnut Brownie"],
    total: 400,
    status: "new",
    placedAt: "14:52",
    type: "dine-in",
  },
  {
    id: "ord-1042",
    table: "T2",
    guest: "Anisha R.",
    items: ["Garden Dal Bhat", "Mint Lemonade"],
    total: 610,
    status: "preparing",
    placedAt: "14:38",
    type: "dine-in",
  },
  {
    id: "ord-1041",
    table: "T3",
    guest: "Pratik S.",
    items: ["Steam Momos (8)", "Herb Thukpa Bowl", "Filter Coffee"],
    total: 880,
    status: "ready",
    placedAt: "14:21",
    type: "dine-in",
  },
  {
    id: "ord-1040",
    table: "T6",
    guest: "Family of 4",
    items: ["Flatbread", "Terrace Salad", "Mango Lassi ×2", "Sel Roti"],
    total: 1150,
    status: "served",
    placedAt: "13:55",
    type: "dine-in",
  },
  {
    id: "ord-1039",
    table: null,
    guest: "Takeaway · Raju",
    items: ["Garden Dal Bhat", "Masala Chiya"],
    total: 530,
    status: "paid",
    placedAt: "13:40",
    type: "takeaway",
  },
  {
    id: "ord-1038",
    table: null,
    guest: "Takeaway · Office",
    items: ["Herb Thukpa ×3", "Fries ×2"],
    total: 1580,
    status: "ready",
    placedAt: "13:28",
    type: "takeaway",
  },
];

export const paymentMethods = [
  {
    id: "cash" as const,
    label: "Cash",
    hint: "Pay at the counter",
  },
  {
    id: "card" as const,
    label: "Card",
    hint: "Demo tap · no real charge",
  },
  {
    id: "qr" as const,
    label: "QR / eSewa",
    hint: "Sample QR only",
  },
];

export const tipPresets = [0, 50, 100, 150];

export function getMenuItem(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function dashboardStats() {
  const openTables = demoTables.filter((t) => t.status === "open").length;
  const activeOrders = demoOrders.filter(
    (o) => o.status !== "paid" && o.status !== "served",
  ).length;
  const revenueToday = demoOrders
    .filter((o) => o.status === "paid" || o.status === "served")
    .reduce((sum, o) => sum + o.total, 0);
  return { openTables, activeOrders, revenueToday, totalTables: demoTables.length };
}
