import { Hero } from '@/components/home/Hero';
import { ProductGrid } from '@/components/product/ProductGrid';
import { CategorySection } from '@/components/home/CategorySection';
import prisma from '@/lib/db';

export default async function Home() {
  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true },
    include: { category: true }
  });

  const allCategories = await prisma.category.findMany();

  return (
    <>
      <Hero />
      <section className="bg-surface py-8">
        <ProductGrid 
          title="Featured Gear" 
          subtitle="Top picks from our premium catalogue to elevate your game."
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          products={featuredProducts as any} 
        />
      </section>

      {/* Category Section */}
      <CategorySection categories={allCategories} />
      
      {/* Brands Banner */}
      <section className="bg-primary text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold mb-8">Trusted by Champions. Built by Leaders.</h2>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-80">
            <span className="text-xl font-semibold tracking-widest uppercase">Nivia</span>
            <span className="text-xl font-semibold tracking-widest uppercase">Speedo</span>
            <span className="text-xl font-semibold tracking-widest uppercase">Synco</span>
            <span className="text-xl font-semibold tracking-widest uppercase">Gupta Industries</span>
          </div>
        </div>
      </section>
    </>
  );
}
