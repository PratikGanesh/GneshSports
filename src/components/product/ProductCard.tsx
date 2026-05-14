'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const getDummyImage = (sport: string) => {
    switch(sport.toLowerCase()) {
      case 'football': return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=600';
      case 'basketball': return 'https://images.unsplash.com/photo-1542652694-40abf526446e?auto=format&fit=crop&q=80&w=600';
      case 'volleyball': return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=600';
      case 'swimming': return 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=600';
      case 'indoor': return 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=600';
      case 'trophies': return 'https://images.unsplash.com/photo-1566839352220-3b0f5b9d3e5c?auto=format&fit=crop&q=80&w=600';
      default: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600';
    }
  };

  const imageSrc = (product.imageUrl && !product.imageUrl.includes('/assets/')) 
    ? product.imageUrl 
    : getDummyImage(product.sport);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
      className="group relative bg-surface border border-accent rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="aspect-w-1 aspect-h-1 bg-accent group-hover:opacity-90 sm:aspect-none sm:h-64 overflow-hidden relative border-b border-accent">
        {/* Placeholder image, should use Next Image in prod */}
        <div className="w-full h-full bg-gray-50 flex items-center justify-center object-cover object-center relative group-hover:scale-105 transition-transform duration-500">
           <img src={imageSrc} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
           <span className="text-white text-xs uppercase tracking-widest font-bold z-10 drop-shadow-md absolute bottom-4 left-4">{product.brand}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col justify-between h-36">
        <div>
          <h3 className="text-sm font-semibold text-text-main line-clamp-2 hover:text-primary transition-colors">
            <Link href={`/sports/${product.sport}/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0 z-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs text-text-muted uppercase tracking-wide">{product.category?.name}</p>
        </div>
        <div className="flex items-center justify-between mt-auto z-10 relative">
          <p className="text-lg font-bold text-primary">{formatPrice(product.price, product.currency)}</p>
          <Link href="/contact" className="bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded shadow hover:bg-secondary-hover transition-colors shadow-secondary/30 pointer-events-auto">
            Inquiry
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
