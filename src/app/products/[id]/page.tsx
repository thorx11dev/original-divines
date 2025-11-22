import { notFound } from 'next/navigation';
import { getProductById } from '@/data/products';
import { ProductDetailView } from '@/components/sections/product-detail-view';
import Header from '@/components/sections/header';
import IpodNavigation from '@/components/sections/ipod-navigation';
import BackgroundLayer from '@/components/sections/background-layer';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <>
      <BackgroundLayer />
      <main className="relative">
        <ProductDetailView product={product} />
      </main>
      <Header productName={product.name} />
      <IpodNavigation />
    </>
  );
}