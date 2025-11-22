'use client';

import { useState, useRef, useEffect, SyntheticEvent } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from '@/data/products';
import { Plus, Minus } from 'lucide-react';

interface ProductDetailViewProps {
  product: Product;
}

export const ProductDetailView = ({ product }: ProductDetailViewProps) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentPrice = selectedVariant?.price || product.defaultPrice;
  const originalPrice = selectedVariant?.originalPrice || product.defaultOriginalPrice;
  const currentStock = selectedVariant?.stock || product.defaultStock;
  const isAvailable = selectedVariant ? selectedVariant.isAvailable : currentStock > 0;

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
    console.log('Add to cart:', {
      product: product.id,
      variant: selectedVariant?.id,
      size: selectedSize,
      quantity
    });
    // Cart logic will be implemented later
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1400px] px-[20px] md:px-[40px] pt-[120px] pb-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[40px] md:gap-[80px]">
          {/* Left Column - Image Gallery */}
          <div className="relative w-full">
            <div className="sticky top-[120px]">
              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-white">
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
          <div className="flex flex-col gap-[24px]">
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
                  En stock ({currentStock} disponibles)
                </div>
              ) : (
                <div className="text-12px font-bold text-destructive uppercase">
                  En rupture de stock
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
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.isAvailable}
                      className={`
                        px-[20px] py-[12px] text-10px font-bold uppercase rounded
                        transition-all duration-300
                        ${selectedVariant?.id === variant.id
                          ? 'bg-primary text-primary-foreground'
                          : variant.isAvailable
                          ? 'bg-secondary text-secondary-foreground hover:bg-grey-20'
                          : 'bg-grey-10 text-grey-40 cursor-not-allowed opacity-50'
                        }
                      `}
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
                  Taille
                </label>
                <div className="flex flex-wrap gap-[8px]">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`
                        w-[60px] h-[48px] text-10px font-bold uppercase rounded
                        transition-all duration-300
                        ${selectedSize === size
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-grey-20'
                        }
                      `}
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
                Quantité
              </label>
              <div className="flex items-center gap-[12px]">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-[44px] h-[44px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-[16px] h-[16px]" />
                </button>
                <div className="w-[60px] h-[44px] flex items-center justify-center bg-white border border-border rounded text-[14px] font-medium">
                  {quantity}
                </div>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= currentStock}
                  className="w-[44px] h-[44px] flex items-center justify-center bg-secondary rounded hover:bg-grey-20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-[16px] h-[16px]" />
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`
                w-full h-[56px] text-12px font-bold uppercase rounded-lg
                transition-all duration-300
                ${isAvailable
                  ? 'bg-primary text-primary-foreground hover:opacity-90'
                  : 'bg-grey-20 text-grey-40 cursor-not-allowed'
                }
              `}
            >
              {isAvailable ? 'Ajouter au panier' : 'Rupture de stock'}
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
              <span className="px-[12px] py-[6px] bg-grey-20 text-10px font-medium uppercase rounded">
                {product.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
