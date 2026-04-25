import { useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/orders';
import { getUsers } from '../services/users';
import { getProducts } from '../services/products';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Orders = () => {
  const { data: orders, loading, error, refetch } = useFetch(getOrders);
  const { data: users } = useFetch(getUsers);
  const { data: products } = useFetch(getProducts);
  const { showToast } = useAppContext();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  
  // For new order
  const [userId, setUserId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  // For updating status
  const [statusMap, setStatusMap] = useState({});

  const handleOpenModal = () => {
    setUserId(users?.[0]?.id || '');
    setProductId(products?.[0]?.id || '');
    setQuantity(1);
    setIsModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedProduct = products.find(p => p.id === parseInt(productId));
      if (!selectedProduct) throw new Error('Product not found');

      const total = selectedProduct.price * quantity;
      
      await createOrder({
        userId: parseInt(userId),
        total,
        status: 'PENDING',
        items: [{ productId: parseInt(productId), quantity: parseInt(quantity) }]
      });
      
      showToast('Order created successfully');
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      showToast(err.response?.data?.error || err.message || 'Failed to create order', 'error');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusMap(prev => ({ ...prev, [orderId]: newStatus }));
  };

  const handleSaveStatus = async (order) => {
    const newStatus = statusMap[order.id];
    if (!newStatus || newStatus === order.status) return;

    try {
      await updateOrder(order.id, { status: newStatus });
      showToast('Order status updated');
      refetch();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteClick = (order) => {
    setCurrentOrder(order);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteOrder(currentOrder.id);
      showToast('Order deleted successfully');
      setIsConfirmOpen(false);
      refetch();
    } catch (err) {
      showToast('Failed to delete order', 'error');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>Create Order</button>
      </div>

      <ErrorMessage message={error} />

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>User ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.userId}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  <select 
                    value={statusMap[order.id] || order.status} 
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                    style={{ padding: '0.25rem', borderRadius: '4px' }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-sm btn-primary" 
                      onClick={() => handleSaveStatus(order)}
                      disabled={!statusMap[order.id] || statusMap[order.id] === order.status}
                    >
                      Save Status
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeleteClick(order)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan="6" style={{ textAlign: 'center' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Order">
        <form onSubmit={handleCreateSubmit}>
          <div className="form-group">
            <label>User</label>
            <select required value={userId} onChange={e => setUserId(e.target.value)}>
              <option value="" disabled>Select a user...</option>
              {users?.map(u => <option key={u.id} value={u.id}>{u.name || u.email}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Product</label>
            <select required value={productId} onChange={e => setProductId(e.target.value)}>
              <option value="" disabled>Select a product...</option>
              {products?.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input required type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Create</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Order"
        message={`Are you sure you want to delete order #${currentOrder?.id}?`}
      />
    </div>
  );
};

export default Orders;
