import prisma from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function verifyAdmin() {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error('Unauthorized');
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user || user.role !== 'admin') throw new Error('Forbidden');
  return user;
}

async function addBrand(formData: FormData) {
  'use server';
  await verifyAdmin();
  
  const name = (formData.get('name') as string)?.trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  
  if (!name) return;

  try {
    await prisma.brand.create({ data: { name, slug } });
  } catch (e) {
    console.error("Brand creation failed, might be duplicate slug", e);
  }
  revalidatePath('/admin/brands');
}

async function deleteBrand(formData: FormData) {
  'use server';
  await verifyAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.brand.delete({ where: { id } });
  revalidatePath('/admin/brands');
}

export default async function AdminBrands() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser || currentUser.role !== 'admin') redirect('/');

  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 border border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Brand</h3>
        <form action={addBrand} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
            <input type="text" name="name" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="e.g. Nivia, Speedo" />
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm">
            Add Brand
          </button>
        </form>
      </div>

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {brands.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{b.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={deleteBrand}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {brands.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No brands found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
