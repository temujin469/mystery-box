import api from "../../lib/api";
import {
  ApiResponse,
  PaginatedApiResponse,
  OperationResponse,
} from "../../types/api-response";
import {
  Order,
  CreateOrderDto,
  UpdateOrderStatusDto,
  GetOrdersQueryDto,
  OrderStats,
} from "../../types/order";

class OrderService {
  private readonly baseUrl = "/orders";

  // Create a new order
  async createOrder(data: CreateOrderDto): Promise<OperationResponse> {
    const response = await api.post<OperationResponse>(this.baseUrl, data);
    return response.data;
  }

  // Get paginated orders (admin/editor only)
  async getOrders(
    query?: GetOrdersQueryDto
  ): Promise<PaginatedApiResponse<Order>> {
    const response = await api.get<PaginatedApiResponse<Order>>(this.baseUrl, {
      params: query,
    });
    return response.data;
  }

  // Get order statistics (admin/editor only)
  async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    const response = await api.get<ApiResponse<OrderStats>>(
      `${this.baseUrl}/stats`
    );
    return response.data;
  }

  // Get current user's orders
  async getMyOrders(
    query?: GetOrdersQueryDto
  ): Promise<PaginatedApiResponse<Order>> {
    const response = await api.get<PaginatedApiResponse<Order>>(
      `${this.baseUrl}/me`,
      {
        params: query,
      }
    );
    return response.data;
  }

  // Get current user's order by order number
  async getMyOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(
      `${this.baseUrl}/me/${orderNumber}`
    );
    return response.data;
  }

  // Get current user's order by ID
  async getMyOrderById(id: number): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(
      `${this.baseUrl}/me/orders/${id}`
    );
    return response.data;
  }

  // Get specific user's orders (admin/editor only)
  async getUserOrders(
    userId: string,
    query?: GetOrdersQueryDto
  ): Promise<PaginatedApiResponse<Order>> {
    const response = await api.get<PaginatedApiResponse<Order>>(
      `${this.baseUrl}/user/${userId}`,
      {
        params: query,
      }
    );
    return response.data;
  }

  // Get order by order number (admin/editor only)
  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(
      `${this.baseUrl}/number/${orderNumber}`
    );
    return response.data;
  }

  // Get order by ID (admin/editor only)
  async getOrderById(id: number): Promise<ApiResponse<Order>> {
    const response = await api.get<ApiResponse<Order>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  // Update order status (admin/editor only)
  async updateOrderStatus(
    id: number,
    data: UpdateOrderStatusDto
  ): Promise<OperationResponse> {
    const response = await api.patch<OperationResponse>(
      `${this.baseUrl}/${id}/status`,
      data
    );
    return response.data;
  }

  // Get order items (admin/editor only)
  async getOrderItems(orderId: number): Promise<ApiResponse<any[]>> {
    const response = await api.get<ApiResponse<any[]>>(
      `${this.baseUrl}/${orderId}/items`
    );
    return response.data;
  }
}

export const orderService = new OrderService();
