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

async function addProduct(formData: FormData) {
  'use server';
  await verifyAdmin();
  
  const name = (formData.get('name') as string)?.trim();
  const sport = (formData.get('sport') as string)?.trim();
  const categoryId = formData.get('categoryId') as string;
  const brandId = formData.get('brandId') as string;
  const price = parseFloat(formData.get('price') as string);
  const slug = (formData.get('slug') as string)?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const sku = (formData.get('sku') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim() || null;
  const imageUrl = (formData.get('imageUrl') as string)?.trim() || null;
  
  const colorIds = formData.getAll('colors') as string[];
  const sizeIds = formData.getAll('sizes') as string[];
  
  if (!name || !brandId || !slug || !price || isNaN(price) || !categoryId) return;

  try {
    await prisma.product.create({
      data: {
        name,
        sport: sport.toLowerCase(),
        categoryId,
        brandId,
        price: Math.max(0, price),
        slug,
        sku,
        description,
        imageUrl,
        colors: { connect: colorIds.map(id => ({ id })) },
        sizes: { connect: sizeIds.map(id => ({ id })) }
      }
    });
  } catch (e) {
    console.error("Product creation failed", e);
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
}

async function deleteProduct(formData: FormData) {
  'use server';
  await verifyAdmin();
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export default async function AdminProducts() {
  const session = await getServerSession();
  if (!session?.user?.email) redirect('/login');
  const currentUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!currentUser || currentUser.role !== 'admin') redirect('/');

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true, brand: true, colors: true, sizes: true }
  });

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const colors = await prisma.color.findMany({ orderBy: { name: 'asc' } });
  const sizes = await prisma.size.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="space-y-8">
      {/* Add Product Form */}
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6 border border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6 border-b border-gray-200 pb-4">
          Add New Product
        </h3>
        <form action={addProduct} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input type="text" name="name" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unique Slug</label>
              <input type="text" name="slug" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <select name="brandId" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white">
                <option value="">Select Brand</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select name="categoryId" required className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
              <input type="text" name="sport" required placeholder="e.g. Cricket, Football" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (INR)</label>
              <input type="number" name="price" required min="0" step="0.01" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
              <input type="text" name="sku" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input type="url" name="imageUrl" className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Colors (Hold Cmd/Ctrl to select multiple)</label>
              <select name="colors" multiple className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white h-24">
                {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (Hold Cmd/Ctrl to select multiple)</label>
              <select name="sizes" multiple className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border bg-white h-24">
                {sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" rows={3} className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
            </div>

          </div>

          <div className="flex justify-end pt-5 border-t border-gray-200">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Save Product
            </button>
          </div>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category / Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attributes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {product.imageUrl && <img src={product.imageUrl} alt="" className="h-10 w-10 rounded-md object-cover mr-3" />}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.brand?.name} {product.sku ? `| SKU: ${product.sku}` : ''}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category?.name}</div>
                  <div className="text-sm text-gray-500 capitalize">{product.sport}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    <div>Colors: {product.colors.length > 0 ? product.colors.map(c => c.name).join(', ') : 'None'}</div>
                    <div>Sizes: {product.sizes.length > 0 ? product.sizes.map(s => s.name).join(', ') : 'None'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {product.price} {product.currency}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No products found. Start adding some above.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
