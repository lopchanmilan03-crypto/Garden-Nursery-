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
  paySplit,
  todayKharcha,
  todaySale,
  type DemoOrder,
  type Expense,
  type ExpenseCategory,
  type KitchenTicket,
  type MenuItem,
  type OpsState,
  type PayMethod,
  type Role,
  type StaffMember,
  type StockItem,
  type Vendor,
} from "@/lib/demo-data";

const STORAGE_KEY = "garden-restaurant-ops-v1";

type OpsContextValue = {
  state: OpsState;
  ready: boolean;
  setRole: (role: Role) => void;
  setWaiterName: (name: string) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  addMenuItem: (item: MenuItem) => void;
  updateStock: (id: string, patch: Partial<StockItem>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  addStaff: (member: StaffMember) => void;
  updateExpenseCategory: (id: string, patch: Partial<ExpenseCategory>) => void;
  addExpenseCategory: (cat: ExpenseCategory) => void;
  addExpense: (expense: Expense) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  addVendor: (vendor: Vendor) => void;
  placeWaiterOrder: (input: {
    table: string | null;
    type: "dine-in" | "takeaway";
    guest: string;
    lines: { menuItemId: string; name: string; qty: number }[];
    notes?: string;
    total: number;
  }) => string;
  bumpKitchenTicket: (id: string, status: KitchenTicket["status"]) => void;
  settleBill: (orderId: string, method: PayMethod, tip?: number) => void;
  closeDay: () => void;
  reopenDay: () => void;
  resetDemo: () => void;
  metrics: {
    sale: number;
    kharcha: number;
    profit: number;
    split: { cash: number; card: number; upi: number };
    lowStock: StockItem[];
    vendorDues: number;
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

export function OpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpsState>(() => createSeedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OpsState;
        setState({ ...createSeedState(), ...parsed });
      }
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
        setState(JSON.parse(e.newValue) as OpsState);
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

  const addMenuItem = useCallback(
    (item: MenuItem) =>
      patch((s) => ({ ...s, menuItems: [...s.menuItems, item] })),
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

  const placeWaiterOrder = useCallback(
    (input: {
      table: string | null;
      type: "dine-in" | "takeaway";
      guest: string;
      lines: { menuItemId: string; name: string; qty: number }[];
      notes?: string;
      total: number;
    }) => {
      const idNum = Math.floor(1000 + Math.random() * 9000);
      const orderId = `ord-${idNum}`;
      const ticketId = `kt-${idNum}`;
      const placedAt = nowTime();
      const items = input.lines.map((l) => `${l.name} ×${l.qty}`);

      patch((s) => {
        const ticket: KitchenTicket = {
          id: ticketId,
          table: input.table,
          type: input.type,
          guest: input.guest,
          waiter: s.waiterName,
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
        };
        const stock = s.stock.map((row) => {
          const used = input.lines
            .filter((l) => {
              const menu = s.menuItems.find((m) => m.id === l.menuItemId);
              return menu?.stockSkuId === row.id;
            })
            .reduce((sum, l) => sum + l.qty * 0.2, 0);
          if (!used) return row;
          return { ...row, qty: Math.max(0, +(row.qty - used).toFixed(2)) };
        });
        return {
          ...s,
          kitchenTickets: [ticket, ...s.kitchenTickets],
          orders: [order, ...s.orders],
          stock,
        };
      });
      return orderId;
    },
    [patch],
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
          if (!ticket || o.placedAt !== ticket.placedAt || o.guest !== ticket.guest)
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
        const orders = s.orders.map((o) =>
          o.id === orderId
            ? { ...o, status: "paid" as const, payMethod: method, tip }
            : o,
        );
        const paid = orders.find((o) => o.id === orderId);
        const amount = (paid?.total ?? 0) + tip;
        const dayClose = {
          ...s.dayClose,
          [method]: s.dayClose[method] + amount,
        };
        return { ...s, orders, dayClose };
      }),
    [patch],
  );

  const closeDay = useCallback(
    () =>
      patch((s) => {
        const split = paySplit(s.orders);
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

  const metrics = useMemo(() => {
    const sale = todaySale(state.orders);
    const kharcha = todayKharcha(state.expenses, state.dayClose.date);
    return {
      sale,
      kharcha,
      profit: sale - kharcha,
      split: paySplit(state.orders),
      lowStock: state.stock.filter((s) => s.qty <= s.lowAt),
      vendorDues: state.vendors.reduce((sum, v) => sum + v.dues, 0),
    };
  }, [state]);

  const value: OpsContextValue = {
    state,
    ready,
    setRole,
    setWaiterName,
    updateMenuItem,
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
    bumpKitchenTicket,
    settleBill,
    closeDay,
    reopenDay,
    resetDemo,
    metrics,
  };

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps() {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used within OpsProvider");
  return ctx;
}
