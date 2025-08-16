import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  ShippingMethod,
  OrderStatus,
  type OrderItem,
  type ShippingAddress,
  type CreateOrderDto,
  type CreateOrderItemDto,
} from "@/types/order";

// User inventory item interface (matching backend getUserInventory response)
export interface InventoryItem {
  item: {
    id: number;
    name: string;
    sku?: string;
    image_url: string;
    price: number;
    description?: string;
    sell_value: number;
    rarity: number;
    created_at: Date;
    updated_at: Date;
  };
  quantity: number;
  redeemed_at: Date;
  updated_at: Date;
}

// Order item for cart (extends InventoryItem with selection and order quantity)
export interface CartItem extends InventoryItem {
  isSelected: boolean;
  orderQuantity: number; // How many to order (max is inventory quantity)
}

// Order state interface
interface OrderState {
  // Cart state (inventory items with selection)
  cartItems: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Order details
  shippingMethod: ShippingMethod;
  shippingAddress: ShippingAddress | null;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: string;

  // Selection state
  isAllSelected: boolean;
  selectedCount: number;
  totalSelectedQuantity: number;
  totalAmount: number;
  shippingFee: number;

  // Actions
  loadInventory: (inventory: InventoryItem[]) => void;
  toggleItemSelection: (itemId: number) => void;
  updateOrderQuantity: (itemId: number, quantity: number) => void;
  selectAll: () => void;
  unselectAll: () => void;
  removeItem: (itemId: number) => void;

  // Order details actions
  setShippingMethod: (method: ShippingMethod) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setCustomerInfo: (info: {
    name: string;
    email: string;
  }) => void;
  setNotes: (notes: string) => void;

  // Cart management
  clearCart: () => void;
  getSelectedItems: () => CartItem[];
  calculateTotals: () => void;

  // Order submission
  createOrderDto: () => CreateOrderDto | null;

  // Utility
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// Shipping method options
export const SHIPPING_METHODS = [
  { value: ShippingMethod.PICKUP, label: "Дэлгүүрээс авах", fee: 0 },
  { value: ShippingMethod.DELIVERY, label: "Хүргэлт", fee: 5000 },
] as const;

// Create the order store
export const useOrderStore = create<OrderState>()(
  devtools(
    (set, get) => ({
      // Initial state
      cartItems: [],
      isLoading: false,
      error: null,

      // Order details
      shippingMethod: ShippingMethod.PICKUP,
      shippingAddress: null,
      customerInfo: { name: "", email: "", phone: "" },
      notes: "",

      // Selection state
      isAllSelected: false,
      selectedCount: 0,
      totalSelectedQuantity: 0,
      totalAmount: 0,
      shippingFee: 0,

      // Actions
      loadInventory: (inventory) => {
        const cartItems: CartItem[] = inventory.map((item) => ({
          ...item,
          isSelected: false,
          orderQuantity: 1, // Default order quantity is 1
        }));

        set({ cartItems });
        get().calculateTotals();
      },

      toggleItemSelection: (itemId) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.item.id === itemId
              ? { ...item, isSelected: !item.isSelected }
              : item
          ),
        }));
        get().calculateTotals();
      },

      updateOrderQuantity: (itemId, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.item.id === itemId
              ? {
                  ...item,
                  orderQuantity: Math.min(Math.max(1, quantity), item.quantity),
                }
              : item
          ),
        }));
        get().calculateTotals();
      },

      selectAll: () => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => ({
            ...item,
            isSelected: true,
          })),
        }));
        get().calculateTotals();
      },

      unselectAll: () => {
        set((state) => ({
          cartItems: state.cartItems.map((item) => ({
            ...item,
            isSelected: false,
          })),
        }));
        get().calculateTotals();
      },

      removeItem: (itemId) => {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.item.id !== itemId),
        }));
        get().calculateTotals();
      },

      // Order details actions
      setShippingMethod: (method) => {
        const shippingFee =
          SHIPPING_METHODS.find((m) => m.value === method)?.fee || 0;
        set({ shippingMethod: method, shippingFee });
        get().calculateTotals();
      },

      setShippingAddress: (address) => {
        set({ shippingAddress: address });
      },

      setCustomerInfo: (info) => {
        set({ customerInfo: info });
      },

      setNotes: (notes) => {
        set({ notes });
      },

      // Cart management
      clearCart: () => {
        set({
          cartItems: [],
          isAllSelected: false,
          selectedCount: 0,
          totalSelectedQuantity: 0,
          totalAmount: 0,
          shippingAddress: null,
          customerInfo: { name: "", email: "", phone: "" },
          notes: "",
          error: null,
        });
      },

      getSelectedItems: () => {
        return get().cartItems.filter((item) => item.isSelected);
      },

      calculateTotals: () => {
        const { cartItems, shippingFee } = get();
        const selectedItems = cartItems.filter((item) => item.isSelected);

        const selectedCount = selectedItems.length;
        const totalSelectedQuantity = selectedItems.reduce(
          (sum, item) => sum + item.orderQuantity,
          0
        );

        const itemsTotal = selectedItems.reduce(
          (sum, item) => sum + item.item.price * item.orderQuantity,
          0
        );

        const totalAmount = itemsTotal + shippingFee;
        const isAllSelected =
          cartItems.length > 0 && selectedItems.length === cartItems.length;

        set({
          selectedCount,
          totalSelectedQuantity,
          totalAmount,
          isAllSelected,
        });
      },

      // Order submission
      createOrderDto: () => {
        const {
          cartItems,
          shippingMethod,
          shippingAddress,
          customerInfo,
          notes,
          shippingFee,
        } = get();

        const selectedItems = cartItems.filter((item) => item.isSelected);

        if (selectedItems.length === 0) {
          set({ error: "Та захиалах зүйл сонгоно уу" });
          return null;
        }

        if (!customerInfo.name || !customerInfo.email) {
          set({ error: "Нэр болон имэйл хаяг шаардлагатай" });
          return null;
        }

        // Shipping address required for delivery methods
        if (
          shippingMethod !== ShippingMethod.PICKUP &&
          (!shippingAddress ||
            !shippingAddress.city ||
            !shippingAddress.district ||
            !shippingAddress.full_address)
        ) {
          set({ error: "Хүргэлтийн хаяг шаардлагатай" });
          return null;
        }

        const orderItems: CreateOrderItemDto[] = selectedItems.map((item) => ({
          item_id: item.item.id,
          quantity: item.orderQuantity,
          unit_price: item.item.price,
          item_name: item.item.name,
          item_description: item.item.description,
          item_image_url: item.item.image_url,
        }));

        const createOrderDto: CreateOrderDto = {
          user_id: "", // This should be set by the calling component
          order_items: orderItems,
          shipping_fee: shippingFee,
          shipping_method: shippingMethod,
          customer_name: customerInfo.name,
          customer_email: customerInfo.email,
          shipping_address:
            shippingMethod !== ShippingMethod.PICKUP
              ? shippingAddress || undefined
              : undefined,
          notes: notes || undefined,
        };

        return createOrderDto;
      },

      // Utility
      setError: (error) => {
        set({ error });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: "order-store",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
