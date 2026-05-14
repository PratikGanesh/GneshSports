'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CategorySection({ categories }: { categories: any[] }) {
  // Let's take the first 8-12 categories or so to not overwhelm, or show all 30 if they want "more category".
  // Assuming they want to see a nice grid of the new categories
  
  return (
    <section className="bg-white py-16 border-t border-accent overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-text-main">Explore Categories</h2>
          <p className="mt-4 text-text-muted max-w-2xl mx-auto">Browse our massive selection of professional gear categorized just for your specific sport constraints.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.slice(0, 16).map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link href={`/sports/${cat.slug}`} className="group relative block w-full h-48 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <img 
                  src={cat.imageUrl || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        {categories.length > 16 && (
           <div className="mt-12 text-center">
              <Link href="/search" className="inline-flex items-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors">
                 View All {categories.length} Categories
              </Link>
           </div>
        )}
      </div>
    </section>
  );
}
