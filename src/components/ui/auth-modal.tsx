'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: { id: number; name: string; phone: string; address: string }) => void;
}

export const AuthModal = ({ isOpen, onClose, onAuthenticated }: AuthModalProps) => {
  const [step, setStep] = useState<'phone' | 'register'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  if (!isOpen) return null;

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Check if user exists
      const response = await fetch(`/api/users?phone=${encodeURIComponent(phone)}`);
      
      if (response.ok) {
        const user = await response.json();
        onAuthenticated(user);
        resetForm();
      } else if (response.status === 404) {
        // User doesn't exist, move to registration
        setStep('register');
      } else {
        setError('Failed to check phone number. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: phone,
          address: formData.address,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        onAuthenticated(user);
        resetForm();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create account. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setFormData({ name: '', address: '' });
    setError('');
    onClose();
  };

  const handleClose = () => {
    resetForm();
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-[20px] bg-black/50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg max-w-[500px] w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border p-[24px] flex items-center justify-between">
          <h2 className="text-[20px] font-bold uppercase">
            {step === 'phone' ? 'Sign In' : 'Create Account'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-[8px] hover:bg-grey-10 rounded transition-colors"
          >
            <X className="w-[20px] h-[20px]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-[24px]">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-[20px]">
              <div className="text-[14px] text-grey-40 mb-[24px]">
                Enter your phone number to continue. We'll check if you have an existing account.
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full h-[48px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="p-[16px] bg-red-50 border border-red-200 rounded text-[14px] text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !phone.trim()}
                className="w-full h-[52px] bg-primary text-primary-foreground text-[12px] font-bold uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Checking...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-[20px]">
              <div className="text-[14px] text-grey-40 mb-[24px]">
                We couldn't find an account with this phone number. Let's create one!
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  disabled
                  className="w-full h-[48px] px-[16px] border border-border rounded text-[14px] bg-grey-10 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full h-[48px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">
                  Delivery Address
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={4}
                  placeholder="Enter your complete delivery address"
                  className="w-full px-[16px] py-[12px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {error && (
                <div className="p-[16px] bg-red-50 border border-red-200 rounded text-[14px] text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-[12px]">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 h-[52px] bg-grey-20 text-foreground text-[12px] font-bold uppercase rounded-lg hover:bg-grey-40 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.name.trim() || !formData.address.trim()}
                  className="flex-1 h-[52px] bg-primary text-primary-foreground text-[12px] font-bold uppercase rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
