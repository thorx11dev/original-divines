'use client';

import React, { useState, useRef, useEffect, SyntheticEvent } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  media: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
  };
};

const products: Product[] = [
  { id: 'tournee', name: 'Tour', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/e855f6d9c20c767e90fbc7026ecaccdac5e17e59-1980x1980-2.jpg' } },
  { id: 'tee-shirt-tour', name: 'Tour T-Shirt', media: { type: 'video', src: 'https://stream.mux.com/r6mt2OMB5frGJccMf4XZ7bf01bebapKbVHK3PlV6memc/low.mp4', poster: 'https://image.mux.com/r6mt2OMB5frGJccMf4XZ7bf01bebapKbVHK3PlV6memc/thumbnail.jpg?time=0' } },
  { id: 'hoodie-tour', name: 'Tour Hoodie', media: { type: 'video', src: 'https://stream.mux.com/KlS2dZeTHUmD95ZbE2MZQQjFRj4WwSwJjVxBGFxvLDw/low.mp4', poster: 'https://image.mux.com/KlS2dZeTHUmD95ZbE2MZQQjFRj4WwSwJjVxBGFxvLDw/thumbnail.jpg?time=0' } },
  { id: 'recording-session', name: 'Recording Session', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/88c4ed42a794b44394f0f908a44390c3067a0e90-738x738-5.jpg' } },
  { id: 'beyah', name: 'BĒYĀH', media: { type: 'video', src: 'https://stream.mux.com/BV02kdcZYk01eARcxM4aANa9008spyYEvyi4MeHqzT01uQ8/low.mp4', poster: 'https://image.mux.com/BV02kdcZYk01eARcxM4aANa9008spyYEvyi4MeHqzT01uQ8/thumbnail.jpg?time=0' } },
  { id: 'k7', name: 'Cassette Tape', media: { type: 'video', src: 'https://stream.mux.com/d9eXV1k4dR8f4ZFSNHyI7apC0246mivkIONgFvjPCBeA/low.mp4', poster: 'https://image.mux.com/d9eXV1k4dR8f4ZFSNHyI7apC0246mivkIONgFvjPCBeA/thumbnail.jpg?time=0' } },
  { id: 'hoodie-velours', name: 'Velvet Hoodie', media: { type: 'video', src: 'https://stream.mux.com/1G015KYfnDnLbJOJe1WYDdPTjkAMLGUCT02l017MMc6jK4/low.mp4', poster: 'https://image.mux.com/1G015KYfnDnLbJOJe1WYDdPTjkAMLGUCT02l017MMc6jK4/thumbnail.jpg?time=0' } },
  { id: 'tee-shirt-reflectif', name: 'Reflective T-Shirt', media: { type: 'video', src: 'https://stream.mux.com/JQNMSDc13XPMrkDrTk013uTKPk8lsy99yRzgU6r8Sapw/low.mp4', poster: 'https://image.mux.com/JQNMSDc13XPMrkDrTk013uTKPk8lsy99yRzgU6r8Sapw/thumbnail.jpg?time=0' } },
  { id: 'casquette-washed-black', name: 'Washed Black Cap', media: { type: 'video', src: 'https://stream.mux.com/P00EI2KLwD1EboQY3J7eBqgOAlvzBhTnScwHHEpS6Tzs/low.mp4', poster: 'https://image.mux.com/P00EI2KLwD1EboQY3J7eBqgOAlvzBhTnScwHHEpS6Tzs/thumbnail.jpg?time=0' } },
  { id: 'porte-clef', name: 'Keychain', media: { type: 'video', src: 'https://stream.mux.com/cL5YVWMI7ywFCX69l44nGDb29E3Rt3LToOvA9Kv3ZNQ/low.mp4', poster: 'https://image.mux.com/cL5YVWMI7ywFCX69l44nGDb29E3Rt3LToOvA9Kv3ZNQ/thumbnail.jpg?time=0' } },
  { id: 'airpod-case', name: 'AirPod Case', media: { type: 'video', src: 'https://stream.mux.com/vcxpI5VJy2Ml01fZVB7oQnCPYmm98qPN4101vxLpluz98/low.mp4', poster: 'https://image.mux.com/vcxpI5VJy2Ml01fZVB7oQnCPYmm98qPN4101vxLpluz98/thumbnail.jpg?time=0' } },
  { id: 'affiche-embossee', name: 'Embossed Poster', media: { type: 'video', src: 'https://stream.mux.com/OwYKc4Toxm2WneNFj402CyULKx7JnEFJ8mWEPtloFpgQ/low.mp4', poster: 'https://image.mux.com/OwYKc4Toxm2WneNFj402CyULKx7JnEFJ8mWEPtloFpgQ/thumbnail.jpg?time=0' } },
  { id: 'jai-menti', name: "I LIED", media: { type: 'video', src: 'https://stream.mux.com/By015rSTFmeCEu62GkMcFC9vAx6SDePgUJl8HcMKbO008/low.mp4', poster: 'https://image.mux.com/By015rSTFmeCEu62GkMcFC9vAx6SDePgUJl8HcMKbO008/thumbnail.jpg?time=0' } },
  { id: 'tee-shirt-beyah-blanc', name: 'BĒYĀH White T-Shirt', media: { type: 'video', src: 'https://stream.mux.com/bZAr01RQ7fHdrR6k01sfhYzyfRvyVFofq7btB00KVXE6VI/low.mp4', poster: 'https://image.mux.com/bZAr01RQ7fHdrR6k01sfhYzyfRvyVFofq7btB00KVXE6VI/thumbnail.jpg?time=0' } },
  { id: 'tee-shirt-beyah-bleu', name: 'BĒYĀH Blue T-Shirt', media: { type: 'video', src: 'https://stream.mux.com/G1bqF8lyx4vfsxOiUz00BfiuWcqS9suUIRh01SCKqzhvg/low.mp4', poster: 'https://image.mux.com/G1bqF8lyx4vfsxOiUz00BfiuWcqS9suUIRh01SCKqzhvg/thumbnail.jpg?time=0' } },
  { id: 'hoodie-beyah-noir', name: 'BĒYĀH Black Hoodie', media: { type: 'video', src: 'https://stream.mux.com/vNoVF2sAC000202rLxKDITGbu3cPa3RXSsUugYTyYOcJcU/low.mp4', poster: 'https://image.mux.com/vNoVF2sAC000202rLxKDITGbu3cPa3RXSsUugYTyYOcJcU/thumbnail.jpg?time=0' } },
  { id: 'vinyle-qalf', name: 'QALF Vinyl', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_3.png' } },
  { id: 'vinyle-ipseite', name: 'Ipséité Vinyl', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_4.png' } },
  { id: 'vinyle-batterie-faible', name: 'Low Battery Vinyl', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_6.png' } },
  { id: 'vinyle-lithopedion', name: 'Lithopédion Vinyl', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_7.png' } },
  { id: 'vinyle-ipseite-live', name: 'Ipséité LIVE Vinyl', media: { type: 'video', src: 'https://stream.mux.com/h3021Atn26aNk2xxl6VRag3IgvhLLmWNoGJYuSG01KjNQ/low.mp4', poster: 'https://image.mux.com/h3021Atn26aNk2xxl6VRag3IgvhLLmWNoGJYuSG01KjNQ/thumbnail.jpg?time=0' } },
  { id: 'cd-qalf-infinity', name: 'QALF Infinity CD', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_8.png' } },
  { id: 'cd-qalf', name: 'QALF CD', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_9.png' } },
  { id: 'cd-lithopedion', name: 'Lithopédion CD', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_10.png' } },
  { id: 'cd-ipseite', name: 'Ipséité CD', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_11.png' } },
  { id: 'cd-batterie-faible', name: 'Low Battery CD', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_12.png' } },
  { id: 'pack-cd', name: 'CD Pack', media: { type: 'video', src: 'https://stream.mux.com/D6z02Z700vOrTHDnqDJH2mHeAN9u6l6DJ2dXE802I44bto/low.mp4', poster: 'https://image.mux.com/D6z02Z700vOrTHDnqDJH2mHeAN9u6l6DJ2dXE802I44bto/thumbnail.jpg?time=0' } },
  { id: 'pack-vinyles', name: 'Vinyl Pack', media: { type: 'video', src: 'https://stream.mux.com/jO5s00RY80068o56zkC58101CulcR9v5cYtF5LUTjc002Nc/low.mp4', poster: 'https://image.mux.com/jO5s00RY80068o56zkC58101CulcR9v5cYtF5LUTjc002Nc/thumbnail.jpg?time=0' } },
  { id: 'livre-qalf', name: 'QALF Book', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_13.png' } },
  { id: 'livre-qalf-collector', name: 'QALF Collector Book', media: { type: 'image', src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_14.png' } },
];

interface ProductCarouselProps {
  activeIndex: number;
  onProductChange?: (productName: string) => void;
}

const ProductItem = ({ product, index, activeIndex, totalItems }: { product: Product; index: number; activeIndex: number; totalItems: number; }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  
  const offset = index - activeIndex;
  const isActive = offset === 0;
  
  const scale = isActive ? 1 : 0.3;
  const rotation = offset * -20;
  const translateX = offset * 400;
  const translateZ = isActive ? 0 : -800 - (Math.abs(offset) * 200);
  const zIndex = totalItems - Math.abs(offset);
  const opacity = Math.abs(offset) > 2 ? 0 : isActive ? 1 : 0.3;

  const onLoadedData = (e: SyntheticEvent<HTMLVideoElement>) => {
    setIsVideoLoaded(true);
  };

  useEffect(() => {
    if (videoRef.current) {
      // Preload video immediately
      videoRef.current.load();
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);
  
  const handleInteraction = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <li
      id={product.id}
      className="absolute top-0 left-0 select-none transition-all duration-700 ease-out"
      style={{
        transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotation}deg) scale(${scale})`,
        transformStyle: 'preserve-3d',
        zIndex,
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        filter: isActive ? 'none' : 'blur(2px)',
      }}
    >
      <div className="relative aspect-square w-[85vmin]">
        <div 
          className="absolute inset-0 overflow-clip"
          style={{
            borderRadius: '0px',
            background: 'transparent',
          }}
        >
          <button
            className="absolute inset-0 cursor-pointer appearance-none focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-4"
            aria-label={`Open details for ${product.name}`}
            onClick={handleInteraction}
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {product.media.type === 'video' ? (
                <>
                  <video
                    ref={videoRef}
                    src={product.media.src}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    onLoadedData={onLoadedData}
                    className="relative z-0 block w-full h-full object-cover transition-opacity duration-300"
                    style={{
                      opacity: isVideoLoaded ? 1 : 0
                    }}
                  />
                  {!isVideoLoaded && product.media.poster && (
                    <div className="absolute inset-0 z-[2]">
                      <Image
                        src={product.media.poster}
                        alt={`Poster for ${product.name}`}
                        fill
                        className="object-cover"
                        priority={Math.abs(offset) <= 1}
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
                  priority={Math.abs(offset) <= 1}
                />
              )}
            </div>
          </button>
        </div>
      </div>
    </li>
  );
};

export default function ProductCarousel({ activeIndex, onProductChange }: ProductCarouselProps) {
  useEffect(() => {
    if (onProductChange) {
      onProductChange(products[activeIndex]?.name || '');
    }
  }, [activeIndex, onProductChange]);

  return (
    <div className="absolute top-[40%] left-0 w-full h-0">
      <ul 
        className="absolute top-0 left-1/2 w-0 h-0" 
        style={{ 
          perspective: '2000px',
          perspectiveOrigin: 'center center',
        }}
      >
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            index={index}
            activeIndex={activeIndex}
            totalItems={products.length}
          />
        ))}
      </ul>
    </div>
  );
}