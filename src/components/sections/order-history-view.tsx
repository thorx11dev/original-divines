'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Package, X } from 'lucide-react';
import { useUser } from '@/contexts/user-context';

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
  createdAt: string;
  items?: OrderItem[];
}

export const OrderHistoryView = () => {
  const router = useRouter();
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<number | null>(null);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch user orders
  useEffect(() => {
    if (user) {
      fetchUserOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserOrders = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?customerPhone=${encodeURIComponent(user.phone)}&limit=50`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      if (response.ok) {
        const data = await response.json();
        // Update the order in the list with full details
        setOrders(prev => prev.map(order => 
          order.id === orderId ? data : order
        ));
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const toggleOrder = (orderId: number) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
        // Fetch full order details when expanding
        const order = orders.find(o => o.id === orderId);
        if (order && !order.items) {
          fetchOrderDetails(orderId);
        }
      }
      return newSet;
    });
  };

  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrderId(orderId);
    
    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (response.ok) {
        // Order cancelled successfully
        fetchUserOrders();
      } else if (data.code === 'ORDER_CONFIRMED') {
        // Order is too late to cancel, redirect to location page
        alert(data.error);
        router.push('/location');
      } else {
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('An error occurred while cancelling the order');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'preparing':
        return 'text-blue-700 bg-blue-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-grey-700 bg-grey-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-[20px]">
        <div className="text-center max-w-[500px]">
          <Package className="w-[64px] h-[64px] text-grey-40 mb-[16px] mx-auto" />
          <h2 className="text-[24px] font-bold text-foreground uppercase mb-[16px]">
            Sign In Required
          </h2>
          <p className="text-[14px] text-grey-40 mb-[24px]">
            Please sign in to view your order history
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1000px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
        <div 
          className="mb-[40px] transition-all duration-800 ease-expo-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
          }}
        >
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight uppercase">
            Order History
          </h1>
          <p className="text-[14px] text-grey-40 mt-[8px]">
            Signed in as: {user.name} ({user.phone})
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-[80px]">
            <div className="text-center">
              <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
              <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Orders...</div>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div 
            className="flex flex-col items-center justify-center py-[80px] bg-white rounded-lg border border-border transition-all duration-800 ease-expo-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)'
            }}
          >
            <Package className="w-[64px] h-[64px] text-grey-40 mb-[16px]" />
            <div className="text-[20px] font-medium text-grey-40 mb-[8px] uppercase">
              No Orders Yet
            </div>
            <p className="text-[14px] text-grey-40 text-center max-w-[400px] mb-[24px]">
              You haven't placed any orders yet. Discover our products and place your first order!
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-[24px]">
            {orders.map((order, idx) => (
              <div
                key={order.id}
                className="bg-white rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-500 ease-expo-out"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
                  transitionDelay: `${idx * 100}ms`
                }}
              >
                {/* Order Header */}
                <button
                  onClick={() => toggleOrder(order.id)}
                  className="w-full p-[20px] md:p-[24px] flex items-center justify-between hover:bg-grey-10/50 transition-colors"
                >
                  <div className="flex-1 text-left">
                    <div className="flex flex-wrap items-center gap-[12px] md:gap-[16px] mb-[8px]">
                      <h3 className="text-[16px] md:text-[18px] font-bold text-foreground uppercase">
                        {order.orderNumber}
                      </h3>
                      <span
                        className={`px-[12px] py-[4px] text-10px font-bold uppercase rounded transition-all duration-300 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      {order.isConfirmedByTeam && (
                        <span className="px-[12px] py-[4px] text-10px font-bold uppercase rounded bg-green-600 text-white">
                          Confirmed
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-[16px] text-[14px] text-grey-40">
                      <span>{formatDate(order.createdAt)}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground">€{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="ml-[16px] transition-transform duration-300">
                    {expandedOrders.has(order.id) ? (
                      <ChevronUp className="w-[24px] h-[24px] text-grey-40" />
                    ) : (
                      <ChevronDown className="w-[24px] h-[24px] text-grey-40" />
                    )}
                  </div>
                </button>

                {/* Order Details */}
                {expandedOrders.has(order.id) && (
                  <div className="border-t border-border p-[20px] md:p-[24px] animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Order Items */}
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-[16px] mb-[24px]">
                        {order.items.map(item => (
                          <div key={item.id} className="flex gap-[16px]">
                            <div className="relative w-[80px] h-[80px] flex-shrink-0 rounded overflow-hidden bg-grey-10 group">
                              <Image
                                src={item.imageUrl}
                                alt={item.productName}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="text-[14px] md:text-[16px] font-bold text-foreground uppercase mb-[4px]">
                                {item.productName}
                              </h4>
                              {(item.variant || item.size) && (
                                <div className="text-[12px] text-grey-40 mb-[4px]">
                                  {item.variant && <span>{item.variant}</span>}
                                  {item.variant && item.size && <span> • </span>}
                                  {item.size && <span>Size: {item.size}</span>}
                                </div>
                              )}
                              <div className="flex items-center gap-[12px] text-[14px]">
                                <span className="text-grey-40">Qty: {item.quantity}</span>
                                <span className="text-grey-40">•</span>
                                <span className="font-medium text-foreground">€{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-[20px] text-grey-40 text-[14px]">
                        Loading order details...
                      </div>
                    )}

                    {/* Delivery Address */}
                    <div className="pt-[16px] border-t border-border mb-[16px]">
                      <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                        Delivery Address
                      </div>
                      <div className="text-[14px] text-foreground">
                        {order.customerAddress}
                      </div>
                    </div>

                    {/* Cancel Button - Only show if not confirmed by team and not already cancelled */}
                    {!order.isConfirmedByTeam && order.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancellingOrderId === order.id}
                        className="w-full h-[48px] flex items-center justify-center gap-[8px] bg-red-600 text-white rounded-lg font-bold text-[12px] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingOrderId === order.id ? (
                          <>
                            <div className="w-[16px] h-[16px] border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <X className="w-[16px] h-[16px]" />
                            Cancel Order
                          </>
                        )}
                      </button>
                    )}

                    {order.isConfirmedByTeam && order.status !== 'cancelled' && (
                      <div className="p-[16px] bg-blue-50 border border-blue-200 rounded text-[14px] text-blue-700">
                        This order has been confirmed and is being prepared. Cancellation is no longer available.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};