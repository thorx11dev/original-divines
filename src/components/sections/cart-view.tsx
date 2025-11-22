'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Plus, Minus, X } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';

export const CartView = () => {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  const shipping = 5.00;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
        <div className="mb-[40px]">
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight uppercase">
            Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-[80px]">
            <div className="text-[20px] font-medium text-grey-40 mb-[24px] uppercase">
              Your cart is empty
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px]">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-[24px]">
              {items.map(item => (
                <div
                  key={item.id}
                  className="flex gap-[16px] md:gap-[24px] p-[16px] md:p-[24px] bg-white rounded-lg border border-border"
                >
                  {/* Product Image */}
                  <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] flex-shrink-0 rounded overflow-hidden bg-grey-10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-[16px] mb-[8px]">
                        <h3 className="text-[16px] md:text-[18px] font-bold text-foreground uppercase">
                          {item.name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-grey-40 hover:text-foreground transition-colors p-[4px]"
                          aria-label="Remove item"
                        >
                          <X className="w-[20px] h-[20px]" />
                        </button>
                      </div>

                      {(item.variant || item.size) && (
                        <div className="flex gap-[12px] mb-[12px]">
                          {item.variant && (
                            <span className="text-10px font-medium text-grey-40 uppercase">
                              {item.variant}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-10px font-medium text-grey-40 uppercase">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="text-[18px] md:text-[20px] font-bold text-foreground">
                        €{item.price.toFixed(2)}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-[12px] mt-[16px]">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-[36px] h-[36px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-[14px] h-[14px]" />
                      </button>
                      <div className="w-[50px] h-[36px] flex items-center justify-center bg-white border border-border rounded text-[14px] font-medium">
                        {item.quantity}
                      </div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-[36px] h-[36px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-[120px] p-[24px] bg-white rounded-lg border border-border">
                <h2 className="text-[20px] font-bold text-foreground uppercase mb-[24px]">
                  Summary
                </h2>

                <div className="space-y-[16px] mb-[24px]">
                  <div className="flex justify-between text-[14px]">
                    <span className="text-grey-40">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
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
                  onClick={handleCheckout}
                  className="w-full h-[52px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push('/')}
                  className="w-full mt-[12px] h-[52px] bg-secondary text-secondary-foreground text-12px font-bold uppercase rounded-lg hover:bg-grey-20 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};