import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { AddToCartButton } from '@/components/product/AddToCartButton';

export default async function ProductDetailPage({ params }: { params: Promise<{ sport: string, productSlug: string }> }) {
  const { productSlug } = await params;
  
  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    include: { category: true, brand: true, sizes: true }
  });

  if (!product) {
    notFound();
  }

  const sizesArray = product.sizes ? product.sizes.map(s => s.name) : [];

  const getDummyImage = (sport: string) => {
    switch(sport.toLowerCase()) {
      case 'football': return 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=1200';
      case 'basketball': return 'https://images.unsplash.com/photo-1542652694-40abf526446e?auto=format&fit=crop&q=80&w=1200';
      case 'volleyball': return 'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&q=80&w=1200';
      case 'swimming': return 'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&q=80&w=1200';
      case 'indoor': return 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&q=80&w=1200';
      case 'trophies': return 'https://images.unsplash.com/photo-1566839352220-3b0f5b9d3e5c?auto=format&fit=crop&q=80&w=1200';
      default: return 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1200';
    }
  };

  const imageSrc = (product.imageUrl && !product.imageUrl.includes('/assets/')) 
    ? product.imageUrl 
    : getDummyImage(product.sport);

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex text-sm text-text-muted">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/sports/${product.sport}`} className="hover:text-primary capitalize">{product.sport}</Link>
          <span className="mx-2">/</span>
          <span className="text-text-main font-medium">{product.name}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
          {/* Image */}
          <div className="bg-surface rounded-xl overflow-hidden border border-accent shadow-sm aspect-w-1 aspect-h-1 lg:aspect-none lg:h-[600px] flex items-center justify-center relative">
             <img src={imageSrc} alt={product.name} className="absolute inset-0 object-cover w-full h-full" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {/* Product Info */}
          <div className="mt-10 px-2 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-display font-bold tracking-tight text-text-main sm:text-4xl">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                 {formatPrice(product.price, product.currency)}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>
              <div className="text-base text-text-muted space-y-6">
                <p>Advanced sports equipment crafted for maximum performance. Explore the unmatched quality of {product.brand.name}. {product.description || 'This item is currently available for bulk order or individual purchase via inquiry.'}</p>
              </div>
            </div>

            {/* Sizes */}
            {sizesArray.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-text-main mb-3">Available Sizes/Specs</h3>
                <div className="flex flex-wrap gap-2">
                  {sizesArray.map((size) => (
                    <div key={size} className="border border-accent rounded-md py-2 px-4 text-sm font-medium hover:border-primary hover:text-primary cursor-pointer transition-colors bg-surface">
                      {size}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-8 flex flex-col gap-4 border-t border-accent border-opacity-60">
              <Link href="/contact" className="w-full bg-primary border border-transparent rounded-md py-4 px-8 flex items-center justify-center text-lg font-medium text-white hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 transition-all duration-300">
                Request Quote via WhatsApp
              </Link>
              <AddToCartButton 
                 id={product.id}
                 name={product.name}
                 price={product.price}
                 imageUrl={imageSrc}
                 slug={product.slug}
              />
            </div>
            
            <div className="mt-8 border-t border-accent pt-6 space-y-4 text-sm">
                <div className="flex justify-between border-b border-accent pb-2">
                    <span className="text-text-muted">Brand</span>
                    <span className="font-semibold">{product.brand.name}</span>
                </div>
                <div className="flex justify-between border-b border-accent pb-2">
                    <span className="text-text-muted">Category</span>
                    <span className="font-semibold">{product.category.name}</span>
                </div>
                <div className="flex justify-between border-b border-accent pb-2">
                    <span className="text-text-muted">SKU Code</span>
                    <span className="font-semibold text-text-muted uppercase">{product.sku || 'N/A'}</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
