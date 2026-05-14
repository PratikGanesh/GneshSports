'use client';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { motion } from 'framer-motion';

export function ProductGrid({ products, title, subtitle }: { products: Product[], title: string, subtitle?: string }) {
  if (products.length === 0) {
    return (
      <div className="py-16 px-4 text-center">
        <h3 className="text-lg text-text-muted">No products found.</h3>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="max-w-2xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          <h2 className="text-3xl font-display font-extrabold tracking-tight text-text-main sm:text-4xl">{title}</h2>
          {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
