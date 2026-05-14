import prisma from '@/lib/db';
import { ProductGrid } from '@/components/product/ProductGrid';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const query = (params.q || '').trim().slice(0, 100); // Limit query length
  
  const initialProducts = await prisma.product.findMany({
    where: query ? {
      OR: [
        { name: { contains: query } },
        { brand: { name: { contains: query } } },
        { category: { name: { contains: query } } }
      ]
    } : undefined,
    include: { category: true },
    take: 100 // SECURITY: Prevent unbounded queries
  });

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <h1 className="text-3xl font-bold text-text-main">
          {query ? `Search Results for "${query}"` : "All Products"}
        </h1>
        <p className="text-text-muted mt-2">Found {initialProducts.length} items</p>
      </div>
      
      <ProductGrid 
        title="" 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products={initialProducts as any} 
      />
    </div>
  );
}
