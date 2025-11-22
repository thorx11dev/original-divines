export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isAvailable: boolean;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: 'album' | 'clothing' | 'accessories' | 'book';
  media: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
  };
  additionalImages?: string[];
  variants?: ProductVariant[];
  sizes?: string[];
  defaultPrice: number;
  defaultOriginalPrice?: number;
  defaultStock: number;
};

export const products: Product[] = [
  {
    id: 'tournee',
    name: 'Tour',
    description: 'Official tour poster. High quality print on premium paper.',
    category: 'accessories',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/e855f6d9c20c767e90fbc7026ecaccdac5e17e59-1980x1980-2.jpg'
    },
    defaultPrice: 25,
    defaultStock: 50
  },
  {
    id: 'tee-shirt-tour',
    name: 'Tour T-shirt',
    description: 'Official tour t-shirt. 100% premium cotton with high quality screen printing.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/r6mt2OMB5frGJccMf4XZ7bf01bebapKbVHK3PlV6memc/low.mp4',
      poster: 'https://image.mux.com/r6mt2OMB5frGJccMf4XZ7bf01bebapKbVHK3PlV6memc/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 45,
    defaultOriginalPrice: 55,
    defaultStock: 120
  },
  {
    id: 'hoodie-tour',
    name: 'Tour Hoodie',
    description: 'Official tour hoodie. Heavy cotton 400g/m² with fleece interior. Comfortable oversize fit.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/KlS2dZeTHUmD95ZbE2MZQQjFRj4WwSwJjVxBGFxvLDw/low.mp4',
      poster: 'https://image.mux.com/KlS2dZeTHUmD95ZbE2MZQQjFRj4WwSwJjVxBGFxvLDw/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 85,
    defaultOriginalPrice: 95,
    defaultStock: 80
  },
  {
    id: 'recording-session',
    name: 'Recording Session',
    description: 'Exclusive photo from recording sessions. Limited edition signed and numbered print.',
    category: 'accessories',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/88c4ed42a794b44394f0f908a44390c3067a0e90-738x738-5.jpg'
    },
    defaultPrice: 40,
    defaultStock: 25
  },
  {
    id: 'beyah',
    name: 'BĒYĀH',
    description: 'BĒYĀH Album - A timeless work capturing the essence of the artist.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/BV02kdcZYk01eARcxM4aANa9008spyYEvyi4MeHqzT01uQ8/low.mp4',
      poster: 'https://image.mux.com/BV02kdcZYk01eARcxM4aANa9008spyYEvyi4MeHqzT01uQ8/thumbnail.jpg?time=0'
    },
    variants: [
      { id: 'cd', name: 'CD', price: 18, stock: 200, isAvailable: true },
      { id: 'vinyl', name: 'VINYL', price: 32, stock: 0, isAvailable: false },
      { id: 'bundle', name: 'BUNDLE (CD + VINYL)', price: 45, originalPrice: 50, stock: 50, isAvailable: true }
    ],
    defaultPrice: 18,
    defaultStock: 200
  },
  {
    id: 'k7',
    name: 'Cassette',
    description: 'Collector cassette tape. Authentic vintage format with booklet included.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/d9eXV1k4dR8f4ZFSNHyI7apC0246mivkIONgFvjPCBeA/low.mp4',
      poster: 'https://image.mux.com/d9eXV1k4dR8f4ZFSNHyI7apC0246mivkIONgFvjPCBeA/thumbnail.jpg?time=0'
    },
    defaultPrice: 15,
    defaultStock: 150
  },
  {
    id: 'hoodie-velours',
    name: 'Velvet Hoodie',
    description: 'Premium velvet hoodie. Soft and luxurious texture with detailed embroidery.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/1G015KYfnDnLbJOJe1WYDdPTjkAMLGUCT02l017MMc6jK4/low.mp4',
      poster: 'https://image.mux.com/1G015KYfnDnLbJOJe1WYDdPTjkAMLGUCT02l017MMc6jK4/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 95,
    defaultOriginalPrice: 110,
    defaultStock: 60
  },
  {
    id: 'tee-shirt-reflectif',
    name: 'Reflective T-shirt',
    description: 'T-shirt with reflective print. Unique design visible in the dark.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/JQNMSDc13XPMrkDrTk013uTKPk8lsy99yRzgU6r8Sapw/low.mp4',
      poster: 'https://image.mux.com/JQNMSDc13XPMrkDrTk013uTKPk8lsy99yRzgU6r8Sapw/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 50,
    defaultStock: 100
  },
  {
    id: 'casquette-washed-black',
    name: 'Washed Black Cap',
    description: 'Black washed effect cap. Vintage cotton with adjustable fit.',
    category: 'accessories',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/P00EI2KLwD1EboQY3J7eBqgOAlvzBhTnScwHHEpS6Tzs/low.mp4',
      poster: 'https://image.mux.com/P00EI2KLwD1EboQY3J7eBqgOAlvzBhTnScwHHEpS6Tzs/thumbnail.jpg?time=0'
    },
    defaultPrice: 35,
    defaultStock: 200
  },
  {
    id: 'porte-clef',
    name: 'Keychain',
    description: 'Collector metal keychain. Exclusive design with premium finish.',
    category: 'accessories',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/cL5YVWMI7ywFCX69l44nGDb29E3Rt3LToOvA9Kv3ZNQ/low.mp4',
      poster: 'https://image.mux.com/cL5YVWMI7ywFCX69l44nGDb29E3Rt3LToOvA9Kv3ZNQ/thumbnail.jpg?time=0'
    },
    defaultPrice: 12,
    defaultStock: 300
  },
  {
    id: 'airpod-case',
    name: 'AIRPOD CASE',
    description: 'AirPods case with exclusive design. Complete protection in premium silicone.',
    category: 'accessories',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/vcxpI5VJy2Ml01fZVB7oQnCPYmm98qPN4101vxLpluz98/low.mp4',
      poster: 'https://image.mux.com/vcxpI5VJy2Ml01fZVB7oQnCPYmm98qPN4101vxLpluz98/thumbnail.jpg?time=0'
    },
    defaultPrice: 20,
    defaultStock: 150
  },
  {
    id: 'affiche-embossee',
    name: 'Embossed Poster',
    description: 'Poster with embossed effect. Premium technical printing on textured paper.',
    category: 'accessories',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/OwYKc4Toxm2WneNFj402CyULKx7JnEFJ8mWEPtloFpgQ/low.mp4',
      poster: 'https://image.mux.com/OwYKc4Toxm2WneNFj402CyULKx7JnEFJ8mWEPtloFpgQ/thumbnail.jpg?time=0'
    },
    defaultPrice: 30,
    defaultStock: 75
  },
  {
    id: 'jai-menti',
    name: "I LIED.",
    description: 'I LIED Album - The most personal project from the artist.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/By015rSTFmeCEu62GkMcFC9vAx6SDePgUJl8HcMKbO008/low.mp4',
      poster: 'https://image.mux.com/By015rSTFmeCEu62GkMcFC9vAx6SDePgUJl8HcMKbO008/thumbnail.jpg?time=0'
    },
    variants: [
      { id: 'cd', name: 'CD', price: 18, stock: 180, isAvailable: true },
      { id: 'vinyl', name: 'VINYL', price: 32, stock: 45, isAvailable: true },
      { id: 'bundle', name: 'BUNDLE (CD + VINYL)', price: 45, originalPrice: 50, stock: 30, isAvailable: true }
    ],
    defaultPrice: 18,
    defaultStock: 180
  },
  {
    id: 'tee-shirt-beyah-blanc',
    name: 'BĒYĀH White T-shirt',
    description: 'BĒYĀH white t-shirt. Premium cotton with high definition screen printing.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/bZAr01RQ7fHdrR6k01sfhYzyfRvyVFofq7btB00KVXE6VI/low.mp4',
      poster: 'https://image.mux.com/bZAr01RQ7fHdrR6k01sfhYzyfRvyVFofq7btB00KVXE6VI/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 42,
    defaultStock: 110
  },
  {
    id: 'tee-shirt-beyah-bleu',
    name: 'BĒYĀH BLUE T-SHIRT',
    description: 'BĒYĀH blue t-shirt. Limited edition with special print.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/G1bqF8lyx4vfsxOiUz00BfiuWcqS9suUIRh01SCKqzhvg/low.mp4',
      poster: 'https://image.mux.com/G1bqF8lyx4vfsxOiUz00BfiuWcqS9suUIRh01SCKqzhvg/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 42,
    defaultStock: 95
  },
  {
    id: 'hoodie-beyah-noir',
    name: 'BĒYĀH BLACK HOODIE',
    description: 'BĒYĀH black hoodie. Iconic design with premium embroidered details.',
    category: 'clothing',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/vNoVF2sAC000202rLxKDITGbu3cPa3RXSsUugYTyYOcJcU/low.mp4',
      poster: 'https://image.mux.com/vNoVF2sAC000202rLxKDITGbu3cPa3RXSsUugYTyYOcJcU/thumbnail.jpg?time=0'
    },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    defaultPrice: 90,
    defaultStock: 70
  },
  {
    id: 'vinyle-qalf',
    name: 'QALF Vinyl',
    description: 'QALF on vinyl. High quality 180g pressing edition with gatefold sleeve.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_3.png'
    },
    defaultPrice: 32,
    defaultStock: 120
  },
  {
    id: 'vinyle-ipseite',
    name: 'Ipséité Vinyl',
    description: 'Ipséité on vinyl. Double LP with exclusive 16-page booklet.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_4.png'
    },
    defaultPrice: 32,
    defaultStock: 100
  },
  {
    id: 'vinyle-batterie-faible',
    name: 'Batterie Faible Vinyl',
    description: 'Batterie Faible on vinyl. Legendary first album reissued in limited edition.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_6.png'
    },
    defaultPrice: 32,
    defaultStock: 85
  },
  {
    id: 'vinyle-lithopedion',
    name: 'Lithopédion Vinyl',
    description: 'Lithopédion on vinyl. Conceptual album on audiophile vinyl pressing.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_7.png'
    },
    defaultPrice: 32,
    defaultStock: 90
  },
  {
    id: 'vinyle-ipseite-live',
    name: 'Ipséité LIVE Vinyl',
    description: 'Ipséité LIVE on vinyl. Exclusive live recording in limited edition.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/h3021Atn26aNk2xxl6VRag3IgvhLLmWNoGJYuSG01KjNQ/low.mp4',
      poster: 'https://image.mux.com/h3021Atn26aNk2xxl6VRag3IgvhLLmWNoGJYuSG01KjNQ/thumbnail.jpg?time=0'
    },
    defaultPrice: 35,
    defaultStock: 60
  },
  {
    id: 'cd-qalf-infinity',
    name: 'QALF Infinity CD',
    description: 'QALF Infinity on CD. Deluxe reissue with unreleased bonus tracks.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_8.png'
    },
    defaultPrice: 20,
    defaultStock: 140
  },
  {
    id: 'cd-qalf',
    name: 'QALF CD',
    description: 'QALF on standard CD. The album that changed everything, classic CD format.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_9.png'
    },
    defaultPrice: 18,
    defaultStock: 200
  },
  {
    id: 'cd-lithopedion',
    name: 'Lithopédion CD',
    description: 'Lithopédion on CD. Introspective project with illustrated booklet.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_10.png'
    },
    defaultPrice: 18,
    defaultStock: 175
  },
  {
    id: 'cd-ipseite',
    name: 'Ipséité CD',
    description: 'Ipséité on CD. Conceptual album with collector packaging.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_11.png'
    },
    defaultPrice: 18,
    defaultStock: 160
  },
  {
    id: 'cd-batterie-faible',
    name: 'Batterie Faible CD',
    description: 'Batterie Faible on CD. The cult first album in CD format.',
    category: 'album',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_12.png'
    },
    defaultPrice: 18,
    defaultStock: 155
  },
  {
    id: 'pack-cd',
    name: 'CD Pack',
    description: 'Complete CD pack. All albums in collector box set with exclusive booklet.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/D6z02Z700vOrTHDnqDJH2mHeAN9u6l6DJ2dXE802I44bto/low.mp4',
      poster: 'https://image.mux.com/D6z02Z700vOrTHDnqDJH2mHeAN9u6l6DJ2dXE802I44bto/thumbnail.jpg?time=0'
    },
    defaultPrice: 85,
    defaultOriginalPrice: 108,
    defaultStock: 40
  },
  {
    id: 'pack-vinyles',
    name: 'Vinyl Pack',
    description: 'Complete vinyl pack. Full collection in limited numbered box set.',
    category: 'album',
    media: {
      type: 'video',
      src: 'https://stream.mux.com/jO5s00RY80068o56zkC58101CulcR9v5cYtF5LUTjc002Nc/low.mp4',
      poster: 'https://image.mux.com/jO5s00RY80068o56zkC58101CulcR9v5cYtF5LUTjc002Nc/thumbnail.jpg?time=0'
    },
    defaultPrice: 150,
    defaultOriginalPrice: 192,
    defaultStock: 25
  },
  {
    id: 'livre-qalf',
    name: 'QALF Book',
    description: 'QALF Book. Illustrated work tracing the creation of the legendary album.',
    category: 'book',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_13.png'
    },
    defaultPrice: 35,
    defaultStock: 80
  },
  {
    id: 'livre-qalf-collector',
    name: 'QALF Collector Book',
    description: 'QALF Collector Book. Limited signed edition with exclusive content and unreleased photos.',
    category: 'book',
    media: {
      type: 'image',
      src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/d84e69c1-cb1b-4be7-bf37-83acadc35453-damso-com/assets/images/images_14.png'
    },
    defaultPrice: 60,
    defaultOriginalPrice: 75,
    defaultStock: 30
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};