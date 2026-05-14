import prisma from '@/lib/db';
import { ProductGrid } from '@/components/product/ProductGrid';
import { notFound } from 'next/navigation';

export default async function SportCategoryPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  
  const products = await prisma.product.findMany({
    where: { sport: { equals: sport } }, // Ignore case handled roughly or perfectly by raw
    include: { category: true }
  });

  const title = sport.charAt(0).toUpperCase() + sport.slice(1);

  return (
    <div className="py-8">
      <div className="bg-surface py-12 border-b border-accent mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">{title} Equipment</h1>
          <p className="text-text-muted">Browse our premium selection of {sport} gear.</p>
        </div>
      </div>
      
      <ProductGrid 
        title={`${title} Collection`} 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products={products as any} 
      />
    </div>
  );
}
