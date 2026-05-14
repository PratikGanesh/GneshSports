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

async function addCategory(formData: FormData) {
  'use server';
  await verifyAdmin();
  
  const name = (formData.get('name') as string)?.trim();
  const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
  
  if (!name) return;

  try {
    await prisma.category.create({ data: { name, slug, imageUrl } });
  } catch (e) {
    console.error("Category creation failed, might be duplicate slug", e);
  }
  revalidatePath('/admin/categories');
}

async function deleteCategory(formData: FormData) {
  'use server';
  await verifyAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
}

export default async function AdminCategories() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser || currentUser.role !== 'admin') redirect('/');

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-6">
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 border border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add New Category</h3>
        <form action={addCategory} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
            <input type="text" name="name" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="e.g. Cricket Bats" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Optional)</label>
            <input type="url" name="imageUrl" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="https://..." />
          </div>
          <button type="submit" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:text-sm">
            Add Category
          </button>
        </form>
      </div>

      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image / Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-3">
                  {c.imageUrl ? (
                     <img src={c.imageUrl} alt={c.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
                  ) : (
                     <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400">N/A</div>
                  )}
                  {c.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{c.slug}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={c.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
