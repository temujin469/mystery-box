import { User } from "./auth";
import { Item } from "./item";
import { BaseQuery } from "./api-response";

// Order Status Enum (matching backend)
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// Shipping Method Enum (matching backend)
export enum ShippingMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

// Shipping Address Interface (matching backend DTO)
export interface ShippingAddress {
  title?: string;
  full_address?: string;
  city?: string;
  district?: string;
  khoroo?: string;
  postal_code?: string;
  phone?: string;
  recipient_name?: string;
  notes?: string;
}

// Order Item Interface (with compound primary key)
export interface OrderItem {
  // Compound primary key
  order_id: number;
  item_id: number;
  // Relations (optional since backend sometimes excludes)
  item?: Item;
  quantity: number;
  unit_price: number;
  total_price: number;
  // Item snapshots at time of order
  item_name: string;
  item_sku:string
  item_description?: string;
  item_image_url?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Status History Entry
export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: Date | string; // Can be Date from backend or string from JSON
  note?: string;
  updated_by?: string; // user_id or 'system'
}

// Main Order Interface
export interface Order {
  id: number;
  order_number: string;

  // Relationships
  user_id: string;
  user?: User; // Optional since backend sometimes excludes this
  order_items?: OrderItem[];

  // Order details
  status: OrderStatus;

  // Pricing
  shipping_fee: number;
  tax_amount?: number; // Optional since not always included
  discount_amount?: number; // Optional since not always included
  total_amount: number;

  // Shipping information
  shipping_method: ShippingMethod;
  tracking_number?: string;
  carrier?: string;

  // Customer information (snapshot at order time)
  customer_name: string;
  customer_email: string;

  // Shipping address (JSON field)
  shipping_address?: ShippingAddress;

  // Additional information
  notes?: string;
  admin_notes?: string;
  cancellation_reason?: string;

  // Important dates (can be Date from backend or string from JSON)
  confirmed_at?: Date | string;
  delivered_at?: Date | string;
  cancelled_at?: Date | string;
  estimated_delivery_date?: Date | string;

  // Status tracking
  status_history?: OrderStatusHistory[];

  // Payment tracking (optional since not always included)
  is_paid?: boolean;
  paid_at?: Date | string;

  // Metadata (optional since not always included)
  metadata?: Record<string, any>;

  created_at: Date | string;
  updated_at: Date | string;
}

// Create Order Item DTO
export interface CreateOrderItemDto {
  item_id: number;
  quantity: number;
  unit_price?: number; // Optional override
  item_name?: string; // Optional snapshot override
  item_description?: string;
  item_image_url?: string;
}

// Create Order DTO
export interface CreateOrderDto {
  user_id: string;
  order_items: CreateOrderItemDto[];

  shipping_method: ShippingMethod;

  // Customer information
  customer_name: string;
  customer_email: string;

  // Shipping address (JSON field, optional for pickup orders)
  shipping_address?: ShippingAddress;

  // Optional fields
  shipping_fee?: number;
  notes?: string;
  estimated_delivery_date?: string;
}

// Update Order Status DTO
export interface UpdateOrderStatusDto {
  status: OrderStatus;
  note?: string;
  updated_by?: string;
}

// Order Item Key (for compound primary key operations)
export interface OrderItemKey {
  order_id: number;
  item_id: number;
}

// Get Orders Query DTO (using common API types)
export interface GetOrdersQueryDto extends BaseQuery {
  status?: OrderStatus;
  shipping_method?: ShippingMethod;
  user_id?: string;
  customer_email?: string;
  created_from?: string;
  created_to?: string;
  search?: string;
  sort_by?: string;
}

// Order Statistics (matching backend getOrderStats return type)
export interface OrderStats {
  statusBreakdown: {
    status: string; // Backend returns string, not OrderStatus enum
    count: string; // Backend returns string from COUNT(*)
    total_amount: string; // Backend returns string from SUM()
  }[];
  totalOrders: number;
  totalRevenue: number;
}

// Order Summary (for lists/cards - matching backend findAll select fields)
export interface OrderSummary {
  id: number;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  shipping_method: ShippingMethod;
  customer_name: string;
  customer_email: string;
  estimated_delivery_date?: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

// Order Filter Options (for UI dropdowns)
export interface OrderFilterOptions {
  statuses: { value: OrderStatus; label: string }[];
  shippingMethods: { value: ShippingMethod; label: string }[];
  sortOptions: { value: string; label: string }[];
}

// Order Action Types (for UI interactions)
export type OrderAction =
  | "view"
  | "edit"
  | "cancel"
  | "confirm"
  | "deliver"
  | "track";

export default Order;
