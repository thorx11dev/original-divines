'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/contexts/cart-context';
import { useUser } from '@/contexts/user-context';

export const CheckoutView = () => {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user } = useUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  
  const [verificationStep, setVerificationStep] = useState<'form' | 'verify'>('form');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const shipping = 5.00;
  const total = subtotal + shipping;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user]);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [resendTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createOrder = async (): Promise<number | null> => {
    try {
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const orderData = {
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        orderNumber,
        totalAmount: total,
        items: items.map(item => ({
          productId: parseInt(item.productId) || 0,
          productName: item.name,
          variant: item.variant || null,
          size: item.size || null,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.image,
        })),
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const data = await response.json();
        return data.id;
      }
      
      return null;
    } catch (err) {
      console.error('Failed to create order:', err);
      return null;
    }
  };

  const sendVerificationCode = async () => {
    setError('');
    setIsSendingCode(true);

    try {
      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone }),
      });

      if (response.ok) {
        const data = await response.json();
        setSentCode(data.code); // For testing purposes
        setCanResend(false);
        setResendTimer(60);
        return true;
      } else {
        setError('Failed to send verification code. Please try again.');
        return false;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      return false;
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      // Create the order first
      const newOrderId = await createOrder();
      
      if (!newOrderId) {
        setError('Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      setOrderId(newOrderId);

      // Send verification code
      const codeSent = await sendVerificationCode();
      
      if (codeSent) {
        setVerificationStep('verify');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          code: verificationCode,
          orderId: orderId,
        }),
      });

      if (response.ok) {
        clearCart();
        router.push('/history');
      } else {
        const data = await response.json();
        setError(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setError('');
    const success = await sendVerificationCode();
    
    if (success) {
      setVerificationCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div 
          className="text-center transition-all duration-800 ease-expo-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)'
          }}
        >
          <h2 className="text-[24px] font-bold text-foreground uppercase mb-[16px]">
            Your cart is empty
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-[32px] py-[16px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-300"
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
        <div 
          className="mb-[40px] transition-all duration-800 ease-expo-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
          }}
        >
          <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight uppercase">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[40px]">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-[32px]">
            {verificationStep === 'form' ? (
              <form onSubmit={handleSubmit}>
                {/* Delivery Information */}
                <div 
                  className="p-[24px] bg-white rounded-lg border border-border transition-all duration-800 ease-expo-out hover:shadow-md"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
                    transitionDelay: '100ms'
                  }}
                >
                  <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">
                    Delivery Information
                  </h2>
                  <div className="space-y-[16px]">
                    <div>
                      <label htmlFor="name" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                        placeholder="Your full name"
                      />
                    </div>
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
                        className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
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
                        className="w-full px-[16px] py-[12px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary resize-none transition-all duration-300"
                        placeholder="Enter your complete delivery address"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="mt-[16px] p-[16px] bg-red-50 border border-red-200 rounded text-[14px] text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full mt-[24px] h-[52px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Continue to Verification'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode}>
                {/* Verification Step */}
                <div 
                  className="p-[24px] bg-white rounded-lg border border-border transition-all duration-800 ease-expo-out hover:shadow-md"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
                    transitionDelay: '100ms'
                  }}
                >
                  <h2 className="text-[18px] font-bold text-foreground uppercase mb-[16px]">
                    Verify Your Phone
                  </h2>
                  <p className="text-[14px] text-grey-40 mb-[24px]">
                    We've sent a verification code to <strong>{formData.phone}</strong>. Please enter it below to complete your order.
                  </p>

                  {/* For testing - show the code */}
                  {sentCode && (
                    <div className="mb-[16px] p-[16px] bg-blue-50 border border-blue-200 rounded">
                      <div className="text-[12px] text-blue-600 font-medium uppercase mb-[4px]">
                        Test Mode - Your Code:
                      </div>
                      <div className="text-[24px] font-bold text-blue-900 tracking-wider">
                        {sentCode}
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="verificationCode" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] text-center tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                    />
                  </div>

                  {error && (
                    <div className="mt-[16px] p-[16px] bg-red-50 border border-red-200 rounded text-[14px] text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing || verificationCode.length !== 6}
                    className="w-full mt-[24px] h-[52px] bg-primary text-primary-foreground text-12px font-bold uppercase rounded-lg hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Verifying...' : 'Verify & Complete Order'}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={!canResend || isSendingCode}
                    className="w-full mt-[12px] h-[52px] bg-secondary text-secondary-foreground text-12px font-bold uppercase rounded-lg hover:bg-grey-20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode 
                      ? 'Sending...' 
                      : canResend 
                      ? 'Resend Code' 
                      : `Resend in ${resendTimer}s`
                    }
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div 
              className="sticky top-[120px] p-[24px] bg-white rounded-lg border border-border transition-all duration-800 ease-expo-out hover:shadow-lg"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '200ms'
              }}
            >
              <h2 className="text-[20px] font-bold text-foreground uppercase mb-[24px]">
                Order Summary
              </h2>

              {/* Order Items */}
              <div className="mb-[24px] pb-[24px] border-b border-border max-h-[300px] overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-[12px] mb-[16px] last:mb-0">
                    <div className="relative w-[60px] h-[60px] flex-shrink-0 rounded overflow-hidden bg-grey-10 group">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
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

              {verificationStep === 'form' && (
                <button
                  type="button"
                  onClick={() => router.push('/cart')}
                  className="w-full h-[52px] bg-secondary text-secondary-foreground text-12px font-bold uppercase rounded-lg hover:bg-grey-20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Back to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};