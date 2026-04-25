import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Products = () => {
  const { data: products, loading, error, refetch } = useFetch(getProducts);
  const { showToast } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '' });

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        stock: product.stock
      });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10)
      };

      if (currentProduct) {
        await updateProduct(currentProduct.id, payload);
        showToast('Product updated successfully');
      } else {
        await createProduct(payload);
        showToast('Product created successfully');
      }
      handleCloseModal();
      refetch();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to save product', 'error');
    }
  };

  const handleDeleteClick = (product) => {
    setCurrentProduct(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProduct(currentProduct.id);
      showToast('Product deleted successfully');
      setIsConfirmOpen(false);
      refetch();
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add Product</button>
      </div>

      <ErrorMessage message={error} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map(product => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="btn btn-sm" onClick={() => handleOpenModal(product)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(product)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!products || products.length === 0) && (
              <tr><td colSpan="5" style={{ textAlign: 'center' }}>No products found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={currentProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={handleCloseModal}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${currentProduct?.name}?`}
      />
    </div>
  );
};

export default Products;
