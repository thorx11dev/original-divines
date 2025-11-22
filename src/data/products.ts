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
    name: 'Tournée',
    description: 'Affiche officielle de la tournée. Impression haute qualité sur papier premium.',
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
    name: 'Tee shirt Tour',
    description: 'Tee-shirt officiel de la tournée. 100% coton premium avec impression sérigraphie haute qualité.',
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
    name: 'Hoodie Tour',
    description: 'Hoodie officiel de la tournée. Coton épais 400g/m² avec intérieur polaire. Coupe oversize confortable.',
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
    name: 'Recording session',
    description: 'Photo exclusive des sessions d\'enregistrement. Tirage limité signé et numéroté.',
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
    description: 'Album BĒYĀH - Une œuvre intemporelle capturant l\'essence de l\'artiste.',
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
    name: 'K7',
    description: 'Cassette collector K7. Format authentique vintage avec livret inclus.',
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
    name: 'Hoodie velours',
    description: 'Hoodie en velours premium. Texture douce et luxueuse avec broderie détaillée.',
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
    name: 'Tee shirt reflectif',
    description: 'Tee-shirt avec impression réflective. Design unique visible dans l\'obscurité.',
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
    name: 'Casquette washed black',
    description: 'Casquette effet délavé noir. Coton vintage avec ajustement réglable.',
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
    name: 'Porte clef',
    description: 'Porte-clés métallique collector. Design exclusif avec finition premium.',
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
    description: 'Étui AirPods avec design exclusif. Protection complète en silicone premium.',
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
    name: 'Affiche embossée',
    description: 'Affiche avec effet gaufrage. Impression technique premium sur papier texturé.',
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
    name: "J'AI MENTI.",
    description: 'Album J\'AI MENTI - Le projet le plus personnel de l\'artiste.',
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
    name: 'Tee shirt BĒYĀH blanc',
    description: 'Tee-shirt blanc BĒYĀH. Coton premium avec sérigraphie haute définition.',
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
    name: 'TEE SHIRT BĒYĀH BLEU',
    description: 'Tee-shirt bleu BĒYĀH. Édition limitée avec impression spéciale.',
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
    name: 'HOODIE BĒYĀH NOIR',
    description: 'Hoodie noir BĒYĀH. Design emblématique avec détails brodés premium.',
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
    name: 'Vinyle QALF',
    description: 'QALF en vinyle. Édition pressage haute qualité 180g avec pochette gatefold.',
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
    name: 'Vinyle Ipséité',
    description: 'Ipséité en vinyle. Double LP avec livret exclusif 16 pages.',
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
    name: 'Vinyle Batterie Faible',
    description: 'Batterie Faible en vinyle. Premier album mythique réédité en édition limitée.',
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
    name: 'Vinyle Lithopédion',
    description: 'Lithopédion en vinyle. Album conceptuel sur pressage vinyle audiophile.',
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
    name: 'Vinyle Ipséité LIVE',
    description: 'Ipséité LIVE en vinyle. Enregistrement live exclusif en édition limitée.',
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
    name: 'CD QALF Infinity',
    description: 'QALF Infinity en CD. Réédition deluxe avec bonus tracks inédits.',
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
    name: 'CD QALF',
    description: 'QALF en CD standard. L\'album qui a tout changé, format CD classique.',
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
    name: 'CD Lithopédion',
    description: 'Lithopédion en CD. Projet introspectif avec livret illustré.',
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
    name: 'CD Ipséité',
    description: 'Ipséité en CD. Album conceptuel avec packaging collector.',
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
    name: 'CD Batterie Faible',
    description: 'Batterie Faible en CD. Le premier album culte en format CD.',
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
    name: 'Pack CD',
    description: 'Pack complet des CDs. Tous les albums en coffret collector avec livret exclusif.',
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
    name: 'Pack Vinyles',
    description: 'Pack complet des vinyles. Collection complète en coffret numéroté limité.',
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
    name: 'Livre QALF',
    description: 'Livre QALF. Ouvrage illustré retraçant la création de l\'album légendaire.',
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
    name: 'Livre QALF Collector',
    description: 'Livre QALF Collector. Édition limitée signée avec contenu exclusif et photos inédites.',
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
