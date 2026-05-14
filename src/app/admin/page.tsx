import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser || currentUser.role !== 'admin') redirect('/');

  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const brandCount = await prisma.brand.count();
  const colorCount = await prisma.color.count();
  const sizeCount = await prisma.size.count();
  const recentProducts = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { category: true, brand: true }
  });

  const statCards = [
    { name: 'Products', count: productCount, link: '/admin/products' },
    { name: 'Categories', count: categoryCount, link: '/admin/categories' },
    { name: 'Brands', count: brandCount, link: '/admin/brands' },
    { name: 'Colors', count: colorCount, link: '/admin/colors' },
    { name: 'Sizes', count: sizeCount, link: '/admin/sizes' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map(stat => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stat.count}</p>
            <Link href={stat.link} className="mt-4 inline-block text-sm text-primary hover:text-primary-hover font-medium">
              Manage &rarr;
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recently Added Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.brand?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price} {product.currency}</td>
                </tr>
              ))}
              {recentProducts.length === 0 && (
                <tr>
                   <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No products added yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
