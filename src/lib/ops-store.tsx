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
  OPS_TODAY,
  authRoleToOpsRole,
  buildDishCostRows,
  createSeedState,
  deductStockForLines,
  expenseHotspots,
  minutesBetween,
  monthlyTargetProgress,
  orderPayableTotal,
  orderSubtotal,
  overheadSummary,
  paySplit,
  profitByProduct,
  profitMarginPct,
  restoreStockForLines,
  stockAlertLevel,
  todayKharcha,
  todaySale,
  topSellers,
  sessionForRole,
  withSeedRecipes,
  type AttendanceRecord,
  type AuthRole,
  type AuthSession,
  type BillSplit,
  createCostingForNewDish,
  type CostTargetsConfig,
  type DemoOrder,
  type DishCostRecipe,
  type DishIngredientUse,
  type Expense,
  type ExpenseCategory,
  type IngredientPack,
  type KitchenTicket,
  type MenuItem,
  type OpsSettings,
  type OpsState,
  type OverheadLine,
  type PayMethod,
  type RecipeLine,
  type Role,
  type StaffMember,
  type StockItem,
  type Vendor,
} from "@/lib/demo-data";

const STORAGE_KEY = "garden-restaurant-ops-v7";

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
  enterAs: (role: AuthRole) => Promise<boolean>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
  setWaiterName: (name: string) => void;
  updateSettings: (patch: Partial<OpsSettings>) => void;
  updateCostTargets: (patch: Partial<CostTargetsConfig>) => void;
  updateMonthlyOverhead: (id: string, patch: Partial<OverheadLine>) => void;
  updateIngredientPack: (id: string, patch: Partial<IngredientPack>) => void;
  updateDishCostRecipe: (
    menuItemId: string,
    patch: Partial<DishCostRecipe> | { ingredients: DishIngredientUse[] },
  ) => void;
  updateMenuItem: (id: string, patch: Partial<MenuItem>) => void;
  updateRecipe: (menuItemId: string, recipe: RecipeLine[]) => void;
  addMenuItem: (
    item: MenuItem,
    costing?: { packCost?: number; yieldQty?: number; yieldLabel?: string },
  ) => void;
  removeMenuItem: (id: string) => void;
  updateStock: (id: string, patch: Partial<StockItem>) => void;
  updateStaff: (id: string, patch: Partial<StaffMember>) => void;
  addStaff: (member: StaffMember) => void;
  updateExpenseCategory: (id: string, patch: Partial<ExpenseCategory>) => void;
  addExpenseCategory: (cat: ExpenseCategory) => void;
  addExpense: (expense: Expense) => void;
  updateExpense: (id: string, patch: Partial<Expense>) => void;
  markExpensePaid: (id: string) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  addVendor: (vendor: Vendor) => void;
  payVendorDues: (id: string, amount?: number) => void;
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
  clockIn: (staffId: string) => void;
  clockOut: (staffId: string) => void;
  closeDay: () => void;
  reopenDay: () => void;
  resetDemo: () => void;
  payableTotal: (order: DemoOrder) => number;
  metrics: {
    sale: number;
    kharcha: number;
    profit: number;
    marginPct: number;
    split: { cash: number; card: number; upi: number };
    lowStock: StockItem[];
    criticalStock: StockItem[];
    vendorDues: number;
    unpaidExpenses: number;
    /** Vendor dues + unpaid expenses with no vendor (avoids double-count). */
    payablesTotal: number;
    takeawayOpen: number;
    topSellers: ReturnType<typeof topSellers>;
    expenseHotspots: ReturnType<typeof expenseHotspots>;
    profitByProduct: ReturnType<typeof profitByProduct>;
    overhead: ReturnType<typeof overheadSummary>;
    dishCosts: ReturnType<typeof buildDishCostRows>;
    monthlyTarget: ReturnType<typeof monthlyTargetProgress>;
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

function scheduledStartFor(member: StaffMember | undefined): string {
  if (!member) return "09:00";
  const m = member.shift.match(/(\d{1,2})/);
  if (!m) return "09:00";
  const hour = Number(m[1]);
  return `${String(hour).padStart(2, "0")}:00`;
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
    attendance: parsed.attendance?.length
      ? parsed.attendance
      : seed.attendance,
    ingredientPacks: parsed.ingredientPacks?.length
      ? parsed.ingredientPacks
      : seed.ingredientPacks,
    dishCostRecipes: parsed.dishCostRecipes?.length
      ? parsed.dishCostRecipes
      : seed.dishCostRecipes,
    monthlyOverheads: parsed.monthlyOverheads?.length
      ? parsed.monthlyOverheads
      : seed.monthlyOverheads,
    costTargets: { ...seed.costTargets, ...(parsed.costTargets ?? {}) },
    settings: { ...seed.settings, ...(parsed.settings ?? {}) },
    session: sanitizeSession(parsed.session),
  };
}

function sanitizeSession(
  session: OpsState["session"] | (AuthSession & { username?: string }) | null | undefined,
): AuthSession | null {
  if (!session?.role || !session.staffId || !session.displayName) return null;
  return {
    role: session.role,
    staffId: session.staffId,
    displayName: session.displayName,
  };
}

export function OpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpsState>(() => createSeedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Hydrate once from localStorage (client-only; avoid SSR mismatch).
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional one-shot hydrate
        setState(mergeState(JSON.parse(raw) as Partial<OpsState>));
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

  const enterAs = useCallback(async (role: AuthRole) => {
    const session = sessionForRole(role);
    if (!session) return false;

    // Apply client session first so AuthGate / localStorage hydrate work
    // even if the cookie request is slow or the host rejects Secure cookies.
    const next = (prev: OpsState): OpsState => ({
      ...prev,
      session,
      role: authRoleToOpsRole(session.role),
      waiterName:
        session.role === "staff" ||
        session.role === "owner" ||
        session.role === "cashier"
          ? session.displayName
          : prev.waiterName,
    });
    setState((prev) => {
      const merged = next(prev);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* ignore */
      }
      return merged;
    });

    try {
      await fetch("/api/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ role }),
      });
    } catch {
      /* cookie is best-effort; client session still set */
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/session", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    patch((s) => ({ ...s, session: null }));
  }, [patch]);

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

  const updateCostTargets = useCallback(
    (targetsPatch: Partial<CostTargetsConfig>) =>
      patch((s) => ({
        ...s,
        costTargets: { ...s.costTargets, ...targetsPatch },
      })),
    [patch],
  );

  const updateMonthlyOverhead = useCallback(
    (id: string, ohPatch: Partial<OverheadLine>) =>
      patch((s) => ({
        ...s,
        monthlyOverheads: s.monthlyOverheads.map((o) => {
          if (o.id !== id) return o;
          const next = { ...o, ...ohPatch };
          if (
            next.kind === "salary" &&
            (ohPatch.staffCount != null || ohPatch.payPerStaff != null)
          ) {
            const count = next.staffCount ?? 0;
            const pay = next.payPerStaff ?? 0;
            next.monthlyAmount = count * pay;
          }
          return next;
        }),
      })),
    [patch],
  );

  const updateIngredientPack = useCallback(
    (id: string, packPatch: Partial<IngredientPack>) =>
      patch((s) => ({
        ...s,
        ingredientPacks: s.ingredientPacks.map((p) =>
          p.id === id ? { ...p, ...packPatch } : p,
        ),
      })),
    [patch],
  );

  const updateDishCostRecipe = useCallback(
    (
      menuItemId: string,
      recipePatch: Partial<DishCostRecipe> | { ingredients: DishIngredientUse[] },
    ) =>
      patch((s) => ({
        ...s,
        dishCostRecipes: s.dishCostRecipes.map((r) =>
          r.menuItemId === menuItemId ? { ...r, ...recipePatch } : r,
        ),
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
    (
      item: MenuItem,
      costingOpts?: {
        packCost?: number;
        yieldQty?: number;
        yieldLabel?: string;
      },
    ) =>
      patch((s) => {
        const costing = createCostingForNewDish(item);
        if (costingOpts?.packCost != null) {
          costing.pack.packCost = costingOpts.packCost;
        }
        if (costingOpts?.yieldQty != null) {
          costing.pack.yieldQty = costingOpts.yieldQty;
        }
        if (costingOpts?.yieldLabel) {
          costing.pack.yieldLabel = costingOpts.yieldLabel;
        }
        return {
          ...s,
          menuItems: [...s.menuItems, { recipe: [], ...item }],
          ingredientPacks: [...s.ingredientPacks, costing.pack],
          dishCostRecipes: [...s.dishCostRecipes, costing.recipe],
        };
      }),
    [patch],
  );

  const removeMenuItem = useCallback(
    (id: string) =>
      patch((s) => {
        const removedRecipe = s.dishCostRecipes.find(
          (r) => r.menuItemId === id,
        );
        const removedPackIds = new Set(
          removedRecipe?.ingredients.map((i) => i.packId) ?? [],
        );
        const stillUsed = new Set(
          s.dishCostRecipes
            .filter((r) => r.menuItemId !== id)
            .flatMap((r) => r.ingredients.map((i) => i.packId)),
        );
        return {
          ...s,
          menuItems: s.menuItems.filter((m) => m.id !== id),
          dishCostRecipes: s.dishCostRecipes.filter(
            (r) => r.menuItemId !== id,
          ),
          ingredientPacks: s.ingredientPacks.filter((p) => {
            if (p.ownedByMenuItemId === id) return false;
            if (removedPackIds.has(p.id) && !stillUsed.has(p.id)) return false;
            return true;
          }),
        };
      }),
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

  const updateExpense = useCallback(
    (id: string, expensePatch: Partial<Expense>) =>
      patch((s) => ({
        ...s,
        expenses: s.expenses.map((e) =>
          e.id === id ? { ...e, ...expensePatch } : e,
        ),
      })),
    [patch],
  );

  const markExpensePaid = useCallback(
    (id: string) =>
      patch((s) => {
        const expense = s.expenses.find((e) => e.id === id);
        if (!expense || expense.paid) return s;
        let vendors = s.vendors;
        if (expense.vendorId) {
          vendors = vendors.map((v) =>
            v.id === expense.vendorId
              ? { ...v, dues: Math.max(0, v.dues - expense.amount) }
              : v,
          );
        }
        return {
          ...s,
          vendors,
          expenses: s.expenses.map((e) =>
            e.id === id ? { ...e, paid: true } : e,
          ),
        };
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

  const payVendorDues = useCallback(
    (id: string, amount?: number) =>
      patch((s) => ({
        ...s,
        vendors: s.vendors.map((v) => {
          if (v.id !== id) return v;
          const pay = amount ?? v.dues;
          return { ...v, dues: Math.max(0, +(v.dues - pay).toFixed(0)) };
        }),
      })),
    [patch],
  );

  const placeOrder = useCallback(
    (input: PlaceOrderInput) => {
      const stamp = `${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
      const orderId = `ord-${stamp}`;
      const ticketId = `kt-${stamp}`;
      const placedAt = nowTime();
      const items = input.lines.map((l) => `${l.name} ×${l.qty}`);
      const source = input.source ?? "waiter";

      patch((s) => {
        const ticket: KitchenTicket = {
          id: ticketId,
          orderId,
          table: input.table,
          type: input.type,
          guest: input.guest,
          waiter:
            input.waiter ??
            (source === "guest"
              ? "Guest QR"
              : (s.session?.displayName ?? s.waiterName)),
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
      patch((s) => {
        const ticket = s.kitchenTickets.find((t) => t.id === id);
        return {
          ...s,
          kitchenTickets: s.kitchenTickets.map((t) =>
            t.id === id ? { ...t, status } : t,
          ),
          orders: s.orders.map((o) => {
            if (!ticket) return o;
            const linked =
              (ticket.orderId && o.id === ticket.orderId) ||
              (!ticket.orderId &&
                o.placedAt === ticket.placedAt &&
                o.guest === ticket.guest);
            if (!linked) return o;
            const map: Record<string, DemoOrder["status"]> = {
              queued: "new",
              preparing: "preparing",
              ready: "ready",
              bumped: "served",
            };
            return { ...o, status: map[status] ?? o.status };
          }),
        };
      }),
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
        const tables = s.tables.map((t) =>
          t.orderId === orderId
            ? { ...t, status: "open" as const, orderId: undefined }
            : t,
        );
        return { ...s, orders, dayClose, tables };
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
      patch((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order || order.status === "cancelled") return s;
        const linesToRestore =
          order.stockDeducted && order.lines?.length
            ? order.lines.filter((l) => !l.voided)
            : [];
        const stock = linesToRestore.length
          ? restoreStockForLines(s.stock, s.menuItems, linesToRestore)
          : s.stock;
        return {
          ...s,
          stock,
          orders: s.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: "cancelled" as const,
                  voidReason: reason,
                  stockDeducted: false,
                  lines: (o.lines ?? []).map((l) => ({
                    ...l,
                    voided: true,
                    voidReason: reason,
                  })),
                }
              : o,
          ),
          kitchenTickets: s.kitchenTickets.map((t) => {
            const linked =
              t.orderId === orderId ||
              (!t.orderId &&
                t.placedAt === order.placedAt &&
                t.guest === order.guest);
            if (!linked) return t;
            return {
              ...t,
              status: "bumped" as const,
              notes: `VOID: ${reason}`,
            };
          }),
        };
      }),
    [patch],
  );

  const voidLine = useCallback(
    (orderId: string, lineIndex: number, reason: string) =>
      patch((s) => {
        const order = s.orders.find((o) => o.id === orderId);
        if (!order?.lines?.[lineIndex] || order.lines[lineIndex].voided) {
          return s;
        }
        const line = order.lines[lineIndex];
        const stock =
          order.stockDeducted
            ? restoreStockForLines(s.stock, s.menuItems, [line])
            : s.stock;
        return {
          ...s,
          stock,
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
        };
      }),
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
          const totalSeats =
            parts.reduce((sum, p) => sum + (p.seats ?? 1), 0) || 1;
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

  const clockIn = useCallback(
    (staffId: string) =>
      patch((s) => {
        const member = s.staff.find((m) => m.id === staffId);
        const time = nowTime();
        const scheduled = scheduledStartFor(member);
        const late = minutesBetween(scheduled, time) > 5;
        const existing = s.attendance.find(
          (a) => a.staffId === staffId && a.date === OPS_TODAY,
        );
        const record: AttendanceRecord = {
          id: existing?.id ?? `att-${staffId}-${Date.now()}`,
          staffId,
          date: OPS_TODAY,
          clockIn: time,
          clockOut: undefined,
          scheduledStart: scheduled,
          status: late ? "late" : "working",
        };
        const attendance = existing
          ? s.attendance.map((a) => (a.id === existing.id ? record : a))
          : [record, ...s.attendance];
        return {
          ...s,
          attendance,
          staff: s.staff.map((m) =>
            m.id === staffId ? { ...m, presentToday: true } : m,
          ),
        };
      }),
    [patch],
  );

  const clockOut = useCallback(
    (staffId: string) =>
      patch((s) => {
        const time = nowTime();
        return {
          ...s,
          attendance: s.attendance.map((a) => {
            if (a.staffId !== staffId || a.date !== OPS_TODAY) return a;
            const wasLate = a.status === "late";
            return {
              ...a,
              clockOut: time,
              status: wasLate ? "late" : "on-time",
            };
          }),
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
    const session = state.session;
    const next = { ...createSeedState(), session };
    setState(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [state.session]);

  const payableTotal = useCallback(
    (order: DemoOrder) =>
      orderPayableTotal(order, state.menuItems, state.settings),
    [state.menuItems, state.settings],
  );

  const metrics = useMemo(() => {
    const sale = todaySale(state.orders, state.menuItems, state.settings);
    const kharcha = todayKharcha(state.expenses, state.dayClose.date);
    const lowStock = state.stock.filter((s) => stockAlertLevel(s) !== "ok");
    const criticalStock = state.stock.filter(
      (s) => stockAlertLevel(s) === "critical",
    );
    const overhead = overheadSummary(
      state.monthlyOverheads,
      state.costTargets.monthlyUnitVolume,
    );
    const dishCosts = buildDishCostRows(
      state.menuItems,
      state.ingredientPacks,
      state.dishCostRecipes,
      overhead.perUnit,
      overhead.monthly,
    );
    const monthlyTarget = monthlyTargetProgress(state.costTargets, sale);
    return {
      sale,
      kharcha,
      profit: sale - kharcha,
      marginPct: profitMarginPct(sale, kharcha),
      split: paySplit(state.orders, state.menuItems, state.settings),
      lowStock,
      criticalStock,
      vendorDues: state.vendors.reduce((sum, v) => sum + v.dues, 0),
      unpaidExpenses: state.expenses
        .filter((e) => !e.paid)
        .reduce((sum, e) => sum + e.amount, 0),
      payablesTotal:
        state.vendors.reduce((sum, v) => sum + v.dues, 0) +
        state.expenses
          .filter((e) => !e.paid && !e.vendorId)
          .reduce((sum, e) => sum + e.amount, 0),
      takeawayOpen: state.kitchenTickets.filter(
        (t) => t.type === "takeaway" && t.status !== "bumped",
      ).length,
      topSellers: topSellers(state.orders, state.menuItems),
      expenseHotspots: expenseHotspots(
        state.expenses,
        state.expenseCategories,
      ),
      profitByProduct: profitByProduct(state.orders, state.menuItems),
      overhead,
      dishCosts,
      monthlyTarget,
    };
  }, [state]);

  const value: OpsContextValue = {
    state,
    ready,
    enterAs,
    logout,
    setRole,
    setWaiterName,
    updateSettings,
    updateCostTargets,
    updateMonthlyOverhead,
    updateIngredientPack,
    updateDishCostRecipe,
    updateMenuItem,
    updateRecipe,
    addMenuItem,
    removeMenuItem,
    updateStock,
    updateStaff,
    addStaff,
    updateExpenseCategory,
    addExpenseCategory,
    addExpense,
    updateExpense,
    markExpensePaid,
    updateVendor,
    addVendor,
    payVendorDues,
    placeWaiterOrder,
    placeGuestOrder,
    bumpKitchenTicket,
    settleBill,
    applyDiscount,
    voidOrder,
    voidLine,
    splitBill,
    paySplitPart,
    clockIn,
    clockOut,
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

export function useSession(): AuthSession | null {
  return useOps().state.session;
}
