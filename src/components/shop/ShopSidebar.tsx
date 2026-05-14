'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Category } from '@/lib/types';

export function ShopSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse initial state from URL
  const initialCategory = searchParams.get('category') || '';
  const initialColor = searchParams.get('color') || '';
  const initialMinPrice = searchParams.get('minPrice') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);

  const colors = ["Red", "Blue", "Black", "White", "Neon Green", "Yellow", "Orange", "Silver", "Gold", "Navy", "Gray", "Pink"];

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedCategory) params.set('category', selectedCategory);
    else params.delete('category');
    
    if (selectedColor) params.set('color', selectedColor);
    else params.delete('color');
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    router.push(`/shop?${params.toString()}`);
  }, [selectedCategory, selectedColor, minPrice, maxPrice, router, searchParams]);

  return (
    <div className="bg-surface p-6 rounded-lg border border-accent shadow-sm flex flex-col gap-8 h-fit sticky top-24">
      
      {/* Categories */}
      <div>
        <h3 className="font-bold text-lg text-text-main mb-4 border-b border-accent pb-2">Category</h3>
        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="category"
              checked={selectedCategory === ''} 
              onChange={() => { setSelectedCategory(''); setTimeout(updateFilters, 50); }}
              className="accent-primary" 
            />
            <span className="text-sm">All Categories</span>
          </label>
          {categories.map(c => (
            <label key={c.id} className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="category"
                checked={selectedCategory === c.slug} 
                onChange={() => { setSelectedCategory(c.slug); setTimeout(updateFilters, 50); }}
                className="accent-primary" 
              />
              <span className="text-sm">{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-bold text-lg text-text-main mb-4 border-b border-accent pb-2">Color</h3>
        <div className="flex flex-wrap gap-2">
           <button 
              onClick={() => { setSelectedColor(''); setTimeout(updateFilters, 50); }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedColor === '' ? 'bg-primary text-white border-primary' : 'bg-transparent text-text-muted border-accent hover:border-primary'}`}
            >
              All
            </button>
          {colors.map(color => (
            <button 
              key={color}
              onClick={() => { setSelectedColor(color); setTimeout(updateFilters, 50); }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedColor === color ? 'bg-primary text-white border-primary' : 'bg-transparent text-text-muted border-accent hover:border-primary'}`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-bold text-lg text-text-main mb-4 border-b border-accent pb-2">Price Range (INR)</h3>
        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Min" 
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 text-sm border border-accent rounded focus:border-primary outline-none"
          />
          <span className="text-text-muted">-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 text-sm border border-accent rounded focus:border-primary outline-none"
          />
        </div>
        <button 
          onClick={updateFilters}
          className="mt-4 w-full bg-surface border border-primary text-primary hover:bg-primary hover:text-white transition-colors py-2 rounded text-sm font-semibold"
        >
          Apply Price Filter
        </button>
      </div>

      <button 
        onClick={() => {
           setSelectedCategory('');
           setSelectedColor('');
           setMinPrice('');
           setMaxPrice('');
           router.push('/shop');
        }}
        className="mt-2 w-full bg-accent text-text-main hover:bg-gray-200 transition-colors py-2 rounded text-sm font-semibold border border-transparent"
      >
        Clear All Filters
      </button>

    </div>
  );
}
