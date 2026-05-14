'use client';

import { useCartStore } from '@/store/cartStore';

interface AddToCartProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
}

export function AddToCartButton({ id, name, price, imageUrl, slug }: AddToCartProps) {
  const { addItem, items } = useCartStore();
  
  // Calculate if it's already in the cart just to show "Added!" state briefly if we want, or just purely functional
  // For now, simple Add To Cart functionality

  return (
    <button 
      onClick={() => {
        addItem({ id, name, price, imageUrl, slug });
        // Optional flush or toast notification here
        alert(`Added ${name} to your Cart!`);
      }}
      className="w-full bg-surface border border-primary text-primary transition-colors py-4 px-8 flex items-center justify-center text-lg font-bold rounded-md hover:bg-primary hover:text-white pointer-events-auto"
    >
      Add to Cart
    </button>
  );
}
