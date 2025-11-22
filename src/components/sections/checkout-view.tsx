'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const CheckoutView = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    
    setIsProcessing(false);
    router.push('/history');
  };

  const subtotal = 29.99;
  const shipping = 5.00;
  const total = subtotal + shipping;

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
            {/* Contact Information */}
            <div className="p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">
                Contact Information
              </h2>
              <div className="space-y-[16px]">
                <div>
                  <label htmlFor="email" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">
                Shipping Address
              </h2>
              <div className="space-y-[16px]">
                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <label htmlFor="firstName" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="address" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <label htmlFor="city" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="country" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="India">India</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[18px] font-bold text-foreground uppercase mb-[24px]">
                Payment Information
              </h2>
              <div className="space-y-[16px]">
                <div>
                  <label htmlFor="cardNumber" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    required
                    maxLength={19}
                    placeholder="1234 5678 9012 3456"
                    className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-[16px]">
                  <div>
                    <label htmlFor="expiryDate" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-10px font-bold text-grey-40 uppercase mb-[8px]">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength={3}
                      placeholder="123"
                      className="w-full h-[48px] px-[16px] bg-background border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-[120px] p-[24px] bg-white rounded-lg border border-border">
              <h2 className="text-[20px] font-bold text-foreground uppercase mb-[24px]">
                Summary
              </h2>

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
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
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