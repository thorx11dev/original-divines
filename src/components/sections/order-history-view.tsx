'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, Package } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
}

export const OrderHistoryView = () => {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const orders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 34.99,
      trackingNumber: 'TRK123456789',
      items: [
        {
          id: 'airpod-case',
          name: 'AIRPOD CASE',
          price: 29.99,
          quantity: 1,
          image: 'https://image.mux.com/vcxpI5VJy2Ml01fZVB7oQnCPYmm98qPN4101vxLpluz98/thumbnail.jpg?time=0',
        },
      ],
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'delivered',
      total: 89.98,
      trackingNumber: 'TRK987654321',
      items: [
        {
          id: 'hoodie-tour',
          name: 'Hoodie Tour',
          price: 79.99,
          quantity: 1,
          image: 'https://image.mux.com/KlS2dZeTHUmD95ZbE2MZQQjFRj4WwSwJjVxBGFxvLDw/thumbnail.jpg?time=0',
        },
      ],
    },
    {
      id: 'ORD-2023-125',
      date: '2023-12-20',
      status: 'delivered',
      total: 149.97,
      trackingNumber: 'TRK456789123',
      items: [
        {
          id: 'tee-shirt-tour',
          name: 'Tee shirt Tour',
          price: 49.99,
          quantity: 3,
          image: 'https://image.mux.com/r6mt2OMB5frGJccMf4XZ7bf01bebapKbVHK3PlV6memc/thumbnail.jpg?time=0',
        },
      ],
    },
  ];

  const toggleOrder = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-chart-2 bg-chart-2/10';
      case 'shipped':
        return 'text-chart-4 bg-chart-4/10';
      case 'processing':
        return 'text-chart-1 bg-chart-1/10';
      case 'cancelled':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-grey-40 bg-grey-10';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

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
        </div>

        {orders.length === 0 ? (
          <div 
            className="flex flex-col items-center justify-center py-[80px] bg-white rounded-lg border border-border transition-all duration-800 ease-expo-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.95)'
            }}
          >
            <Package className="w-[64px] h-[64px] text-grey-40 mb-[16px]" />
            <div className="text-[20px] font-medium text-grey-40 mb-[8px] uppercase">
              No Orders
            </div>
            <p className="text-[14px] text-grey-40 text-center max-w-[400px]">
              You haven't placed any orders yet. Discover our products and place your first order!
            </p>
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
                        {order.id}
                      </h3>
                      <span
                        className={`px-[12px] py-[4px] text-10px font-bold uppercase rounded transition-all duration-300 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-[16px] text-[14px] text-grey-40">
                      <span>{formatDate(order.date)}</span>
                      <span>•</span>
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="font-medium text-foreground">€{order.total.toFixed(2)}</span>
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
                    <div className="space-y-[16px] mb-[24px]">
                      {order.items.map(item => (
                        <div key={item.id} className="flex gap-[16px]">
                          <div className="relative w-[80px] h-[80px] flex-shrink-0 rounded overflow-hidden bg-grey-10 group">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <h4 className="text-[14px] md:text-[16px] font-bold text-foreground uppercase mb-[4px]">
                              {item.name}
                            </h4>
                            <div className="flex items-center gap-[12px] text-[14px]">
                              <span className="text-grey-40">Qty: {item.quantity}</span>
                              <span className="text-grey-40">•</span>
                              <span className="font-medium text-foreground">€{item.price.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tracking Number */}
                    {order.trackingNumber && (
                      <div className="pt-[16px] border-t border-border">
                        <div className="text-10px font-bold text-grey-40 uppercase mb-[8px]">
                          Tracking Number
                        </div>
                        <div className="text-[14px] font-medium text-foreground">
                          {order.trackingNumber}
                        </div>
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