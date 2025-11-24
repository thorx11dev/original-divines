'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, Printer, CheckCircle, X } from 'lucide-react';

interface OrderItem {
  id: number;
  productName: string;
  variant: string | null;
  size: string | null;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  isConfirmedByTeam: boolean;
  isVerified: boolean;
  createdAt: string;
  items?: OrderItem[];
}

export const OrdersView = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, searchTerm]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      params.append('limit', '100');

      const response = await fetch(`/api/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const viewOrderDetails = async (order: Order) => {
    try {
      const response = await fetch(`/api/orders?id=${order.id}`);
      const data = await response.json();
      setSelectedOrder(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const confirmOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          viewOrderDetails({ ...selectedOrder });
        }
      }
    } catch (error) {
      console.error('Failed to confirm order:', error);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          viewOrderDetails({ ...selectedOrder });
        }
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const printOrder = () => {
    if (!selectedOrder) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order ${selectedOrder.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .label { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <h1>Order ${selectedOrder.orderNumber}</h1>
          
          <div class="section">
            <p><span class="label">Customer:</span> ${selectedOrder.customerName}</p>
            <p><span class="label">Phone:</span> ${selectedOrder.customerPhone}</p>
            <p><span class="label">Address:</span> ${selectedOrder.customerAddress}</p>
            <p><span class="label">Status:</span> ${selectedOrder.status}</p>
            <p><span class="label">Date:</span> ${new Date(selectedOrder.createdAt).toLocaleString()}</p>
          </div>

          <h2>Order Items</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${selectedOrder.items?.map(item => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.variant || '-'}</td>
                  <td>${item.size || '-'}</td>
                  <td>${item.quantity}</td>
                  <td>€${item.price.toFixed(2)}</td>
                  <td>€${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('') || ''}
            </tbody>
          </table>

          <div class="section" style="margin-top: 30px; text-align: right;">
            <h2>Total: €${selectedOrder.totalAmount.toFixed(2)}</h2>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'preparing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-grey-100 text-grey-700';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-[32px]">
        <h1 className="text-[28px] md:text-[32px] font-bold text-foreground uppercase mb-[24px]">Orders Management</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-border p-[20px] shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-grey-40" />
              <input
                type="text"
                placeholder="Search by customer name or order #"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-[44px] pl-[40px] pr-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-[80px]">
            <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
            <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-[80px] text-grey-40 text-[14px]">
            No orders found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-grey-10 border-b border-border">
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Order #</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Customer</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Phone</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Amount</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Status</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Date</th>
                  <th className="text-left py-[16px] px-[20px] text-[12px] font-bold text-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-grey-10 transition-colors">
                    <td className="py-[16px] px-[20px] text-[14px] font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="py-[16px] px-[20px] text-[14px] text-foreground">
                      {order.customerName}
                    </td>
                    <td className="py-[16px] px-[20px] text-[14px] text-grey-40">
                      {order.customerPhone}
                    </td>
                    <td className="py-[16px] px-[20px] text-[14px] font-bold text-foreground">
                      €{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-[16px] px-[20px]">
                      <span className={`px-[12px] py-[4px] rounded text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-[16px] px-[20px] text-[14px] text-grey-40">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-[16px] px-[20px]">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-[8px] hover:bg-grey-20 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-[16px] h-[16px]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-[20px] bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-[800px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border p-[24px] flex items-center justify-between z-10">
              <h2 className="text-[20px] font-bold uppercase">Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-[8px] hover:bg-grey-10 rounded transition-colors">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            <div className="p-[24px]">
              {/* Customer Details */}
              <div className="mb-[32px]">
                <h3 className="text-[16px] font-bold uppercase mb-[16px]">Customer Details</h3>
                <div className="bg-grey-10 rounded-lg p-[20px] space-y-[12px]">
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Name:</span>
                    <div className="text-[14px] font-medium text-foreground">{selectedOrder.customerName}</div>
                  </div>
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Phone:</span>
                    <div className="text-[14px] font-medium text-foreground">{selectedOrder.customerPhone}</div>
                  </div>
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Address:</span>
                    <div className="text-[14px] font-medium text-foreground">{selectedOrder.customerAddress}</div>
                  </div>
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Status:</span>
                    <div className="mt-[8px]">
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="px-[12px] py-[6px] border border-border rounded text-[12px] font-medium"
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Verified:</span>
                    <div className="text-[14px] font-medium text-foreground">{selectedOrder.isVerified ? 'Yes' : 'No'}</div>
                  </div>
                  <div>
                    <span className="text-[12px] text-grey-40 uppercase font-medium">Team Confirmed:</span>
                    <div className="text-[14px] font-medium text-foreground">{selectedOrder.isConfirmedByTeam ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-[32px]">
                <h3 className="text-[16px] font-bold uppercase mb-[16px]">Order Items</h3>
                <div className="space-y-[12px]">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-[16px] p-[16px] bg-grey-10 rounded-lg">
                      <img src={item.imageUrl} alt={item.productName} className="w-[60px] h-[60px] object-cover rounded" />
                      <div className="flex-1">
                        <div className="text-[14px] font-bold text-foreground">{item.productName}</div>
                        {(item.variant || item.size) && (
                          <div className="text-[12px] text-grey-40 mt-[4px]">
                            {item.variant && <span>{item.variant}</span>}
                            {item.variant && item.size && <span> • </span>}
                            {item.size && <span>Size: {item.size}</span>}
                          </div>
                        )}
                        <div className="text-[12px] text-grey-40 mt-[4px]">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-[16px] font-bold text-foreground">€{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-border pt-[20px] mb-[24px]">
                <div className="flex justify-between items-center">
                  <span className="text-[18px] font-bold uppercase">Total</span>
                  <span className="text-[24px] font-bold text-foreground">€{selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-[12px]">
                {!selectedOrder.isConfirmedByTeam && (
                  <button
                    onClick={() => confirmOrder(selectedOrder.id)}
                    className="flex-1 h-[48px] flex items-center justify-center gap-[8px] bg-primary text-primary-foreground rounded-lg font-bold text-[14px] uppercase hover:opacity-90 transition-opacity"
                  >
                    <CheckCircle className="w-[16px] h-[16px]" />
                    Confirm Order
                  </button>
                )}
                <button
                  onClick={printOrder}
                  className="flex-1 h-[48px] flex items-center justify-center gap-[8px] bg-grey-20 text-foreground rounded-lg font-bold text-[14px] uppercase hover:bg-grey-40 transition-colors"
                >
                  <Printer className="w-[16px] h-[16px]" />
                  Print Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};