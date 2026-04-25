import { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { getProducts } from '../services/products';
import { getUsers } from '../services/users';
import { getOrders } from '../services/orders';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import api from '../services/api';

const Dashboard = () => {
  const [health, setHealth] = useState(null);
  
  const { data: products, loading: pLoading, error: pError } = useFetch(getProducts);
  const { data: users, loading: uLoading, error: uError } = useFetch(getUsers);
  const { data: orders, loading: oLoading, error: oError } = useFetch(getOrders);

  useEffect(() => {
    api.get('/api/health')
      .then(res => setHealth(res.data))
      .catch(() => setHealth({ status: 'error' }));
  }, []);

  if (pLoading || uLoading || oLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <div>
          Backend Status: 
          <span className={`badge ${health?.status === 'ok' ? 'badge-shipped' : 'badge-pending'}`} style={{ marginLeft: '0.5rem' }}>
            {health ? health.status : 'checking...'}
          </span>
        </div>
      </div>

      <ErrorMessage message={pError || uError || oError} />

      <div className="card-grid">
        <StatCard title="Total Products" value={products?.length || 0} />
        <StatCard title="Total Users" value={users?.length || 0} />
        <StatCard title="Total Orders" value={orders?.length || 0} />
      </div>

      <h2>Recent Orders</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Status</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders?.slice(0, 5).map(order => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td><span className={`badge badge-${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td>${order.total.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!orders || orders.length === 0) && (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
