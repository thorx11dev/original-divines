'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  categoryId: number;
  price: number;
  originalPrice: number | null;
  stock: number;
  mediaType: string;
  mediaSrc: string;
  mediaPoster: string | null;
  isAvailable: boolean;
}

export const ProductsView = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    price: '',
    originalPrice: '',
    stock: '',
    mediaType: 'image',
    mediaSrc: '',
    mediaPoster: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/categories'),
      ]);
      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      categoryId: categories[0]?.id?.toString() || '',
      price: '',
      originalPrice: '',
      stock: '0',
      mediaType: 'image',
      mediaSrc: '',
      mediaPoster: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryId: product.categoryId.toString(),
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      stock: product.stock.toString(),
      mediaType: product.mediaType,
      mediaSrc: product.mediaSrc,
      mediaPoster: product.mediaPoster || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const productData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock),
        mediaType: formData.mediaType,
        mediaSrc: formData.mediaSrc,
        mediaPoster: formData.mediaPoster || null,
      };

      if (editingProduct) {
        // Update
        await fetch(`/api/products?id=${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      } else {
        // Create
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        });
      }

      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const toggleAvailability = async (productId: number) => {
    try {
      await fetch(`/api/products/${productId}/availability`, {
        method: 'PUT',
      });
      fetchData();
    } catch (error) {
      console.error('Failed to toggle availability:', error);
    }
  };

  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-[32px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px]">
        <h1 className="text-[28px] md:text-[32px] font-bold text-foreground uppercase">Products Management</h1>
        <button
          onClick={openCreateModal}
          className="h-[44px] px-[24px] flex items-center gap-[8px] bg-primary text-primary-foreground rounded-lg font-bold text-[12px] uppercase hover:opacity-90 transition-opacity shadow-md"
        >
          <Plus className="w-[16px] h-[16px]" />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="text-center py-[80px]">
            <div className="inline-block w-[40px] h-[40px] border-4 border-grey-20 border-t-primary rounded-full animate-spin mb-[16px]"></div>
            <div className="text-[14px] text-grey-40 uppercase font-medium">Loading Products...</div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-[80px] text-grey-40 text-[14px]">
            No products found. Create your first product!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] p-[20px]">
            {products.map((product) => (
              <div key={product.id} className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-grey-10 relative">
                  {product.mediaType === 'image' ? (
                    <img src={product.mediaSrc} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={product.mediaSrc} poster={product.mediaPoster || undefined} className="w-full h-full object-cover" muted loop />
                  )}
                  <div className="absolute top-[12px] right-[12px]">
                    <button
                      onClick={() => toggleAvailability(product.id)}
                      className={`p-[8px] rounded-lg ${product.isAvailable ? 'bg-green-600' : 'bg-red-600'} text-white hover:opacity-90 transition-opacity shadow-md`}
                      title={product.isAvailable ? 'Available' : 'Unavailable'}
                    >
                      {product.isAvailable ? <ToggleRight className="w-[16px] h-[16px]" /> : <ToggleLeft className="w-[16px] h-[16px]" />}
                    </button>
                  </div>
                </div>
                <div className="p-[16px]">
                  <h3 className="text-[14px] font-bold text-foreground uppercase mb-[8px] line-clamp-1">{product.name}</h3>
                  <p className="text-[12px] text-grey-40 mb-[12px] line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mb-[12px]">
                    <div>
                      <div className="text-[18px] font-bold text-foreground">€{product.price.toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="text-[12px] text-grey-40 line-through">€{product.originalPrice.toFixed(2)}</div>
                      )}
                    </div>
                    <div className="text-[12px] text-grey-40">
                      Stock: <span className="font-bold text-foreground">{product.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-[8px]">
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-1 h-[36px] flex items-center justify-center gap-[8px] bg-grey-20 text-foreground rounded font-bold text-[12px] uppercase hover:bg-grey-40 transition-colors"
                    >
                      <Edit className="w-[14px] h-[14px]" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="flex-1 h-[36px] flex items-center justify-center gap-[8px] bg-red-600 text-white rounded font-bold text-[12px] uppercase hover:opacity-90 transition-opacity"
                    >
                      <Trash2 className="w-[14px] h-[14px]" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-[20px] bg-black/50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-lg max-w-[600px] w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-border p-[24px] flex items-center justify-between z-10">
              <h2 className="text-[20px] font-bold uppercase">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-[8px] hover:bg-grey-10 rounded transition-colors">
                <X className="w-[20px] h-[20px]" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-[24px] space-y-[20px]">
              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Slug (URL)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-[16px] py-[12px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Category</label>
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[16px]">
                <div>
                  <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Price (€)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Original Price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Media Type</label>
                <select
                  required
                  value={formData.mediaType}
                  onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Media Source URL</label>
                <input
                  type="url"
                  required
                  value={formData.mediaSrc}
                  onChange={(e) => setFormData({ ...formData, mediaSrc: e.target.value })}
                  className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://..."
                />
              </div>

              {formData.mediaType === 'video' && (
                <div>
                  <label className="block text-[12px] font-bold text-grey-40 uppercase mb-[8px]">Video Poster URL (Optional)</label>
                  <input
                    type="url"
                    value={formData.mediaPoster}
                    onChange={(e) => setFormData({ ...formData, mediaPoster: e.target.value })}
                    className="w-full h-[44px] px-[16px] border border-border rounded text-[14px] focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://..."
                  />
                </div>
              )}

              <div className="flex gap-[12px] pt-[20px] border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 h-[48px] bg-grey-20 text-foreground rounded-lg font-bold text-[14px] uppercase hover:bg-grey-40 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[48px] bg-primary text-primary-foreground rounded-lg font-bold text-[14px] uppercase hover:opacity-90 transition-opacity"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};