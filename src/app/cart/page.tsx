'use client';

import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-screen py-20 flex flex-col items-center justify-center">
        <div className="text-6xl mb-6 opacity-30">🛒</div>
        <h2 className="text-3xl font-display font-bold text-text-main mb-4">Your Cart is Empty</h2>
        <p className="text-text-muted mb-8 text-center max-w-md">You haven&apos;t added any premium gear to your cart yet. Visit the catalog to find exactly what your sport requires.</p>
        <Link href="/shop" className="bg-primary text-white font-medium px-8 py-3 rounded hover:bg-primary-hover transition-colors">
          Browse Shop
        </Link>
      </div>
    );
  }

  const generateWhatsAppMessage = () => {
     let msg = "Hello Shree Ganesh Sports, I am interested in purchasing the following items from my cart:\n\n";
     items.forEach(i => {
       msg += `- ${i.quantity}x ${i.name} (${formatPrice(i.price, 'INR')})\n`;
     });
     msg += `\n*Expected Total: ${formatPrice(getTotalPrice(), 'INR')}*\n\nCan you confirm availability?`;
     return encodeURIComponent(msg);
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-display font-bold text-text-main mb-8">Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-6 bg-surface p-4 border border-accent rounded-lg shadow-sm">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
                <div className="flex-1">
                  <Link href={`/search?q=${item.name.substring(0, 10)}`} className="font-bold text-lg hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                  <p className="text-text-muted text-sm mt-1">{formatPrice(item.price, 'INR')} each</p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center border border-accent rounded overflow-hidden">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition-colors pointer-events-auto">-</button>
                    <span className="px-4 py-1 font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 bg-gray-50 hover:bg-gray-200 transition-colors pointer-events-auto">+</button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 text-sm font-medium hover:underline pointer-events-auto">Remove</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="mt-10 lg:mt-0">
            <div className="bg-surface p-6 rounded-lg border border-accent shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-text-main mb-6 border-b border-accent pb-4">Order Summary</h2>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-text-muted">Subtotal ({items.length} items)</span>
                <span className="font-bold text-text-main">{formatPrice(getTotalPrice(), 'INR')}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-text-muted">Taxes / Shipping</span>
                <span className="text-sm italic">Calculated at dispatch</span>
              </div>
              
              <div className="flex justify-between items-center mb-8 border-t border-accent pt-4">
                <span className="font-bold text-text-main text-xl">Total</span>
                <span className="font-bold text-primary text-2xl">{formatPrice(getTotalPrice(), 'INR')}</span>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => window.open(`https://wa.me/919925387218?text=${generateWhatsAppMessage()}`, '_blank')}
                  className="w-full bg-green-500 text-white font-bold py-4 rounded hover:bg-green-600 transition-colors flex justify-center items-center gap-2 pointer-events-auto"
                >
                  Checkout via WhatsApp
                </button>
                <button 
                  onClick={clearCart}
                  className="w-full bg-transparent text-text-muted border border-accent font-medium py-3 rounded hover:bg-gray-100 transition-colors pointer-events-auto"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
