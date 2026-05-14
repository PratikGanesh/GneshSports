import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background border-t border-accent mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <span className="font-display font-bold text-xl text-secondary">SHREE GANESH SPORTS</span>
            <p className="text-sm text-text-muted">
              Bringing premium sports equipment to Vadodara and beyond. Exclusive partners with Nivia, Speedo, Synco, and Gupta Industries.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">Sports</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/sports/football" className="text-base text-text-muted hover:text-primary">Football</Link></li>
                  <li><Link href="/sports/basketball" className="text-base text-text-muted hover:text-primary">Basketball</Link></li>
                  <li><Link href="/sports/swimming" className="text-base text-text-muted hover:text-primary">Swimming</Link></li>
                  <li><Link href="/sports/indoor" className="text-base text-text-muted hover:text-primary">Indoor Games</Link></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">Brands</h3>
                <ul className="mt-4 space-y-4">
                  <li><span className="text-base text-text-muted hover:text-secondary cursor-pointer">Nivia</span></li>
                  <li><span className="text-base text-text-muted hover:text-secondary cursor-pointer">Speedo</span></li>
                  <li><span className="text-base text-text-muted hover:text-secondary cursor-pointer">Synco</span></li>
                  <li><span className="text-base text-text-muted hover:text-secondary cursor-pointer">Gupta Industries</span></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-text-main tracking-wider uppercase">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/contact" className="text-base text-text-muted hover:text-primary">Contact Us</Link></li>
                  <li><span className="text-base text-text-muted cursor-pointer">Bulk Orders</span></li>
                  <li><span className="text-base text-text-muted cursor-pointer">Shipping & Returns</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-accent pt-8">
          <p className="text-base text-text-muted xl:text-center">&copy; 2026 Shree Ganesh Sports Stores. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
