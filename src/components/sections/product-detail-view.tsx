'use client';

import { useState, useRef, useEffect, SyntheticEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/data/products';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useUser } from '@/contexts/user-context';
import { AuthModal } from '@/components/ui/auth-modal';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { user, setUser, isAuthenticated } = useUser();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentPrice = selectedVariant?.price || product.defaultPrice;
  const originalPrice = selectedVariant?.originalPrice || product.defaultOriginalPrice;
  const currentStock = selectedVariant?.stock || product.defaultStock;
  const isAvailable = selectedVariant ? selectedVariant.isAvailable : currentStock > 0;

  // Entrance animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (videoRef.current && product.media.type === 'video') {
      videoRef.current.play().catch(() => {});
    }
  }, [product.media.type]);

  const onLoadedData = (e: SyntheticEvent<HTMLVideoElement>) => {
    setIsVideoLoaded(true);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, currentStock)));
  };

  const handleAddToCart = () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    proceedWithAddToCart();
  };

  const proceedWithAddToCart = () => {
    setIsAdding(true);
    
    addItem({
      productId: product.id,
      name: product.name,
      price: currentPrice,
      quantity,
      image: product.media.type === 'video' && product.media.poster 
        ? product.media.poster 
        : product.media.src,
      variant: selectedVariant?.name,
      size: selectedSize || undefined,
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push('/cart');
    }, 500);
  };

  const handleAuthenticated = (userData: { id: number; name: string; phone: string; address: string }) => {
    setUser(userData);
    setShowAuthModal(false);
    // Proceed with adding to cart after authentication
    proceedWithAddToCart();
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1400px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[80px]">
            {/* Left Column - Image Gallery */}
            <div 
              className="relative w-full transition-all duration-800 ease-expo-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
              }}
            >
              <div className="sticky top-[120px]">
                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow duration-500">
                  {product.media.type === 'video' ? (
                    <>
                      <video
                        ref={videoRef}
                        src={product.media.src}
                        loop
                        muted
                        playsInline
                        onLoadedData={onLoadedData}
                        className="w-full h-full object-cover transition-opacity duration-500"
                        style={{
                          opacity: isVideoLoaded ? 1 : 0
                        }}
                      />
                      {!isVideoLoaded && product.media.poster && (
                        <div className="absolute inset-0">
                          <Image
                            src={product.media.poster}
                            alt={product.name}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <Image
                      src={product.media.src}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div 
              className="flex flex-col gap-[24px] transition-all duration-800 ease-expo-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: '100ms'
              }}
            >
              {/* Product Title */}
              <div>
                <h1 className="text-[32px] md:text-[40px] font-bold text-foreground leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-[12px]">
                <div className="text-[28px] md:text-[32px] font-bold text-foreground">
                  €{currentPrice}
                </div>
                {originalPrice && (
                  <div className="text-[20px] text-grey-40 line-through">
                    €{originalPrice}
                  </div>
                )}
              </div>

              {/* Stock Status */}
              <div>
                {isAvailable ? (
                  <div className="text-12px font-medium text-grey-40 uppercase">
                    In Stock ({currentStock} available)
                  </div>
                ) : (
                  <div className="text-12px font-bold text-destructive uppercase">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Variants (for albums) */}
              {product.variants && product.variants.length > 0 && (
                <div className="flex flex-col gap-[12px]">
                  <label className="text-10px font-bold text-grey-40 uppercase">
                    Format
                  </label>
                  <div className="flex flex-wrap gap-[8px]">
                    {product.variants.map((variant, idx) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variant.isAvailable}
                        className={`
                          px-[20px] py-[12px] text-10px font-bold uppercase rounded
                          transition-all duration-300 transform hover:scale-105
                          ${selectedVariant?.id === variant.id
                            ? 'bg-primary text-primary-foreground'
                            : variant.isAvailable
                            ? 'bg-secondary text-secondary-foreground hover:bg-grey-20'
                            : 'bg-grey-10 text-grey-40 cursor-not-allowed opacity-50'
                          }
                        `}
                        style={{
                          transitionDelay: `${idx * 50}ms`
                        }}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes (for clothing) */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-col gap-[12px]">
                  <label className="text-10px font-bold text-grey-40 uppercase">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-[8px]">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`
                          w-[60px] h-[48px] text-10px font-bold uppercase rounded
                          transition-all duration-300 transform hover:scale-105
                          ${selectedSize === size
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-grey-20'
                          }
                        `}
                        style={{
                          transitionDelay: `${idx * 50}ms`
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex flex-col gap-[12px]">
                <label className="text-10px font-bold text-grey-40 uppercase">
                  Quantity
                </label>
                <div className="flex items-center gap-[12px]">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-[44px] h-[44px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-[16px] h-[16px]" />
                  </button>
                  <div className="w-[60px] h-[44px] flex items-center justify-center bg-white border border-border rounded text-[14px] font-medium transition-all duration-300">
                    {quantity}
                  </div>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= currentStock}
                    className="w-[44px] h-[44px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 hover:scale-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-[16px] h-[16px]" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!isAvailable || isAdding}
                className={`
                  w-full h-[56px] text-12px font-bold uppercase rounded-lg
                  transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                  ${isAvailable && !isAdding
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-grey-20 text-grey-40 cursor-not-allowed'
                  }
                `}
              >
                {isAdding ? 'Adding...' : isAvailable ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Description */}
              <div className="pt-[24px] border-t border-border">
                <h2 className="text-12px font-bold text-grey-40 uppercase mb-[16px]">
                  Description
                </h2>
                <p className="text-[16px] leading-relaxed text-foreground">
                  {product.description}
                </p>
              </div>

              {/* Category Badge */}
              <div className="flex gap-[8px]">
                <span className="px-[12px] py-[6px] bg-grey-20 text-10px font-medium uppercase rounded transition-colors duration-300 hover:bg-grey-40 hover:text-white">
                  {product.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={handleAuthenticated}
      />
    </>
  );
};