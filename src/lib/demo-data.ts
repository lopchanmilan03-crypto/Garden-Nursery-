export type Role = "owner" | "waiter" | "kitchen" | "cashier";

export type MenuCategory = "mains" | "sides" | "drinks" | "sweets";

export type RecipeLine = {
  skuId: string;
  qty: number;
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  popular?: boolean;
  stockSkuId?: string;
  recipe?: RecipeLine[];
  /** Public menu / marketing image (Unsplash/Pexels or custom URL) */
  image?: string;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

export type OrderStatus =
  | "new"
  | "preparing"
  | "ready"
  | "served"
  | "paid"
  | "cancelled";

export type PayMethod = "cash" | "card" | "upi";

export type KitchenTicketLine = {
  menuItemId: string;
  name: string;
  qty: number;
  note?: string;
  voided?: boolean;
  voidReason?: string;
};

export type KitchenTicket = {
  id: string;
  table: string | null;
  type: "dine-in" | "takeaway";
  guest: string;
  waiter: string;
  lines: KitchenTicketLine[];
  status: "queued" | "preparing" | "ready" | "bumped";
  placedAt: string;
  total: number;
  notes?: string;
};

export type BillSplit = {
  id: string;
  label: string;
  amount: number;
  seats?: number;
  paid?: boolean;
  payMethod?: PayMethod;
};

export type DemoOrder = {
  id: string;
  table: string | null;
  guest: string;
  items: string[];
  lines?: KitchenTicketLine[];
  total: number;
  status: OrderStatus;
  placedAt: string;
  type: "dine-in" | "takeaway";
  payMethod?: PayMethod;
  tip?: number;
  discountPct?: number;
  voidReason?: string;
  splits?: BillSplit[];
  source?: "waiter" | "guest";
  stockDeducted?: boolean;
};

export type TableSeat = {
  id: string;
  label: string;
  seats: number;
  status: "open" | "seated" | "ordered" | "clearing";
  orderId?: string;
};

export type StockItem = {
  id: string;
  name: string;
  unit: string;
  qty: number;
  lowAt: number;
  category: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  nameNp?: string;
};

export type Expense = {
  id: string;
  categoryId: string;
  label: string;
  amount: number;
  vendorId?: string;
  date: string;
  paid: boolean;
};

export type Vendor = {
  id: string;
  name: string;
  phone: string;
  dues: number;
  category: string;
};

export type StaffMember = {
  id: string;
  name: string;
  role: Role | "helper";
  shift: string;
  salary: number;
  presentToday: boolean;
  phone: string;
};

export type DayClose = {
  date: string;
  cash: number;
  card: number;
  upi: number;
  expenses: number;
  closed: boolean;
  closedAt?: string;
};

export type MonthlyPoint = {
  month: string;
  sales: number;
  kharcha: number;
  profit: number;
};

export const restaurant = {
  name: "Garden Restaurant",
  tagline: "Fresh plates under the leaves",
  subtitle:
    "A calm Kathmandu cafe for slow mornings, shared tables, and garden-grown flavors.",
  location: "Lazimpat, Kathmandu",
  address: "Lazimpat Road, Kathmandu 44600, Nepal",
  hours: "7:00 – 21:00 · Asia/Kathmandu",
  hoursWeekday: "Mon–Fri · 7:00 AM – 9:00 PM",
  hoursWeekend: "Sat–Sun · 8:00 AM – 9:00 PM",
  phone: "+977-1-4001234",
  email: "hello@gardenrestaurant.np",
  currency: "NPR" as const,
  heroHeadline: "Good food. Quiet mornings.",
  heroSupport:
    "Brunch plates, garden greens, and Nepali cafe classics — served under the leaves in Lazimpat.",
  storyTitle: "A little story behind every plate",
  storyLead:
    "Garden Restaurant started as a terrace kitchen for neighbours who wanted slower mornings and honest food.",
  storyBody:
    "We still cook with market-morning vegetables, Nepali beans, and herbs from planters along the patio. Come for chiya and stay for dal bhat — or the other way around.",
  storyLong: [
    "Anupam opened Garden Restaurant after years of feeding friends on a Lazimpat rooftop. The idea was simple: a cafe that felt like a garden — leafy, unhurried, and open from early chiya to late dinner.",
    "Today the patio seats fill with regulars, travellers, and families who share momos, filter coffee, and long conversations. Our kitchen still shops Kalimati at dawn and writes the board by hand when something runs low.",
    "We are not a franchise template. We are a neighbourhood cafe that happens to run a proper floor — waiter tablets, kitchen tickets, and all — so your brunch arrives hot.",
  ],
};

/** Public-site imagery — Unsplash cafe/garden food (not third-party brand assets). */
export const marketingGallery: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80",
    alt: "Shared table with brunch plates",
    caption: "Shared tables",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    alt: "Cafe interior with warm light",
    caption: "Inside the garden",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    alt: "Pour-over coffee preparation",
    caption: "Garden filter coffee",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    alt: "Evening restaurant seating",
    caption: "Stay a little longer",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    alt: "Outdoor cafe patio greenery",
    caption: "Patio greens",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    alt: "Seasonal plated dish",
    caption: "Seasonal plates",
  },
];

export const marketingHeroImage =
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=80";

export const marketingAboutImage =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1400&q=80";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The patio chiya and dal bhat ruined every rushed breakfast for me. I bring clients here on purpose.",
    name: "Niraj T.",
    detail: "Regular since 2022",
  },
  {
    id: "t2",
    quote:
      "Momos arrive hot, the greens taste like a garden, and nobody rushes you out. Rare in Lazimpat.",
    name: "Sama K.",
    detail: "Weekend brunch",
  },
  {
    id: "t3",
    quote:
      "Filter coffee worth the walk. Soft light, real plants, and staff who remember how you take your lemon.",
    name: "Elliot M.",
    detail: "Visitor from Pokhara",
  },
];

export const roles: { id: Role; label: string; hint: string }[] = [
  { id: "owner", label: "Owner / Admin", hint: "Sales, kharcha, reports, settings" },
  { id: "waiter", label: "Waiter", hint: "Phone ordering to kitchen" },
  { id: "kitchen", label: "Kitchen", hint: "Live ticket screen" },
  { id: "cashier", label: "Cashier", hint: "Billing & day close" },
];

export const menuCategories: { id: MenuCategory; label: string }[] = [
  { id: "mains", label: "Mains" },
  { id: "sides", label: "Sides" },
  { id: "drinks", label: "Drinks" },
  { id: "sweets", label: "Sweets" },
];

export const seedMenuItems: MenuItem[] = [
  {
    id: "dal-bhat",
    name: "Garden Dal Bhat",
    description: "Slow-cooked lentils, steamed rice, seasonal tarkari, pickle.",
    price: 450,
    category: "mains",
    popular: true,
    stockSkuId: "sku-dal",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "thukpa",
    name: "Herb Thukpa Bowl",
    description: "Clear broth, hand-pulled noodles, garden greens, chili oil.",
    price: 380,
    category: "mains",
    popular: true,
    stockSkuId: "sku-noodles",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "momos",
    name: "Steam Momos (8)",
    description: "Chicken or veg, sesame achar, ginger dipping broth.",
    price: 320,
    category: "mains",
    stockSkuId: "sku-momo",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "flatbread",
    name: "Wood-oven Flatbread",
    description: "Tomato, buffalo mozzarella, basil from the terrace planters.",
    price: 520,
    category: "mains",
    stockSkuId: "sku-flour",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "salad",
    name: "Terrace Green Salad",
    description: "Mixed leaves, cucumber, toasted peanuts, lime-honey dressing.",
    price: 280,
    category: "sides",
    stockSkuId: "sku-greens",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "fries",
    name: "Herb Salt Fries",
    description: "Crispy potato wedges with rosemary and smoked chili mayo.",
    price: 220,
    category: "sides",
    stockSkuId: "sku-potato",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chiya",
    name: "Masala Chiya",
    description: "Cardamom, ginger, black tea — served in a clay cup.",
    price: 80,
    category: "drinks",
    popular: true,
    stockSkuId: "sku-tea",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "filter-coffee",
    name: "Garden Filter Coffee",
    description: "Single-origin Nepali beans, pour-over, lightly floral.",
    price: 180,
    category: "drinks",
    stockSkuId: "sku-coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lemonade",
    name: "Mint Lemonade",
    description: "Fresh lemon, muddled mint, a touch of Himalayan salt.",
    price: 160,
    category: "drinks",
    stockSkuId: "sku-lemon",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lassi",
    name: "Mango Lassi",
    description: "Thick yogurt, ripe mango, crushed cardamom.",
    price: 200,
    category: "drinks",
    stockSkuId: "sku-yogurt",
    image:
      "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "sel-roti",
    name: "Sel Roti & Honey",
    description: "Crisp rice rings with local wildflower honey.",
    price: 150,
    category: "sweets",
    stockSkuId: "sku-rice",
    image:
      "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "brownie",
    name: "Walnut Brownie",
    description: "Warm square, cocoa dust, vanilla cream.",
    price: 240,
    category: "sweets",
    stockSkuId: "sku-cocoa",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  },
];

/** @deprecated use seedMenuItems via OpsProvider */
export const menuItems = seedMenuItems;

export const seedTables: TableSeat[] = [
  { id: "t1", label: "T1 · Patio", seats: 2, status: "open" },
  { id: "t2", label: "T2 · Patio", seats: 4, status: "seated", orderId: "ord-1042" },
  { id: "t3", label: "T3 · Window", seats: 2, status: "ordered", orderId: "ord-1041" },
  { id: "t4", label: "T4 · Window", seats: 4, status: "open" },
  { id: "t5", label: "T5 · Garden", seats: 6, status: "clearing" },
  { id: "t6", label: "T6 · Garden", seats: 4, status: "ordered", orderId: "ord-1040" },
  { id: "t7", label: "T7 · Counter", seats: 2, status: "open" },
  { id: "t8", label: "T8 · Lounge", seats: 3, status: "seated", orderId: "ord-1043" },
];

export const demoTables = seedTables;

export const seedOrders: DemoOrder[] = [
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
    payMethod: "upi",
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
    payMethod: "cash",
  },
  {
    id: "ord-1038",
    table: null,
    guest: "Takeaway · Office",
    items: ["Herb Thukpa ×3", "Fries ×2"],
    total: 1580,
    status: "paid",
    placedAt: "13:28",
    type: "takeaway",
    payMethod: "card",
  },
];

export const demoOrders = seedOrders;

export const seedKitchenTickets: KitchenTicket[] = [
  {
    id: "kt-2201",
    table: "T8",
    type: "dine-in",
    guest: "Walk-in",
    waiter: "Sita",
    lines: [
      { menuItemId: "chiya", name: "Masala Chiya", qty: 2 },
      { menuItemId: "brownie", name: "Walnut Brownie", qty: 1 },
    ],
    status: "queued",
    placedAt: "14:52",
    total: 400,
  },
  {
    id: "kt-2200",
    table: "T2",
    type: "dine-in",
    guest: "Anisha R.",
    waiter: "Ram",
    lines: [
      { menuItemId: "dal-bhat", name: "Garden Dal Bhat", qty: 1 },
      { menuItemId: "lemonade", name: "Mint Lemonade", qty: 1 },
    ],
    status: "preparing",
    placedAt: "14:38",
    total: 610,
  },
  {
    id: "kt-2199",
    table: "T3",
    type: "dine-in",
    guest: "Pratik S.",
    waiter: "Sita",
    lines: [
      { menuItemId: "momos", name: "Steam Momos (8)", qty: 1 },
      { menuItemId: "thukpa", name: "Herb Thukpa Bowl", qty: 1 },
      { menuItemId: "filter-coffee", name: "Garden Filter Coffee", qty: 1 },
    ],
    status: "ready",
    placedAt: "14:21",
    total: 880,
  },
];

export const seedStock: StockItem[] = [
  { id: "sku-dal", name: "Masoor dal", unit: "kg", qty: 8, lowAt: 4, category: "Dry" },
  { id: "sku-noodles", name: "Thukpa noodles", unit: "kg", qty: 3, lowAt: 5, category: "Dry" },
  { id: "sku-momo", name: "Momo wrappers", unit: "pack", qty: 12, lowAt: 6, category: "Frozen" },
  { id: "sku-flour", name: "Atta / flour", unit: "kg", qty: 15, lowAt: 5, category: "Dry" },
  { id: "sku-greens", name: "Garden greens", unit: "bunch", qty: 4, lowAt: 6, category: "Fresh" },
  { id: "sku-potato", name: "Potato", unit: "kg", qty: 18, lowAt: 8, category: "Fresh" },
  { id: "sku-tea", name: "Chiya leaves", unit: "kg", qty: 2.5, lowAt: 1, category: "Beverage" },
  { id: "sku-coffee", name: "Nepali beans", unit: "kg", qty: 1.2, lowAt: 1.5, category: "Beverage" },
  { id: "sku-lemon", name: "Lemon", unit: "kg", qty: 3, lowAt: 2, category: "Fresh" },
  { id: "sku-yogurt", name: "Yogurt", unit: "L", qty: 6, lowAt: 4, category: "Dairy" },
  { id: "sku-rice", name: "Rice (sel)", unit: "kg", qty: 10, lowAt: 5, category: "Dry" },
  { id: "sku-cocoa", name: "Cocoa powder", unit: "kg", qty: 0.8, lowAt: 1, category: "Baking" },
];

export const seedExpenseCategories: ExpenseCategory[] = [
  { id: "exp-veg", name: "Vegetables", nameNp: "तरकारी" },
  { id: "exp-meat", name: "Meat & poultry", nameNp: "मासु" },
  { id: "exp-dairy", name: "Dairy", nameNp: "दुग्ध" },
  { id: "exp-gas", name: "Gas & utilities", nameNp: "ग्यास / बिल" },
  { id: "exp-rent", name: "Rent", nameNp: "भाडा" },
  { id: "exp-misc", name: "Misc / packaging", nameNp: "अन्य" },
];

export const seedVendors: Vendor[] = [
  {
    id: "ven-kalimati",
    name: "Kalimati Fresh Mart",
    phone: "9801112233",
    dues: 4200,
    category: "Vegetables",
  },
  {
    id: "ven-dairy",
    name: "Himalayan Dairy Co-op",
    phone: "9841223344",
    dues: 1800,
    category: "Dairy",
  },
  {
    id: "ven-gas",
    name: "Lazimpat Gas Service",
    phone: "01-4411222",
    dues: 0,
    category: "Utilities",
  },
  {
    id: "ven-meat",
    name: "Bhaktapur Meat House",
    phone: "9812334455",
    dues: 3500,
    category: "Meat",
  },
];

export const seedExpenses: Expense[] = [
  {
    id: "ex-1",
    categoryId: "exp-veg",
    label: "Morning vegetable run",
    amount: 2400,
    vendorId: "ven-kalimati",
    date: "2026-11-27",
    paid: true,
  },
  {
    id: "ex-2",
    categoryId: "exp-dairy",
    label: "Yogurt & milk",
    amount: 1200,
    vendorId: "ven-dairy",
    date: "2026-11-27",
    paid: false,
  },
  {
    id: "ex-3",
    categoryId: "exp-gas",
    label: "LPG cylinder",
    amount: 1900,
    vendorId: "ven-gas",
    date: "2026-11-26",
    paid: true,
  },
  {
    id: "ex-4",
    categoryId: "exp-meat",
    label: "Chicken for momos",
    amount: 3200,
    vendorId: "ven-meat",
    date: "2026-11-26",
    paid: false,
  },
  {
    id: "ex-5",
    categoryId: "exp-misc",
    label: "Takeaway boxes",
    amount: 650,
    date: "2026-11-25",
    paid: true,
  },
];

export const seedStaff: StaffMember[] = [
  {
    id: "st-owner",
    name: "Anupam Bajracharya",
    role: "owner",
    shift: "Flexible",
    salary: 0,
    presentToday: true,
    phone: "9800000001",
  },
  {
    id: "st-sita",
    name: "Sita Gurung",
    role: "waiter",
    shift: "Morning 7–15",
    salary: 28000,
    presentToday: true,
    phone: "9800000002",
  },
  {
    id: "st-ram",
    name: "Ram Shrestha",
    role: "waiter",
    shift: "Evening 15–22",
    salary: 28000,
    presentToday: true,
    phone: "9800000003",
  },
  {
    id: "st-chef",
    name: "Bikash Lama",
    role: "kitchen",
    shift: "Full day 9–21",
    salary: 45000,
    presentToday: true,
    phone: "9800000004",
  },
  {
    id: "st-cash",
    name: "Maya Tamang",
    role: "cashier",
    shift: "Morning 8–16",
    salary: 32000,
    presentToday: false,
    phone: "9800000005",
  },
  {
    id: "st-help",
    name: "Hari Magar",
    role: "helper",
    shift: "Full day",
    salary: 22000,
    presentToday: true,
    phone: "9800000006",
  },
];

export const seedDayClose: DayClose = {
  date: "2026-11-27",
  cash: 530,
  card: 1580,
  upi: 1150,
  expenses: 3600,
  closed: false,
};

export const seedMonthly: MonthlyPoint[] = [
  { month: "Jun", sales: 385000, kharcha: 210000, profit: 175000 },
  { month: "Jul", sales: 402000, kharcha: 225000, profit: 177000 },
  { month: "Aug", sales: 418000, kharcha: 232000, profit: 186000 },
  { month: "Sep", sales: 395000, kharcha: 240000, profit: 155000 },
  { month: "Oct", sales: 455000, kharcha: 248000, profit: 207000 },
  { month: "Nov", sales: 312000, kharcha: 168000, profit: 144000 },
];

export const paymentMethods = [
  { id: "cash" as const, label: "Cash", hint: "Counter cash" },
  { id: "card" as const, label: "Card", hint: "Demo tap · no real charge" },
  { id: "upi" as const, label: "UPI / QR", hint: "eSewa / Khalti sample QR" },
];

export const tipPresets = [0, 50, 100, 150];

export function getMenuItem(id: string): MenuItem | undefined {
  return seedMenuItems.find((item) => item.id === id);
}

export function dashboardStats() {
  const openTables = seedTables.filter((t) => t.status === "open").length;
  const activeOrders = seedOrders.filter(
    (o) => o.status !== "paid" && o.status !== "served",
  ).length;
  const revenueToday = seedOrders
    .filter((o) => o.status === "paid" || o.status === "served")
    .reduce((sum, o) => sum + o.total, 0);
  return {
    openTables,
    activeOrders,
    revenueToday,
    totalTables: seedTables.length,
  };
}

export type OpsSettings = {
  vatEnabled: boolean;
  vatPercent: number;
};

export type OpsState = {
  menuItems: MenuItem[];
  tables: TableSeat[];
  orders: DemoOrder[];
  kitchenTickets: KitchenTicket[];
  stock: StockItem[];
  expenseCategories: ExpenseCategory[];
  expenses: Expense[];
  vendors: Vendor[];
  staff: StaffMember[];
  dayClose: DayClose;
  monthly: MonthlyPoint[];
  role: Role;
  waiterName: string;
  settings: OpsSettings;
};

/** Attach simple recipe lines from stockSkuId when missing; backfill marketing images. */
export function withSeedRecipes(items: MenuItem[]): MenuItem[] {
  return items.map((item) => {
    const seed = seedMenuItems.find((s) => s.id === item.id);
    const withImage: MenuItem = {
      ...item,
      image: item.image || seed?.image,
    };
    if (withImage.recipe?.length) return withImage;
    if (!withImage.stockSkuId) return { ...withImage, recipe: [] };
    const base: RecipeLine[] = [{ skuId: withImage.stockSkuId, qty: 0.25 }];
    // Light secondary ingredients for a more realistic demo
    if (withImage.category === "mains" && withImage.stockSkuId !== "sku-greens") {
      base.push({ skuId: "sku-greens", qty: 0.05 });
    }
    if (withImage.id === "dal-bhat") {
      return {
        ...withImage,
        recipe: [
          { skuId: "sku-dal", qty: 0.15 },
          { skuId: "sku-rice", qty: 0.2 },
          { skuId: "sku-greens", qty: 0.08 },
        ],
      };
    }
    if (withImage.id === "momos") {
      return {
        ...withImage,
        recipe: [
          { skuId: "sku-momo", qty: 1 },
          { skuId: "sku-greens", qty: 0.05 },
        ],
      };
    }
    return { ...withImage, recipe: base };
  });
}

export function createSeedState(): OpsState {
  return {
    menuItems: withSeedRecipes(structuredClone(seedMenuItems)),
    tables: structuredClone(seedTables),
    orders: structuredClone(seedOrders),
    kitchenTickets: structuredClone(seedKitchenTickets),
    stock: structuredClone(seedStock),
    expenseCategories: structuredClone(seedExpenseCategories),
    expenses: structuredClone(seedExpenses),
    vendors: structuredClone(seedVendors),
    staff: structuredClone(seedStaff),
    dayClose: structuredClone(seedDayClose),
    monthly: structuredClone(seedMonthly),
    role: "owner",
    waiterName: "Sita Gurung",
    settings: { vatEnabled: true, vatPercent: 13 },
  };
}

export function activeLines(order: DemoOrder): KitchenTicketLine[] {
  return (order.lines ?? []).filter((l) => !l.voided);
}

export function orderSubtotal(order: DemoOrder, menu: MenuItem[]): number {
  const lines = activeLines(order);
  if (lines.length) {
    return lines.reduce((sum, l) => {
      const price = menu.find((m) => m.id === l.menuItemId)?.price ?? 0;
      return sum + price * l.qty;
    }, 0);
  }
  return order.total;
}

export function orderPayableTotal(
  order: DemoOrder,
  menu: MenuItem[],
  settings: OpsSettings,
): number {
  if (order.status === "cancelled") return 0;
  const sub = orderSubtotal(order, menu);
  const afterDiscount = sub * (1 - (order.discountPct ?? 0) / 100);
  const vat = settings.vatEnabled
    ? afterDiscount * (settings.vatPercent / 100)
    : 0;
  return +(afterDiscount + vat + (order.tip ?? 0)).toFixed(2);
}

export function deductStockForLines(
  stock: StockItem[],
  menu: MenuItem[],
  lines: { menuItemId: string; qty: number; voided?: boolean }[],
): StockItem[] {
  const usage = new Map<string, number>();
  for (const line of lines) {
    if (line.voided) continue;
    const item = menu.find((m) => m.id === line.menuItemId);
    const recipe = item?.recipe?.length
      ? item.recipe
      : item?.stockSkuId
        ? [{ skuId: item.stockSkuId, qty: 0.25 }]
        : [];
    for (const r of recipe) {
      usage.set(r.skuId, (usage.get(r.skuId) ?? 0) + r.qty * line.qty);
    }
  }
  return stock.map((row) => {
    const used = usage.get(row.id);
    if (!used) return row;
    return { ...row, qty: Math.max(0, +(row.qty - used).toFixed(2)) };
  });
}

export function todaySale(orders: DemoOrder[], menu: MenuItem[] = seedMenuItems, settings: OpsSettings = { vatEnabled: false, vatPercent: 13 }) {
  return orders
    .filter((o) => o.status === "paid" || o.status === "served")
    .reduce((s, o) => s + orderPayableTotal(o, menu, settings), 0);
}

export function todayKharcha(expenses: Expense[], date = "2026-11-27") {
  return expenses
    .filter((e) => e.date === date)
    .reduce((s, e) => s + e.amount, 0);
}

export function paySplit(
  orders: DemoOrder[],
  menu: MenuItem[] = seedMenuItems,
  settings: OpsSettings = { vatEnabled: false, vatPercent: 13 },
) {
  const split = { cash: 0, card: 0, upi: 0 };
  for (const o of orders) {
    if (o.status !== "paid" && o.status !== "served") continue;
    if (o.splits?.length) {
      for (const part of o.splits) {
        if (!part.paid) continue;
        const method = part.payMethod ?? o.payMethod ?? "cash";
        split[method] += part.amount;
      }
      continue;
    }
    const method = o.payMethod ?? "cash";
    split[method] += orderPayableTotal(o, menu, settings);
  }
  return split;
}
