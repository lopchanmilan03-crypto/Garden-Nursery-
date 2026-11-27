"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createSeedState,
  deductStockForLines,
  orderPayableTotal,
  orderSubtotal,
  paySplit,
  todayKharcha,
  todaySale,
  withSeedRecipes,
  type BillSplit,
  type DemoOrder,
  type Expense,
  type ExpenseCategory,
  type KitchenTicket,
  type MenuItem,
  type OpsSettings,
  type OpsState,
  type PayMethod,
  type RecipeLine,
  type Role,
  type StaffMember,
  type StockItem,
  type Vendor,
} from "@/lib/demo-data";

const STORAGE_KEY = "garden-restaurant-ops-v3";

type PlaceOrderInput = {
  table: string | null;
  type: "dine-in" | "takeaway";
  guest: string;
  lines: { menuItemId: string; name: string; qty: number }[];
  notes?: string;
  total: number;
  source?: "waiter" | "guest";
  waiter?: string;
};

type OpsContextValue = {
  state: OpsState;
  ready: boolean;
  setRole: (role: Role) => void;
  setWaiterName: (name: string) => void;
  updateSettings: (patch: Partial<OpsSettings>) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  updateRecipe: (menuItemId: string, recipe: RecipeLine[]) => void;
  addMenuItem: (item: MenuItem) => void;
  updateStock: (id: string, patch: Partial<StockItem>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  addStaff: (member: StaffMember) => void;
  updateExpenseCategory: (id: string, patch: Partial<ExpenseCategory>) => void;
  addExpenseCategory: (cat: ExpenseCategory) => void;
  addExpense: (expense: Expense) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  addVendor: (vendor: Vendor) => void;
  placeWaiterOrder: (input: PlaceOrderInput) => string;
  placeGuestOrder: (input: PlaceOrderInput) => string;
  bumpKitchenTicket: (id: string, status: KitchenTicket["status"]) => void;
  settleBill: (orderId: string, method: PayMethod, tip?: number) => void;
  applyDiscount: (orderId: string, discountPct: number) => void;
  voidOrder: (orderId: string, reason: string) => void;
  voidLine: (orderId: string, lineIndex: number, reason: string) => void;
  splitBill: (
    orderId: string,
    mode: "seats" | "amount",
    parts: { label: string; amount?: number; seats?: number }[],
  ) => void;
  paySplitPart: (orderId: string, splitId: string, method: PayMethod) => void;
  closeDay: () => void;
  reopenDay: () => void;
  resetDemo: () => void;
  payableTotal: (order: DemoOrder) => number;
  metrics: {
    sale: number;
    kharcha: number;
    profit: number;
    split: { cash: number; card: number; upi: number };
    lowStock: StockItem[];
    vendorDues: number;
    takeawayOpen: number;
  };
};

const OpsContext = createContext<OpsContextValue | null>(null);

function nowTime() {
  const d = new Date();
  return d.toLocaleTimeString("en-NP", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kathmandu",
  });
}

function mergeState(parsed: Partial<OpsState>): OpsState {
  const seed = createSeedState();
  const menuItems = withSeedRecipes(
    parsed.menuItems?.length ? parsed.menuItems : seed.menuItems,
  );
  return {
    ...seed,
    ...parsed,
    menuItems,
    settings: { ...seed.settings, ...(parsed.settings ?? {}) },
  };
}

export function OpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpsState>(() => createSeedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(mergeState(JSON.parse(raw) as Partial<OpsState>));
    } catch {
      /* keep seed */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        setState(mergeState(JSON.parse(e.newValue) as Partial<OpsState>));
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const patch = useCallback((fn: (prev: OpsState) => OpsState) => {
    setState(fn);
  }, []);

  const setRole = useCallback(
    (role: Role) => patch((s) => ({ ...s, role })),
    [patch],
  );
  const setWaiterName = useCallback(
    (waiterName: string) => patch((s) => ({ ...s, waiterName })),
    [patch],
  );
  const updateSettings = useCallback(
    (settingsPatch: Partial<OpsSettings>) =>
      patch((s) => ({
        ...s,
        settings: { ...s.settings, ...settingsPatch },
      })),
    [patch],
  );

  const updateMenuItem = useCallback(
    (id: string, menuPatch: Partial<MenuItem>) =>
      patch((s) => ({
        ...s,
        menuItems: s.menuItems.map((m) =>
          m.id === id ? { ...m, ...menuPatch } : m,
        ),
      })),
    [patch],
  );

  const updateRecipe = useCallback(
    (menuItemId: string, recipe: RecipeLine[]) =>
      patch((s) => ({
        ...s,
        menuItems: s.menuItems.map((m) =>
          m.id === menuItemId ? { ...m, recipe } : m,
        ),
      })),
    [patch],
  );

  const addMenuItem = useCallback(
    (item: MenuItem) =>
      patch((s) => ({
        ...s,
        menuItems: [...s.menuItems, { recipe: [], ...item }],
      })),
    [patch],
  );

  const updateStock = useCallback(
    (id: string, stockPatch: Partial<StockItem>) =>
      patch((s) => ({
        ...s,
        stock: s.stock.map((row) =>
          row.id === id ? { ...row, ...stockPatch } : row,
        ),
      })),
    [patch],
  );

  const updateStaff = useCallback(
    (id: string, staffPatch: Partial<StaffMember>) =>
      patch((s) => ({
        ...s,
        staff: s.staff.map((row) =>
          row.id === id ? { ...row, ...staffPatch } : row,
        ),
      })),
    [patch],
  );

  const addStaff = useCallback(
    (member: StaffMember) =>
      patch((s) => ({ ...s, staff: [...s.staff, member] })),
    [patch],
  );

  const updateExpenseCategory = useCallback(
    (id: string, catPatch: Partial<ExpenseCategory>) =>
      patch((s) => ({
        ...s,
        expenseCategories: s.expenseCategories.map((c) =>
          c.id === id ? { ...c, ...catPatch } : c,
        ),
      })),
    [patch],
  );

  const addExpenseCategory = useCallback(
    (cat: ExpenseCategory) =>
      patch((s) => ({
        ...s,
        expenseCategories: [...s.expenseCategories, cat],
      })),
    [patch],
  );

  const addExpense = useCallback(
    (expense: Expense) =>
      patch((s) => {
        let vendors = s.vendors;
        if (expense.vendorId && !expense.paid) {
          vendors = vendors.map((v) =>
            v.id === expense.vendorId
              ? { ...v, dues: v.dues + expense.amount }
              : v,
          );
        }
        return { ...s, expenses: [expense, ...s.expenses], vendors };
      }),
    [patch],
  );

  const updateVendor = useCallback(
    (id: string, vendorPatch: Partial<Vendor>) =>
      patch((s) => ({
        ...s,
        vendors: s.vendors.map((v) =>
          v.id === id ? { ...v, ...vendorPatch } : v,
        ),
      })),
    [patch],
  );

  const addVendor = useCallback(
    (vendor: Vendor) =>
      patch((s) => ({ ...s, vendors: [...s.vendors, vendor] })),
    [patch],
  );

  const placeOrder = useCallback(
    (input: PlaceOrderInput) => {
      const idNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ord-${idNum}`;
      const ticketId = `kt-${idNum}`;
      const placedAt = nowTime();
      const items = input.lines.map((l) => `${l.name} ×${l.qty}`);
      const source = input.source ?? "waiter";

      patch((s) => {
        const ticket: KitchenTicket = {
          id: ticketId,
          table: input.table,
          type: input.type,
          guest: input.guest,
          waiter: input.waiter ?? (source === "guest" ? "Guest QR" : s.waiterName),
          lines: input.lines,
          status: "queued",
          placedAt,
          total: input.total,
          notes: input.notes,
        };
        const order: DemoOrder = {
          id: orderId,
          table: input.table,
          guest: input.guest,
          items,
          lines: input.lines,
          total: input.total,
          status: "new",
          placedAt,
          type: input.type,
          source,
          stockDeducted: true,
        };
        const stock = deductStockForLines(s.stock, s.menuItems, input.lines);
        const tables = s.tables.map((t) => {
          if (!input.table) return t;
          const short = t.label.split(" · ")[0];
          if (short !== input.table && t.id !== input.table) return t;
          return { ...t, status: "ordered" as const, orderId };
        });
        return {
          ...s,
          kitchenTickets: [ticket, ...s.kitchenTickets],
          orders: [order, ...s.orders],
          stock,
          tables,
        };
      });
      return orderId;
    },
    [patch],
  );

  const placeWaiterOrder = useCallback(
    (input: PlaceOrderInput) => placeOrder({ ...input, source: "waiter" }),
    [placeOrder],
  );

  const placeGuestOrder = useCallback(
    (input: PlaceOrderInput) => placeOrder({ ...input, source: "guest" }),
    [placeOrder],
  );

  const bumpKitchenTicket = useCallback(
    (id: string, status: KitchenTicket["status"]) =>
      patch((s) => ({
        ...s,
        kitchenTickets: s.kitchenTickets.map((t) =>
          t.id === id ? { ...t, status } : t,
        ),
        orders: s.orders.map((o) => {
          const ticket = s.kitchenTickets.find((t) => t.id === id);
          if (
            !ticket ||
            o.placedAt !== ticket.placedAt ||
            o.guest !== ticket.guest
          )
            return o;
          const map: Record<string, DemoOrder["status"]> = {
            queued: "new",
            preparing: "preparing",
            ready: "ready",
            bumped: "served",
          };
          return { ...o, status: map[status] ?? o.status };
        }),
      })),
    [patch],
  );

  const settleBill = useCallback(
    (orderId: string, method: PayMethod, tip = 0) =>
      patch((s) => {
        const target = s.orders.find((o) => o.id === orderId);
        if (!target || target.status === "cancelled") return s;
        const withTip = { ...target, tip };
        const amount = orderPayableTotal(withTip, s.menuItems, s.settings);
        const orders = s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "paid" as const,
                payMethod: method,
                tip,
                total: orderSubtotal(o, s.menuItems),
              }
            : o,
        );
        const dayClose = {
          ...s.dayClose,
          [method]: s.dayClose[method] + amount,
        };
        return { ...s, orders, dayClose };
      }),
    [patch],
  );

  const applyDiscount = useCallback(
    (orderId: string, discountPct: number) =>
      patch((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? { ...o, discountPct: Math.min(100, Math.max(0, discountPct)) }
            : o,
        ),
      })),
    [patch],
  );

  const voidOrder = useCallback(
    (orderId: string, reason: string) =>
      patch((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: "cancelled" as const,
                voidReason: reason,
                lines: (o.lines ?? []).map((l) => ({
                  ...l,
                  voided: true,
                  voidReason: reason,
                })),
              }
            : o,
        ),
        kitchenTickets: s.kitchenTickets.map((t) => {
          const order = s.orders.find((o) => o.id === orderId);
          if (
            !order ||
            t.placedAt !== order.placedAt ||
            t.guest !== order.guest
          )
            return t;
          return { ...t, status: "bumped" as const, notes: `VOID: ${reason}` };
        }),
      })),
    [patch],
  );

  const voidLine = useCallback(
    (orderId: string, lineIndex: number, reason: string) =>
      patch((s) => ({
        ...s,
        orders: s.orders.map((o) => {
          if (o.id !== orderId || !o.lines) return o;
          const lines = o.lines.map((l, i) =>
            i === lineIndex ? { ...l, voided: true, voidReason: reason } : l,
          );
          const items = lines
            .filter((l) => !l.voided)
            .map((l) => `${l.name} ×${l.qty}`);
          return {
            ...o,
            lines,
            items,
            total: orderSubtotal({ ...o, lines }, s.menuItems),
          };
        }),
      })),
    [patch],
  );

  const splitBill = useCallback(
    (
      orderId: string,
      mode: "seats" | "amount",
      parts: { label: string; amount?: number; seats?: number }[],
    ) =>
      patch((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order) return s;
        const payable = orderPayableTotal(order, s.menuItems, s.settings);
        let splits: BillSplit[] = [];
        if (mode === "seats") {
          const totalSeats = parts.reduce((sum, p) => sum + (p.seats ?? 1), 0) || 1;
          splits = parts.map((p, i) => {
            const seats = p.seats ?? 1;
            return {
              id: `split-${orderId}-${i}`,
              label: p.label,
              seats,
              amount: +((payable * seats) / totalSeats).toFixed(2),
              paid: false,
            };
          });
        } else {
          splits = parts.map((p, i) => ({
            id: `split-${orderId}-${i}`,
            label: p.label,
            amount: +(p.amount ?? 0).toFixed(2),
            paid: false,
          }));
        }
        return {
          ...s,
          orders: s.orders.map((o) =>
            o.id === orderId ? { ...o, splits } : o,
          ),
        };
      }),
    [patch],
  );

  const paySplitPart = useCallback(
    (orderId: string, splitId: string, method: PayMethod) =>
      patch((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order?.splits) return s;
        const splits = order.splits.map((sp) =>
          sp.id === splitId ? { ...sp, paid: true, payMethod: method } : sp,
        );
        const allPaid = splits.every((sp) => sp.paid);
        const part = splits.find((sp) => sp.id === splitId);
        const dayClose = part
          ? {
              ...s.dayClose,
              [method]: s.dayClose[method] + part.amount,
            }
          : s.dayClose;
        return {
          ...s,
          dayClose,
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  splits,
                  status: allPaid ? ("paid" as const) : o.status,
                  payMethod: allPaid ? method : o.payMethod,
                }
              : o,
          ),
        };
      }),
    [patch],
  );

  const closeDay = useCallback(
    () =>
      patch((s) => {
        const split = paySplit(s.orders, s.menuItems, s.settings);
        const expenses = todayKharcha(s.expenses, s.dayClose.date);
        return {
          ...s,
          dayClose: {
            ...s.dayClose,
            ...split,
            expenses,
            closed: true,
            closedAt: nowTime(),
          },
        };
      }),
    [patch],
  );

  const reopenDay = useCallback(
    () =>
      patch((s) => ({
        ...s,
        dayClose: { ...s.dayClose, closed: false, closedAt: undefined },
      })),
    [patch],
  );

  const resetDemo = useCallback(() => {
    const next = createSeedState();
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const payableTotal = useCallback(
    (order: DemoOrder) =>
      orderPayableTotal(order, state.menuItems, state.settings),
    [state.menuItems, state.settings],
  );

  const metrics = useMemo(() => {
    const sale = todaySale(state.orders, state.menuItems, state.settings);
    const kharcha = todayKharcha(state.expenses, state.dayClose.date);
    return {
      sale,
      kharcha,
      profit: sale - kharcha,
      split: paySplit(state.orders, state.menuItems, state.settings),
      lowStock: state.stock.filter((s) => s.qty <= s.lowAt),
      vendorDues: state.vendors.reduce((sum, v) => sum + v.dues, 0),
      takeawayOpen: state.kitchenTickets.filter(
        (t) => t.type === "takeaway" && t.status !== "bumped",
      ).length,
    };
  }, [state]);

  const value: OpsContextValue = {
    state,
    ready,
    setRole,
    setWaiterName,
    updateSettings,
    updateMenuItem,
    updateRecipe,
    addMenuItem,
    updateStock,
    updateStaff,
    addStaff,
    updateExpenseCategory,
    addExpenseCategory,
    addExpense,
    updateVendor,
    addVendor,
    placeWaiterOrder,
    placeGuestOrder,
    bumpKitchenTicket,
    settleBill,
    applyDiscount,
    voidOrder,
    voidLine,
    splitBill,
    paySplitPart,
    closeDay,
    reopenDay,
    resetDemo,
    payableTotal,
    metrics,
  };

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used within OpsProvider");
  return ctx;
}
