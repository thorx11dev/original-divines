'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';

export const CheckoutView = () => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Clear cart after successful order
    clearCart();
    setIsProcessing(false);
    router.push('/history');
  };

  const shipping = 5.00;
  const total = subtotal + shipping;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-[24px] font-bold text-foreground uppercase mb-[16px]">
            Your cart is empty
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
        <div className="mb-[40px]">
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight uppercase">
            Checkout
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-[40px]">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-[32px]">
            {/* Delivery Information */}
            <div className="p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">
                Delivery Information
              </h2>
              <div className="space-y-[16px]">
                <div>
                  <label htmlFor="phone" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Delivery Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-[16px] py-[12px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Enter your complete delivery address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-[120px] p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[20px] font-bold text-foreground uppercase mb-[24px]">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="mb-[24px] pb-[24px] border-b border-border max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-[12px] mb-[16px] last:mb-0">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden bg-grey-10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="text-[12px] font-bold text-foreground uppercase line-clamp-1">
                        {item.name}
                      </div>
                      {(item.variant || item.size) && (
                        <div className="text-[10px] text-grey-40 mt-[2px]">
                          {item.variant && <span>{item.variant}</span>}
                          {item.variant && item.size && <span> • </span>}
                          {item.size && <span>Size {item.size}</span>}
                        </div>
                      )}
                      <div className="flex justify-between items-center mt-[4px]">
                        <span className="text-[10px] text-grey-40">Qty: {item.quantity}</span>
                        <span className="text-[12px] font-medium text-foreground">€{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-[16px] mb-[24px]">
                <div className="flex justify-between text-[14px]">
                  <span className="text-grey-40">Subtotal</span>
                  <span className="font-medium text-foreground">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[14px]">
                  <span className="text-grey-40">Shipping</span>
                  <span className="font-medium text-foreground">€{shipping.toFixed(2)}</span>
                </div>
                <div className="pt-[16px] border-t border-border">
                  <div className="flex justify-between text-[18px] font-bold">
                    <span className="text-foreground uppercase">Total</span>
                    <span className="text-foreground">€{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-[52px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Complete Order'}
              </button>

              <button
                type="button"
                onClick={() => router.push('/cart')}
                className="w-full mt-[12px] h-[52px] bg-secondary text-secondary-foreground text-12px font-bold uppercase rounded-lg hover:bg-grey-20 transition-colors"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};