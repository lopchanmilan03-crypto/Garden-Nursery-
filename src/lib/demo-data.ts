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
  /** Approx unit cost NPR — for profit-by-product reports */
  cost?: number;
  category: MenuCategory;
  popular?: boolean;
  stockSkuId?: string;
  recipe?: RecipeLine[];
  /** Public menu / marketing image (Unsplash/Pexels or custom URL) */
  image?: string;
};

/** App login role (maps floor → "staff"). */
export type AuthRole = "owner" | "staff" | "kitchen" | "cashier";

export type AuthSession = {
  role: AuthRole;
  staffId: string;
  displayName: string;
};

/** Demo role profiles — entry by role tap, not passwords. */
export type RoleProfile = {
  role: AuthRole;
  staffId: string;
  displayName: string;
  hint: string;
};

export type AttendanceStatus = "on-time" | "late" | "absent" | "working";

export type AttendanceRecord = {
  id: string;
  staffId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  scheduledStart: string;
  status: AttendanceStatus;
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
  /** Linked DemoOrder id — preferred sync key */
  orderId?: string;
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
  /** Set when closed by auto end-of-day. */
  autoClosed?: boolean;
};

/** Persisted closed-day snapshot for Owner history. */
export type DayRecord = {
  date: string;
  closedAt: string;
  sales: number;
  expenses: number;
  profit: number;
  cash: number;
  card: number;
  upi: number;
  openBills: number;
  auto?: boolean;
};

export type MonthlyPoint = {
  month: string;
  sales: number;
  kharcha: number;
  profit: number;
};

export const restaurant = {
  name: "Garden Restaurant",
  tagline: "Peace among the plants",
  subtitle:
    "A quiet Kathmandu garden cafe — coffee, a limited mindful menu, and space to work slowly.",
  location: "Kathmandu",
  address: "Kathmandu, Nepal",
  hours: "8:00 – 20:00 · Asia/Kathmandu",
  hoursWeekday: "Mon–Fri · 8:00 AM – 8:00 PM",
  hoursWeekend: "Sat–Sun · 8:00 AM – 8:00 PM",
  phone: "+977-1-4001234",
  email: "hello@gardenrestaurant.np",
  currency: "NPR" as const,
  heroHeadline: "Coffee. Plants. Quiet work.",
  heroSupport:
    "Dine among the greenery in Lazimpat — filter coffee, a short seasonal menu, and a patio made for calm mornings.",
  storyTitle: "A garden cafe, not a rush hour",
  storyLead:
    "Garden Restaurant is a dine-in cafe tucked among plants — for coffee, light plates, and unhurried work.",
  storyBody:
    "We keep the menu small on purpose. Herbs from the patio planters, Nepali beans in the pour-over, and enough quiet that you can finish a chapter or a call.",
  storyLong: [
    "Anupam opened Garden Restaurant after years of serving friends on a Lazimpat terrace. The idea was never a busy floor — it was a garden cafe: leafy, slow, and open for coffee and a few honest plates.",
    "Guests come for filter coffee, chiya, and a short menu of garden salads, dal bhat, and momos. Laptops are welcome. Waiting lists are not. The patio is for conversation and calm work among the plants.",
    "Staff tools stay simple — table menus, a quiet kitchen pass, and gentle billing — so the room can stay peaceful while your coffee arrives warm.",
  ],
};

/** Public-site imagery — Unsplash garden/cafe/coffee (placeholders, not third-party brands). */
export const marketingGallery: GalleryImage[] = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    alt: "Outdoor cafe patio with greenery",
    caption: "Patio among plants",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    alt: "Pour-over coffee preparation",
    caption: "Garden filter coffee",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
    alt: "Lush potted plants and leaves",
    caption: "Peace among plants",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80",
    alt: "Quiet cafe corner with warm light",
    caption: "Slow work corner",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    alt: "Fresh green salad plate",
    caption: "Limited mindful menu",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    alt: "Laptop and coffee on a cafe table",
    caption: "Stay as long as you need",
  },
];

export const marketingHeroImage =
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1800&q=80";

export const marketingAboutImage =
  "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=80";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "I finish half my week’s writing here — filter coffee, soft light, and nobody hurrying the table.",
    name: "Niraj T.",
    detail: "Regular since 2022",
  },
  {
    id: "t2",
    quote:
      "A short menu done carefully. The patio plants make Lazimpat feel far quieter than it is.",
    name: "Sama K.",
    detail: "Weekend mornings",
  },
  {
    id: "t3",
    quote:
      "Came for chiya, stayed for calm work. Real plants, soft corners, staff who leave you in peace.",
    name: "Elliot M.",
    detail: "Visitor from Pokhara",
  },
];

export const roles: { id: Role; label: string; hint: string }[] = [
  { id: "owner", label: "Owner / Admin", hint: "Sales, kharcha, quiet reports" },
  { id: "waiter", label: "Floor", hint: "Table orders to the kitchen" },
  { id: "kitchen", label: "Kitchen", hint: "Calm pass for dine-in plates" },
  { id: "cashier", label: "Cashier", hint: "Gentle billing & day close" },
];

export const menuCategories: { id: MenuCategory; label: string }[] = [
  { id: "mains", label: "Plates" },
  { id: "sides", label: "Garden" },
  { id: "drinks", label: "Coffee & chiya" },
  { id: "sweets", label: "Something sweet" },
];

/** Limited mindful menu — coffee, light plates, a little sweet. */
export const seedMenuItems: MenuItem[] = [
  {
    id: "filter-coffee",
    name: "Garden Filter Coffee",
    description: "Single-origin Nepali beans, pour-over, lightly floral.",
    price: 180,
    cost: 55,
    category: "drinks",
    popular: true,
    stockSkuId: "sku-coffee",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "chiya",
    name: "Masala Chiya",
    description: "Cardamom, ginger, black tea — clay cup, unhurried.",
    price: 35,
    cost: 12,
    category: "drinks",
    popular: true,
    stockSkuId: "sku-tea",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "lemonade",
    name: "Mint Lemonade",
    description: "Fresh lemon, patio mint, a touch of Himalayan salt.",
    price: 160,
    cost: 35,
    category: "drinks",
    stockSkuId: "sku-lemon",
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "salad",
    name: "Terrace Green Salad",
    description: "Mixed leaves from the planters, cucumber, lime-honey dressing.",
    price: 280,
    cost: 90,
    category: "sides",
    popular: true,
    stockSkuId: "sku-greens",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "dal-bhat",
    name: "Garden Dal Bhat",
    description: "Slow lentils, steamed rice, seasonal tarkari, pickle — one thoughtful plate.",
    price: 450,
    cost: 160,
    category: "mains",
    popular: true,
    stockSkuId: "sku-dal",
    image:
      "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "momos",
    name: "Steam Momos (6)",
    description: "Veg or chicken, sesame achar — a small share for the table.",
    price: 280,
    cost: 95,
    category: "mains",
    stockSkuId: "sku-momo",
    image:
      "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "brownie",
    name: "Walnut Brownie",
    description: "Warm square with cocoa dust — for slow afternoons.",
    price: 240,
    cost: 70,
    category: "sweets",
    stockSkuId: "sku-cocoa",
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80",
  },
];

/** Demo role entry — pick a role; no passwords shipped. */
export const roleProfiles: RoleProfile[] = [
  {
    role: "owner",
    staffId: "st-owner",
    displayName: "Anupam Bajracharya",
    hint: "Dash, bills, stock, reports",
  },
  {
    role: "staff",
    staffId: "st-sita",
    displayName: "Sita Gurung",
    hint: "Orders, shift, bills",
  },
  {
    role: "kitchen",
    staffId: "st-chef",
    displayName: "Bikash Lama",
    hint: "Live board & stock alerts",
  },
  {
    role: "cashier",
    staffId: "st-cash",
    displayName: "Maya Tamang",
    hint: "Auto bills · settle tables",
  },
];

export const SESSION_COOKIE = "garden-ops-role";

export function isAuthRole(value: string): value is AuthRole {
  return (
    value === "owner" ||
    value === "staff" ||
    value === "kitchen" ||
    value === "cashier"
  );
}

export const OPS_TODAY = "2026-11-28";

/** @deprecated use seedMenuItems via OpsProvider */
export const menuItems = seedMenuItems;

export const seedTables: TableSeat[] = [
  { id: "t1", label: "T1 · Patio", seats: 2, status: "open" },
  { id: "t2", label: "T2 · Patio", seats: 4, status: "seated", orderId: "ord-1042" },
  { id: "t3", label: "T3 · Window", seats: 2, status: "ordered", orderId: "ord-1041" },
  { id: "t4", label: "T4 · Window", seats: 4, status: "open" },
  { id: "t5", label: "T5 · Garden", seats: 4, status: "open" },
  { id: "t6", label: "T6 · Garden", seats: 4, status: "seated", orderId: "ord-1040" },
];

export const demoTables = seedTables;

export const seedOrders: DemoOrder[] = [
  {
    id: "ord-1042",
    table: "T2",
    guest: "Anisha R.",
    items: ["Garden Filter Coffee ×1", "Terrace Green Salad ×1"],
    lines: [
      { menuItemId: "filter-coffee", name: "Garden Filter Coffee", qty: 1 },
      { menuItemId: "salad", name: "Terrace Green Salad", qty: 1 },
    ],
    total: 460,
    status: "preparing",
    placedAt: "14:38",
    type: "dine-in",
  },
  {
    id: "ord-1041",
    table: "T3",
    guest: "Pratik S.",
    items: ["Garden Dal Bhat ×1", "Masala Chiya ×1"],
    lines: [
      { menuItemId: "dal-bhat", name: "Garden Dal Bhat", qty: 1 },
      { menuItemId: "chiya", name: "Masala Chiya", qty: 1 },
    ],
    total: 485,
    status: "ready",
    placedAt: "14:21",
    type: "dine-in",
  },
  {
    id: "ord-1040",
    table: "T6",
    guest: "Laptop guest",
    items: ["Garden Filter Coffee ×2", "Walnut Brownie ×1"],
    lines: [
      { menuItemId: "filter-coffee", name: "Garden Filter Coffee", qty: 2 },
      { menuItemId: "brownie", name: "Walnut Brownie", qty: 1 },
    ],
    total: 600,
    status: "served",
    placedAt: "13:55",
    type: "dine-in",
    payMethod: "upi",
  },
  {
    id: "ord-1039",
    table: "T4",
    guest: "Walk-in",
    items: ["Mint Lemonade ×1", "Steam Momos (6) ×1"],
    lines: [
      { menuItemId: "lemonade", name: "Mint Lemonade", qty: 1 },
      { menuItemId: "momos", name: "Steam Momos (6)", qty: 1 },
    ],
    total: 440,
    status: "paid",
    placedAt: "13:40",
    type: "dine-in",
    payMethod: "cash",
  },
  {
    id: "ord-1038",
    table: "T1",
    guest: "Morning regular",
    items: ["Garden Filter Coffee ×1", "Masala Chiya ×2", "Garden Dal Bhat ×1"],
    lines: [
      { menuItemId: "filter-coffee", name: "Garden Filter Coffee", qty: 1 },
      { menuItemId: "chiya", name: "Masala Chiya", qty: 2 },
      { menuItemId: "dal-bhat", name: "Garden Dal Bhat", qty: 1 },
    ],
    total: 700,
    status: "paid",
    placedAt: "10:15",
    type: "dine-in",
    payMethod: "cash",
  },
];

export const demoOrders = seedOrders;

export const seedKitchenTickets: KitchenTicket[] = [
  {
    id: "kt-2200",
    orderId: "ord-1042",
    table: "T2",
    type: "dine-in",
    guest: "Anisha R.",
    waiter: "Ram",
    lines: [
      { menuItemId: "filter-coffee", name: "Garden Filter Coffee", qty: 1 },
      { menuItemId: "salad", name: "Terrace Green Salad", qty: 1 },
    ],
    status: "preparing",
    placedAt: "14:38",
    total: 460,
  },
  {
    id: "kt-2199",
    orderId: "ord-1041",
    table: "T3",
    type: "dine-in",
    guest: "Pratik S.",
    waiter: "Sita",
    lines: [
      { menuItemId: "dal-bhat", name: "Garden Dal Bhat", qty: 1 },
      { menuItemId: "chiya", name: "Masala Chiya", qty: 1 },
    ],
    status: "ready",
    placedAt: "14:21",
    total: 485,
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
  { id: "exp-salary", name: "Salary", nameNp: "तलब" },
  { id: "exp-vendor", name: "Vendor bills", nameNp: "बिक्रेता" },
  { id: "exp-misc", name: "Misc / packaging", nameNp: "अन्य" },
];

/** Major expense category ids — admin-only create/edit focus. */
export const majorExpenseCategoryIds = [
  "exp-rent",
  "exp-gas",
  "exp-vendor",
  "exp-salary",
] as const;

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
    date: "2026-11-28",
    paid: true,
  },
  {
    id: "ex-2",
    categoryId: "exp-dairy",
    label: "Yogurt & milk",
    amount: 1200,
    vendorId: "ven-dairy",
    date: "2026-11-28",
    paid: false,
  },
  {
    id: "ex-3",
    categoryId: "exp-gas",
    label: "LPG cylinder",
    amount: 1900,
    vendorId: "ven-gas",
    date: "2026-11-27",
    paid: true,
  },
  {
    id: "ex-4",
    categoryId: "exp-meat",
    label: "Chicken for momos",
    amount: 3200,
    vendorId: "ven-meat",
    date: "2026-11-27",
    paid: false,
  },
  {
    id: "ex-5",
    categoryId: "exp-misc",
    label: "Planter soil & pots",
    amount: 650,
    date: "2026-11-26",
    paid: true,
  },
  {
    id: "ex-6",
    categoryId: "exp-rent",
    label: "November shop rent · Kathmandu",
    amount: 85000,
    date: "2026-11-01",
    paid: false,
  },
  {
    id: "ex-7",
    categoryId: "exp-salary",
    label: "November salaries (partial)",
    amount: 155000,
    date: "2026-11-25",
    paid: false,
  },
  {
    id: "ex-8",
    categoryId: "exp-vendor",
    label: "Kalimati weekly settlement",
    amount: 4200,
    vendorId: "ven-kalimati",
    date: "2026-11-27",
    paid: false,
  },
];

export const seedAttendance: AttendanceRecord[] = [
  {
    id: "att-1",
    staffId: "st-sita",
    date: OPS_TODAY,
    clockIn: "06:58",
    scheduledStart: "07:00",
    status: "working",
  },
  {
    id: "att-2",
    staffId: "st-ram",
    date: OPS_TODAY,
    scheduledStart: "15:00",
    status: "absent",
  },
  {
    id: "att-3",
    staffId: "st-chef",
    date: OPS_TODAY,
    clockIn: "09:12",
    scheduledStart: "09:00",
    status: "working",
  },
  {
    id: "att-4",
    staffId: "st-cash",
    date: OPS_TODAY,
    scheduledStart: "08:00",
    status: "absent",
  },
  {
    id: "att-5",
    staffId: "st-help",
    date: OPS_TODAY,
    clockIn: "08:05",
    scheduledStart: "08:00",
    status: "working",
  },
  {
    id: "att-6",
    staffId: "st-owner",
    date: OPS_TODAY,
    clockIn: "08:30",
    scheduledStart: "08:00",
    status: "working",
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

export const seedMonthly: MonthlyPoint[] = [
  { month: "Jun", sales: 385000, kharcha: 210000, profit: 175000 },
  { month: "Jul", sales: 402000, kharcha: 225000, profit: 177000 },
  { month: "Aug", sales: 418000, kharcha: 232000, profit: 186000 },
  { month: "Sep", sales: 395000, kharcha: 240000, profit: 155000 },
  { month: "Oct", sales: 455000, kharcha: 248000, profit: 207000 },
  { month: "Nov", sales: 312000, kharcha: 168000, profit: 144000 },
];

/** Last 7 days demo series for owner dash charts (Asia/Kathmandu labels). */
export type DaySeriesPoint = {
  label: string;
  date: string;
  sales: number;
  expenses: number;
};

export const seedWeekSeries: DaySeriesPoint[] = [
  { label: "Sun", date: "2026-11-22", sales: 18500, expenses: 9200 },
  { label: "Mon", date: "2026-11-23", sales: 21200, expenses: 11800 },
  { label: "Tue", date: "2026-11-24", sales: 19800, expenses: 10500 },
  { label: "Wed", date: "2026-11-25", sales: 24100, expenses: 13200 },
  { label: "Thu", date: "2026-11-26", sales: 22600, expenses: 14100 },
  { label: "Fri", date: "2026-11-27", sales: 26800, expenses: 15200 },
  { label: "Sat", date: "2026-11-28", sales: 2068, expenses: 3600 },
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
  /**
   * Hour (0–23) in Asia/Kathmandu when the day auto-closes.
   * 0 = midnight (end of calendar day). Optional for older saved state.
   */
  dayClosingHour?: number;
};

/** Pack → yield for recipe costing (e.g. milk NPR 100 → 10 cups). */
export type IngredientPack = {
  id: string;
  name: string;
  packCost: number;
  packLabel: string;
  yieldQty: number;
  yieldLabel: string;
  /** When set, deleting that menu item removes this pack. */
  ownedByMenuItemId?: string;
};

export type DishIngredientUse = {
  packId: string;
  /** Yield units used per dish (e.g. 1 cup of milk). */
  unitsPerDish: number;
};

export type DishCostRecipe = {
  menuItemId: string;
  ingredients: DishIngredientUse[];
  note?: string;
};

export type OverheadLine = {
  id: string;
  label: string;
  monthlyAmount: number;
  kind: "rent" | "salary" | "gas" | "electricity" | "water" | "other";
  /** Salary lines: headcount × pay → monthlyAmount. */
  staffCount?: number;
  payPerStaff?: number;
};

/** Owner Cost / Targets — monthly goal + volume for overhead share. */
export type CostTargetsConfig = {
  monthlySalesTarget: number;
  /** Assumed dishes/month to spread overhead into cost/unit. */
  monthlyUnitVolume: number;
  monthLabel: string;
  /** MTD sales before today's live tickets (demo baseline). */
  mtdSalesSeed: number;
  /** Editable shop label (shown on rent / cost header). */
  shopName: string;
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
  attendance: AttendanceRecord[];
  dayClose: DayClose;
  dayHistory: DayRecord[];
  monthly: MonthlyPoint[];
  ingredientPacks: IngredientPack[];
  dishCostRecipes: DishCostRecipe[];
  monthlyOverheads: OverheadLine[];
  costTargets: CostTargetsConfig;
  role: Role;
  waiterName: string;
  settings: OpsSettings;
  session: AuthSession | null;
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

const defaultSettings: OpsSettings = {
  vatEnabled: true,
  vatPercent: 13,
  dayClosingHour: 0,
};

/** Demo past closed days (Nepal time). */
export const seedDayHistory: DayRecord[] = [
  {
    date: "2026-11-27",
    closedAt: "22:01",
    sales: 26800,
    expenses: 15200,
    profit: 11600,
    cash: 14200,
    card: 4600,
    upi: 8000,
    openBills: 0,
    auto: true,
  },
  {
    date: "2026-11-26",
    closedAt: "22:00",
    sales: 22600,
    expenses: 14100,
    profit: 8500,
    cash: 11800,
    card: 3200,
    upi: 7600,
    openBills: 1,
    auto: true,
  },
  {
    date: "2026-11-25",
    closedAt: "21:58",
    sales: 24100,
    expenses: 13200,
    profit: 10900,
    cash: 15100,
    card: 2800,
    upi: 6200,
    openBills: 0,
  },
];

/** Asia/Kathmandu calendar date YYYY-MM-DD. */
export function kathmanduDate(d = new Date()): string {
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kathmandu" });
}

/** Asia/Kathmandu hour 0–23. */
export function kathmanduHour(d = new Date()): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kathmandu",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);
  return Number(parts.find((p) => p.type === "hour")?.value ?? "0");
}

export function kathmanduTime(d = new Date()): string {
  return d.toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kathmandu",
  });
}

export function buildDayRecord(
  state: Pick<
    OpsState,
    "orders" | "menuItems" | "settings" | "expenses" | "dayClose"
  >,
  opts?: { auto?: boolean; closedAt?: string },
): DayRecord {
  const split = paySplit(state.orders, state.menuItems, state.settings);
  const sales = todaySale(state.orders, state.menuItems, state.settings);
  const expenses = todayKharcha(state.expenses, state.dayClose.date);
  const openBills = state.orders.filter(
    (o) => o.status !== "paid" && o.status !== "cancelled",
  ).length;
  return {
    date: state.dayClose.date,
    closedAt: opts?.closedAt ?? kathmanduTime(),
    sales: +sales.toFixed(2),
    expenses: +expenses.toFixed(2),
    profit: +(sales - expenses).toFixed(2),
    cash: +split.cash.toFixed(2),
    card: +split.card.toFixed(2),
    upi: +split.upi.toFixed(2),
    openBills,
    auto: opts?.auto,
  };
}

export function upsertDayHistory(
  history: DayRecord[],
  record: DayRecord,
): DayRecord[] {
  const rest = history.filter((h) => h.date !== record.date);
  return [record, ...rest].sort((a, b) => b.date.localeCompare(a.date));
}

export function freshDayClose(date: string): DayClose {
  return {
    date,
    cash: 0,
    card: 0,
    upi: 0,
    expenses: 0,
    closed: false,
  };
}

/** Tea example: milk NPR 100/packet → ~10 cups. */
export const seedIngredientPacks: IngredientPack[] = [
  {
    id: "pack-milk",
    name: "Milk",
    packCost: 100,
    packLabel: "packet",
    yieldQty: 10,
    yieldLabel: "cup",
  },
  {
    id: "pack-tea",
    name: "Chiya leaves",
    packCost: 450,
    packLabel: "kg",
    yieldQty: 180,
    yieldLabel: "cup",
  },
  {
    id: "pack-coffee",
    name: "Nepali beans",
    packCost: 1800,
    packLabel: "kg",
    yieldQty: 60,
    yieldLabel: "cup",
  },
  {
    id: "pack-dal",
    name: "Masoor dal",
    packCost: 220,
    packLabel: "kg",
    yieldQty: 12,
    yieldLabel: "plate",
  },
  {
    id: "pack-rice",
    name: "Rice",
    packCost: 160,
    packLabel: "kg",
    yieldQty: 14,
    yieldLabel: "plate",
  },
  {
    id: "pack-greens",
    name: "Garden greens",
    packCost: 80,
    packLabel: "bunch",
    yieldQty: 8,
    yieldLabel: "plate",
  },
  {
    id: "pack-momo",
    name: "Momo wrappers + fill",
    packCost: 240,
    packLabel: "pack",
    yieldQty: 4,
    yieldLabel: "plate",
  },
  {
    id: "pack-cocoa",
    name: "Brownie batch",
    packCost: 600,
    packLabel: "batch",
    yieldQty: 12,
    yieldLabel: "slice",
  },
  {
    id: "pack-lemon",
    name: "Lemon + mint",
    packCost: 120,
    packLabel: "kg",
    yieldQty: 20,
    yieldLabel: "glass",
  },
];

export const seedDishCostRecipes: DishCostRecipe[] = [
  {
    menuItemId: "chiya",
    note: "Milk NPR 100/packet ≈ 10 cups · cup sells ~NPR 35",
    ingredients: [
      { packId: "pack-milk", unitsPerDish: 1 },
      { packId: "pack-tea", unitsPerDish: 1 },
    ],
  },
  {
    menuItemId: "filter-coffee",
    note: "Beans pack → cups; true cost includes overhead share",
    ingredients: [{ packId: "pack-coffee", unitsPerDish: 1 }],
  },
  {
    menuItemId: "dal-bhat",
    ingredients: [
      { packId: "pack-dal", unitsPerDish: 1 },
      { packId: "pack-rice", unitsPerDish: 1 },
      { packId: "pack-greens", unitsPerDish: 0.5 },
    ],
  },
  {
    menuItemId: "momos",
    ingredients: [{ packId: "pack-momo", unitsPerDish: 1 }],
  },
  {
    menuItemId: "salad",
    ingredients: [{ packId: "pack-greens", unitsPerDish: 1 }],
  },
  {
    menuItemId: "brownie",
    ingredients: [{ packId: "pack-cocoa", unitsPerDish: 1 }],
  },
  {
    menuItemId: "lemonade",
    ingredients: [{ packId: "pack-lemon", unitsPerDish: 1 }],
  },
];

/** Major monthly overhead — rent, salary, utilities. */
export const seedMonthlyOverheads: OverheadLine[] = [
  {
    id: "oh-rent",
    label: "Shop rent",
    monthlyAmount: 85000,
    kind: "rent",
  },
  {
    id: "oh-salary",
    label: "Salaries",
    monthlyAmount: 155000,
    kind: "salary",
    staffCount: 5,
    payPerStaff: 31000,
  },
  { id: "oh-gas", label: "Gas (LPG)", monthlyAmount: 12000, kind: "gas" },
  { id: "oh-elec", label: "Electricity", monthlyAmount: 18000, kind: "electricity" },
  { id: "oh-water", label: "Water", monthlyAmount: 3500, kind: "water" },
  { id: "oh-other", label: "Misc / packaging", monthlyAmount: 8000, kind: "other" },
];

export const seedCostTargets: CostTargetsConfig = {
  monthlySalesTarget: 450000,
  monthlyUnitVolume: 9000,
  monthLabel: "Nov 2026",
  mtdSalesSeed: 312000,
  shopName: "Garden Restaurant · Kathmandu",
};

export function overheadLineAmount(line: OverheadLine): number {
  if (
    line.kind === "salary" &&
    line.staffCount != null &&
    line.payPerStaff != null
  ) {
    return line.staffCount * line.payPerStaff;
  }
  return line.monthlyAmount;
}

/** Default pack + recipe when Owner adds a food item. */
export function createCostingForNewDish(item: MenuItem): {
  pack: IngredientPack;
  recipe: DishCostRecipe;
} {
  const packId = `pack-${item.id}-main`;
  const packCost = item.cost ?? Math.max(10, Math.round(item.price * 0.35));
  return {
    pack: {
      id: packId,
      name: `${item.name} pack`,
      packCost,
      packLabel: "pack",
      yieldQty: 10,
      yieldLabel: "portion",
      ownedByMenuItemId: item.id,
    },
    recipe: {
      menuItemId: item.id,
      ingredients: [{ packId, unitsPerDish: 1 }],
      note: "Edit pack cost & yield for market prices",
    },
  };
}

export function createSeedState(): OpsState {
  const menuItems = withSeedRecipes(structuredClone(seedMenuItems));
  return {
    menuItems,
    tables: structuredClone(seedTables),
    orders: structuredClone(seedOrders),
    kitchenTickets: structuredClone(seedKitchenTickets),
    stock: structuredClone(seedStock),
    expenseCategories: structuredClone(seedExpenseCategories),
    expenses: structuredClone(seedExpenses),
    vendors: structuredClone(seedVendors),
    staff: structuredClone(seedStaff),
    attendance: structuredClone(seedAttendance),
    dayClose: buildSeedDayClose(),
    dayHistory: structuredClone(seedDayHistory),
    monthly: structuredClone(seedMonthly),
    ingredientPacks: structuredClone(seedIngredientPacks),
    dishCostRecipes: structuredClone(seedDishCostRecipes),
    monthlyOverheads: structuredClone(seedMonthlyOverheads),
    costTargets: { ...seedCostTargets },
    role: "owner",
    waiterName: "Sita Gurung",
    settings: { ...defaultSettings },
    session: null,
  };
}

export function authRoleToOpsRole(role: AuthRole): Role {
  if (role === "staff") return "waiter";
  if (role === "kitchen") return "kitchen";
  if (role === "cashier") return "cashier";
  return "owner";
}

export function sessionForRole(role: AuthRole): AuthSession | null {
  const hit = roleProfiles.find((d) => d.role === role);
  if (!hit) return null;
  return {
    role: hit.role,
    staffId: hit.staffId,
    displayName: hit.displayName,
  };
}

export function canAccessPath(role: AuthRole, pathname: string): boolean {
  if (role === "owner") return true;
  if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard")) {
    return false;
  }
  if (pathname.startsWith("/cashier")) {
    return role === "cashier" || role === "staff";
  }
  if (
    pathname.startsWith("/employee") ||
    pathname.startsWith("/order") ||
    pathname.startsWith("/staff") ||
    pathname.startsWith("/menu") ||
    pathname.startsWith("/demo") ||
    pathname.startsWith("/table")
  ) {
    return role === "staff" || role === "cashier";
  }
  if (pathname.startsWith("/kitchen")) {
    return role === "kitchen";
  }
  return true;
}

export function minutesBetween(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

export function attendanceLabel(status: AttendanceStatus): string {
  if (status === "on-time") return "On time";
  if (status === "late") return "Late";
  if (status === "working") return "On shift";
  return "Not in";
}

export type TopSeller = {
  menuItemId: string;
  name: string;
  qty: number;
  revenue: number;
};

export type ExpenseHotspot = {
  categoryId: string;
  name: string;
  amount: number;
};

export type ProductProfit = {
  menuItemId: string;
  name: string;
  qty: number;
  revenue: number;
  cost: number;
  profit: number;
  marginPct: number;
};

export function topSellers(
  orders: DemoOrder[],
  menu: MenuItem[],
  limit = 5,
): TopSeller[] {
  const map = new Map<string, TopSeller>();
  for (const order of orders) {
    if (order.status === "cancelled") continue;
    const lines = activeLines(order);
    if (!lines.length) continue;
    for (const line of lines) {
      const item = menu.find((m) => m.id === line.menuItemId);
      const cur = map.get(line.menuItemId) ?? {
        menuItemId: line.menuItemId,
        name: line.name,
        qty: 0,
        revenue: 0,
      };
      cur.qty += line.qty;
      cur.revenue += (item?.price ?? 0) * line.qty;
      map.set(line.menuItemId, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, limit);
}

export function expenseHotspots(
  expenses: Expense[],
  categories: ExpenseCategory[],
  limit = 5,
): ExpenseHotspot[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    map.set(e.categoryId, (map.get(e.categoryId) ?? 0) + e.amount);
  }
  return [...map.entries()]
    .map(([categoryId, amount]) => ({
      categoryId,
      name: categories.find((c) => c.id === categoryId)?.name ?? categoryId,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, limit);
}

export function profitByProduct(
  orders: DemoOrder[],
  menu: MenuItem[],
  limit = 5,
): ProductProfit[] {
  const map = new Map<string, ProductProfit>();
  for (const order of orders) {
    if (order.status !== "paid" && order.status !== "served") continue;
    for (const line of activeLines(order)) {
      const item = menu.find((m) => m.id === line.menuItemId);
      const price = item?.price ?? 0;
      const unitCost = item?.cost ?? Math.round(price * 0.35);
      const cur = map.get(line.menuItemId) ?? {
        menuItemId: line.menuItemId,
        name: line.name,
        qty: 0,
        revenue: 0,
        cost: 0,
        profit: 0,
        marginPct: 0,
      };
      cur.qty += line.qty;
      cur.revenue += price * line.qty;
      cur.cost += unitCost * line.qty;
      cur.profit = cur.revenue - cur.cost;
      cur.marginPct = cur.revenue
        ? +((cur.profit / cur.revenue) * 100).toFixed(1)
        : 0;
      map.set(line.menuItemId, cur);
    }
  }
  return [...map.values()].sort((a, b) => b.profit - a.profit).slice(0, limit);
}

export function stockAlertLevel(
  row: StockItem,
): "ok" | "low" | "critical" {
  if (row.qty <= 0) return "critical";
  if (row.qty <= row.lowAt * 0.5) return "critical";
  if (row.qty <= row.lowAt) return "low";
  return "ok";
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
  return orderBillBreakdown(order, menu, settings).total;
}

export type BillBreakdown = {
  lines: { name: string; qty: number; unitPrice: number; lineTotal: number }[];
  subtotal: number;
  discountPct: number;
  discountAmount: number;
  vatPercent: number;
  vatAmount: number;
  tip: number;
  total: number;
};

export function packUnitCost(pack: IngredientPack): number {
  if (pack.yieldQty <= 0) return 0;
  return +(pack.packCost / pack.yieldQty).toFixed(2);
}

export function overheadSummary(
  overheads: OverheadLine[],
  monthlyUnitVolume: number,
) {
  const monthly = overheads.reduce((s, o) => s + overheadLineAmount(o), 0);
  const daily = +(monthly / 30).toFixed(2);
  const perUnit =
    monthlyUnitVolume > 0 ? +(monthly / monthlyUnitVolume).toFixed(2) : 0;
  return { monthly, daily, perUnit };
}

export type DishCostRow = {
  menuItemId: string;
  name: string;
  sellPrice: number;
  ingredientCost: number;
  overheadShare: number;
  trueCost: number;
  profitPerUnit: number;
  contributionMarginPct: number;
  breakEvenUnits: number;
  cashIfSold: (qty: number) => number;
  profitIfSold: (qty: number) => number;
  lines: {
    packId: string;
    packName: string;
    packCost: number;
    packLabel: string;
    yieldQty: number;
    yieldLabel: string;
    unitsPerDish: number;
    cost: number;
  }[];
  note?: string;
};

export function buildDishCostRows(
  menu: MenuItem[],
  packs: IngredientPack[],
  recipes: DishCostRecipe[],
  overheadPerUnit: number,
  monthlyOverhead: number,
): DishCostRow[] {
  const packMap = new Map(packs.map((p) => [p.id, p]));
  const recipeMap = new Map(recipes.map((r) => [r.menuItemId, r]));
  const rows: DishCostRow[] = [];
  for (const item of menu) {
    const recipe = recipeMap.get(item.id) ?? {
      menuItemId: item.id,
      ingredients: [] as DishIngredientUse[],
    };
    const lines: DishCostRow["lines"] = [];
    for (const use of recipe.ingredients) {
      const pack = packMap.get(use.packId);
      if (!pack) continue;
      const unit = packUnitCost(pack);
      lines.push({
        packId: pack.id,
        packName: pack.name,
        packCost: pack.packCost,
        packLabel: pack.packLabel,
        yieldQty: pack.yieldQty,
        yieldLabel: pack.yieldLabel,
        unitsPerDish: use.unitsPerDish,
        cost: +(unit * use.unitsPerDish).toFixed(2),
      });
    }
    const ingredientCost = +lines.reduce((s, l) => s + l.cost, 0).toFixed(2);
    const trueCost = +(ingredientCost + overheadPerUnit).toFixed(2);
    const profitPerUnit = +(item.price - trueCost).toFixed(2);
    const contribution =
      item.price > 0
        ? +(((item.price - ingredientCost) / item.price) * 100).toFixed(1)
        : 0;
    rows.push({
      menuItemId: item.id,
      name: item.name,
      sellPrice: item.price,
      ingredientCost,
      overheadShare: overheadPerUnit,
      trueCost,
      profitPerUnit,
      contributionMarginPct: contribution,
      breakEvenUnits: breakEvenForOverhead(
        item.price,
        ingredientCost,
        monthlyOverhead,
      ),
      cashIfSold: (qty: number) => +(item.price * qty).toFixed(2),
      profitIfSold: (qty: number) => +(profitPerUnit * qty).toFixed(2),
      lines,
      note: recipe.note,
    });
  }
  return rows.sort((a, b) => a.name.localeCompare(b.name));
}

/** Units of one dish needed to cover full monthly overhead (contribution margin). */
export function breakEvenForOverhead(
  sellPrice: number,
  ingredientCost: number,
  monthlyOverhead: number,
): number {
  const margin = sellPrice - ingredientCost;
  if (margin <= 0) return 0;
  return Math.ceil(monthlyOverhead / margin);
}

export function monthlyTargetProgress(
  config: CostTargetsConfig,
  todaySales: number,
) {
  const actual = +(config.mtdSalesSeed + todaySales).toFixed(2);
  const target = config.monthlySalesTarget;
  const remaining = Math.max(0, +(target - actual).toFixed(2));
  const pct =
    target > 0 ? Math.min(100, +((actual / target) * 100).toFixed(1)) : 0;
  return { actual, target, remaining, pct, monthLabel: config.monthLabel };
}

/** Full bill math for cashier — no hand totaling. */
export function orderBillBreakdown(
  order: DemoOrder,
  menu: MenuItem[],
  settings: OpsSettings,
): BillBreakdown {
  if (order.status === "cancelled") {
    return {
      lines: [],
      subtotal: 0,
      discountPct: 0,
      discountAmount: 0,
      vatPercent: settings.vatPercent,
      vatAmount: 0,
      tip: 0,
      total: 0,
    };
  }
  const lines = activeLines(order).map((l) => {
    const unitPrice = menu.find((m) => m.id === l.menuItemId)?.price ?? 0;
    return {
      name: l.name,
      qty: l.qty,
      unitPrice,
      lineTotal: +(unitPrice * l.qty).toFixed(2),
    };
  });
  const subtotal = lines.length
    ? lines.reduce((s, l) => s + l.lineTotal, 0)
    : order.total;
  const discountPct = order.discountPct ?? 0;
  const discountAmount = +((subtotal * discountPct) / 100).toFixed(2);
  const afterDiscount = subtotal - discountAmount;
  const vatPercent = settings.vatEnabled ? settings.vatPercent : 0;
  const vatAmount = settings.vatEnabled
    ? +((afterDiscount * settings.vatPercent) / 100).toFixed(2)
    : 0;
  const tip = order.tip ?? 0;
  return {
    lines,
    subtotal: +subtotal.toFixed(2),
    discountPct,
    discountAmount,
    vatPercent,
    vatAmount,
    tip,
    total: +(afterDiscount + vatAmount + tip).toFixed(2),
  };
}

export function kitchenStatusLabel(status: DemoOrder["status"]): string {
  if (status === "new") return "Sent to kitchen";
  if (status === "preparing") return "Cooking";
  if (status === "ready") return "Ready to serve";
  if (status === "served") return "Served — ready to bill";
  if (status === "paid") return "Paid";
  if (status === "cancelled") return "Void";
  return status;
}

function stockUsageForLines(
  menu: MenuItem[],
  lines: { menuItemId: string; qty: number; voided?: boolean }[],
): Map<string, number> {
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
  return usage;
}

export function deductStockForLines(
  stock: StockItem[],
  menu: MenuItem[],
  lines: { menuItemId: string; qty: number; voided?: boolean }[],
): StockItem[] {
  const usage = stockUsageForLines(menu, lines);
  return stock.map((row) => {
    const used = usage.get(row.id);
    if (!used) return row;
    return { ...row, qty: Math.max(0, +(row.qty - used).toFixed(2)) };
  });
}

/** Put ingredients back after a void (inverse of deduct). */
export function restoreStockForLines(
  stock: StockItem[],
  menu: MenuItem[],
  lines: { menuItemId: string; qty: number; voided?: boolean }[],
): StockItem[] {
  const usage = stockUsageForLines(menu, lines);
  return stock.map((row) => {
    const used = usage.get(row.id);
    if (!used) return row;
    return { ...row, qty: +(row.qty + used).toFixed(2) };
  });
}

export function todaySale(orders: DemoOrder[], menu: MenuItem[] = seedMenuItems, settings: OpsSettings = { vatEnabled: false, vatPercent: 13 }) {
  return orders
    .filter((o) => o.status === "paid" || o.status === "served")
    .reduce((s, o) => s + orderPayableTotal(o, menu, settings), 0);
}

export function todayKharcha(expenses: Expense[], date = OPS_TODAY) {
  return expenses
    .filter((e) => e.date === date)
    .reduce((s, e) => s + e.amount, 0);
}

export function profitMarginPct(sale: number, kharcha: number): number {
  if (!sale) return 0;
  return +(((sale - kharcha) / sale) * 100).toFixed(1);
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

function buildSeedDayClose(): DayClose {
  const menu = withSeedRecipes(structuredClone(seedMenuItems));
  const split = paySplit(seedOrders, menu, defaultSettings);
  return {
    date: OPS_TODAY,
    cash: +split.cash.toFixed(2),
    card: +split.card.toFixed(2),
    upi: +split.upi.toFixed(2),
    expenses: todayKharcha(seedExpenses, OPS_TODAY),
    closed: false,
  };
}

/** Matches VAT-aware paySplit of seed paid/served orders. */
export const seedDayClose: DayClose = buildSeedDayClose();
