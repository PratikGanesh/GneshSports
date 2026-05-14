import prisma from '@/lib/db';
import { ShopSidebar } from '@/components/shop/ShopSidebar';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Prisma } from '@prisma/client';

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;
  const color = typeof params.color === 'string' ? params.color : undefined;
  const minPrice = typeof params.minPrice === 'string' ? parseFloat(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === 'string' ? parseFloat(params.maxPrice) : undefined;

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' }
  });

  // Construct Prisma Where Query dynamically based on params
  const whereClause: Prisma.ProductWhereInput = {};

  if (categorySlug) {
    whereClause.sport = categorySlug;
  }
  
  if (color) {
    whereClause.colors = { some: { name: color } };
  }
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
  }

  // We limit to 100 items per request to prevent browser crash from 2000 items
  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    take: 100, // Hard limit for safety
    orderBy: { createdAt: 'desc' }
  });

  const totalCount = await prisma.product.count({ where: whereClause });

  return (
    <div className="bg-background min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 border-b border-accent pb-6">
          <h1 className="text-4xl font-display font-bold text-text-main">Master Catalog</h1>
          <p className="mt-2 text-text-muted">
             Showing {products.length} of {totalCount} total products matching criteria.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filter */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
             <ShopSidebar categories={categories} />
          </div>

          {/* Right Content Grid */}
          <div className="w-full lg:w-3/4">
             <ProductGrid 
               title={categorySlug ? `Filtered Items` : "All Items"} 
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               products={products as any} 
             />
             
             {products.length === 100 && (
               <div className="mt-8 text-center text-sm text-text-muted">
                 Displaying the first 100 results. Please refine your filters to see more specific subsets of the 2,000+ catalog!
               </div>
             )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
