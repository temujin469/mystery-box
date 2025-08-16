"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../../services/api/order.service";
import {
  Order,
  CreateOrderDto,
  UpdateOrderStatusDto,
  GetOrdersQueryDto,
  OrderStats,
} from "../../types/order";
import {
  ApiResponse,
  PaginatedApiResponse,
  OperationResponse,
} from "../../types/api-response";
import { userKeys } from "./useUser";

// Query Keys
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (query?: GetOrdersQueryDto) => [...orderKeys.lists(), query] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  myOrders: () => [...orderKeys.all, "my"] as const,
  myOrder: (query?: GetOrdersQueryDto) =>
    [...orderKeys.myOrders(), query] as const,
  orderByNumber: (orderNumber: string) =>
    [...orderKeys.details(), "number", orderNumber] as const,
  userOrders: (userId: string) => [...orderKeys.all, "user", userId] as const,
  stats: () => [...orderKeys.all, "stats"] as const,
  items: (orderId: number) => [...orderKeys.detail(orderId), "items"] as const,
} as const;

// Query Hooks

// Get orders (admin/editor only)
export const useOrders = (query?: GetOrdersQueryDto) => {
  return useQuery({
    queryKey: orderKeys.list(query),
    queryFn: async () => {
      const response = await orderService.getOrders(query);
      return response;
    },
  });
};

// Get order statistics (admin/editor only)
export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async () => {
      const response = await orderService.getOrderStats();
      return response;
    },
  });
};

// Get current user's orders
export const useMyOrders = (query?: GetOrdersQueryDto) => {
  return useQuery({
    queryKey: orderKeys.myOrder(query),
    queryFn: async () => {
      const response = await orderService.getMyOrders(query);
      return response;
    },
  });
};

// Get current user's order by order number
export const useMyOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: orderKeys.orderByNumber(orderNumber),
    queryFn: async () => {
      const response = await orderService.getMyOrderByNumber(orderNumber);
      return response;
    },
    enabled: !!orderNumber,
  });
};

// Get current user's order by ID
export const useMyOrderById = (id: number) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await orderService.getMyOrderById(id);
      return response;
    },
    enabled: !!id && id > 0,
  });
};

// Get specific user's orders (admin/editor only)
export const useUserOrders = (userId: string, query?: GetOrdersQueryDto) => {
  return useQuery({
    queryKey: orderKeys.userOrders(userId),
    queryFn: async () => {
      const response = await orderService.getUserOrders(userId, query);
      return response;
    },
    enabled: !!userId,
  });
};

// Get order by order number (admin/editor only)
export const useOrderByNumber = (orderNumber: string) => {
  return useQuery({
    queryKey: orderKeys.orderByNumber(orderNumber),
    queryFn: async () => {
      const response = await orderService.getOrderByNumber(orderNumber);
      return response;
    },
    enabled: !!orderNumber,
  });
};

// Get order by ID (admin/editor only)
export const useOrderById = (id: number) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await orderService.getOrderById(id);
      return response;
    },
    enabled: !!id && id > 0,
  });
};

// Get order items (admin/editor only)
export const useOrderItems = (orderId: number) => {
  return useQuery({
    queryKey: orderKeys.items(orderId),
    queryFn: async () => {
      const response = await orderService.getOrderItems(orderId);
      return response;
    },
    enabled: !!orderId && orderId > 0,
  });
};

// Mutation Hooks

// Create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateOrderDto): Promise<OperationResponse> => {
      return await orderService.createOrder(data);
    },
    onSuccess: (_, data) => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.inventory(data.user_id),
      });
    },
  });
};

// Update order status (admin/editor only)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: UpdateOrderStatusDto;
    }): Promise<OperationResponse> => {
      return await orderService.updateOrderStatus(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate specific order and all order lists
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
    },
  });
};

// // Export all order hooks
// export const useOrder = {
//   // Queries
//   getOrders: useOrders,
//   getOrderStats: useOrderStats,
//   getMyOrders: useMyOrders,
//   getMyOrderByNumber: useMyOrderByNumber,
//   getMyOrderById: useMyOrderById,
//   getUserOrders: useUserOrders,
//   getOrderByNumber: useOrderByNumber,
//   getOrderById: useOrderById,
//   getOrderItems: useOrderItems,

//   // Mutations
//   createOrder: useCreateOrder,
//   updateOrderStatus: useUpdateOrderStatus,
// };
