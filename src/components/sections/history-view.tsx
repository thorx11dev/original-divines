'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@/contexts/user-context';
import { Package, X } from 'lucide-react';

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

export const HistoryView = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, router]);

  const fetchOrders = async () => {
    if (!user?.phone) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?phone=${encodeURIComponent(user.phone)}&limit=100`);
      
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

  const handleCancelOrder = async (orderId: number) => {
    setCancelError('');
    setIsCancelling(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PUT',
      });

      const data = await response.json();

      if (response.ok) {
        // Order cancelled successfully
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }
      } else if (response.status === 400 && data.code === 'ORDER_CONFIRMED') {
        // Team already confirmed - too late to cancel
        setCancelError(data.error);
        // Redirect to location page after 3 seconds
        setTimeout(() => {
          router.push('/location');
        }, 3000);
      } else {
        setCancelError(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      setCancelError('An error occurred. Please try again.');
    } finally {
      setIsCancelling(false);
    }
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
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
              Welcome back, {user?.name}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-[80px]">
              <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
              <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div 
              className="text-center py-[80px] transition-all duration-800 ease-expo-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)'
              }}
            >
              <Package className="w-[64px] h-[64px] text-grey-20 mx-auto mb-[24px]" />
              <div className="text-[20px] font-medium text-grey-40 mb-[24px] uppercase">
                No orders yet
              </div>
              <button
                onClick={() => router.push('/')}
                className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-[20px]">
              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="bg-white rounded-lg border border-border p-[24px] hover:shadow-lg transition-all duration-500 ease-expo-out cursor-pointer"
                  onClick={() => viewOrderDetails(order)}
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transitionDelay: `${idx * 100}ms`
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[16px]">
                    <div>
                      <div className="text-[18px] font-bold text-foreground uppercase">
                        {order.orderNumber}
                      </div>
                      <div className="text-[12px] text-grey-40 mt-[4px]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-[16px]">
                      <span className={`px-[16px] py-[6px] rounded text-[10px] font-bold uppercase ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <div className="text-[20px] font-bold text-foreground">
                        €{order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {order.isVerified && (
                    <div className="text-[10px] text-green-600 font-medium uppercase">
                      ✓ Verified
                    </div>
                  )}

                  {order.isConfirmedByTeam && (
                    <div className="mt-[8px] text-[10px] text-blue-600 font-medium uppercase">
                      ✓ Confirmed by Team - Being Prepared
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-[20px] bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-[800px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border p-[24px] flex items-center justify-between">
              <h2 className="text-[20px] font-bold uppercase">Order {selectedOrder.orderNumber}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-[8px] hover:bg-grey-10 rounded transition-colors">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            <div className="p-[24px]">
              {/* Order Status */}
              <div className="mb-[32px]">
                <div className="flex items-center justify-between mb-[16px]">
                  <h3 className="text-[16px] font-bold uppercase">Status</h3>
                  <span className={`px-[16px] py-[6px] rounded text-[10px] font-bold uppercase ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                {selectedOrder.isConfirmedByTeam && (
                  <div className="p-[16px] bg-blue-50 border border-blue-200 rounded text-[14px] text-blue-700">
                    Your order is being prepared by our team.
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="mb-[32px]">
                <h3 className="text-[16px] font-bold uppercase mb-[16px]">Delivery Details</h3>
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
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-[32px]">
                <h3 className="text-[16px] font-bold uppercase mb-[16px]">Order Items</h3>
                <div className="space-y-[12px]">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-[16px] p-[16px] bg-grey-10 rounded-lg">
                      <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                      </div>
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

              {/* Cancel Order Button */}
              {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                <div>
                  {cancelError && (
                    <div className="mb-[16px] p-[16px] bg-red-50 border border-red-200 rounded text-[14px] text-red-700">
                      {cancelError}
                      {cancelError.includes('too late') && (
                        <div className="mt-[8px] font-medium">
                          Redirecting to location page...
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={isCancelling}
                    className="w-full h-[48px] bg-red-600 text-white rounded-lg font-bold text-[14px] uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
