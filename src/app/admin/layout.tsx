import Link from "next/link";
export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Categories", href: "/admin/categories" },
    { name: "Brands", href: "/admin/brands" },
    { name: "Colors", href: "/admin/colors" },
    { name: "Sizes", href: "/admin/sizes" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin CMS</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link href="/" className="text-sm font-medium text-primary hover:text-primary-hover w-full block text-center border border-primary rounded-md py-2 px-4 transition-colors">
            View Live Site
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (fallback) */}
        <header className="bg-white shadow md:hidden">
          <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Admin CMS</h1>
            <Link href="/" className="text-sm font-medium text-primary hover:text-primary-hover">Exit</Link>
          </div>
          <div className="overflow-x-auto py-2 px-4 flex space-x-4">
            {navItems.map(item => (
              <Link key={item.name} href={item.href} className="text-sm font-medium text-gray-700 hover:text-primary whitespace-nowrap">
                {item.name}
              </Link>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto w-full p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
