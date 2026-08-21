import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";
import "./AdminDashboard.css";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { adminLogout } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [adminName, setAdminName] = useState("Admin");
  const [form, setForm] = useState({
    name: "",
    priceCents: "",
    category: "",
    description: "",
    image: "",
    stock: "50"
  });

  const fetchProducts = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await api.get("/api/products?limit=100", {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      const responseData = response.data;
      const productList = Array.isArray(responseData)
        ? responseData
        : (responseData.products || []);
      setProducts(productList);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
      setProducts([]);
    }
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");
      const response = await api.get("/api/orders/admin/all?limit=100", {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("token");
        navigate("/admin-login");
      }
      setOrders([]);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  // Check admin token and set name
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      try {
        const decoded = JSON.parse(atob(adminToken.split(".")[1]));
        setAdminName(decoded.role === "admin" ? "Admin" : "Guest");
      } catch (e) {
        setAdminName("Admin");
      }
    }
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem("adminToken");
      const priceCents = Math.round(parseFloat(form.priceCents) * 100);
      if (isNaN(priceCents) || priceCents < 0) {
        alert("Please enter a valid price.");
        return;
      }
      const stock = form.stock === "" ? 50 : parseInt(form.stock, 10);
      if (isNaN(stock) || stock < 0) {
        alert("Please enter a valid stock count.");
        return;
      }
      const response = await api.post("/api/products", {
        name: form.name,
        priceCents,
        category: form.category,
        description: form.description,
        image: form.image,
        stock,
        rating: { stars: 0, count: 0 }
      }, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      setProducts([response.data.product, ...products]);
      setForm({
        name: "",
        priceCents: "",
        category: "",
        description: "",
        image: "",
        stock: "50"
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      alert(error.response?.data?.message || "Failed to add product. Check all required fields.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const adminToken = localStorage.getItem("adminToken");
      await api.delete(`/api/products/${id}`, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) {
      return;
    }
    try {
      const adminToken = localStorage.getItem("adminToken");
      await api.patch(`/api/orders/${orderId}/cancel`, null, {
        headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
      });
      fetchOrders();
      fetchProducts();
    } catch (error) {
      console.error("Failed to cancel order:", error);
      alert(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  const handleAdminLogout = async () => {
    try {
      await api.post("/api/admin/logout");
    } catch (error) {
      console.error("Admin logout API call failed:", error);
    } finally {
      adminLogout();
      navigate("/");
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="admin-user">
          <span>Welcome, {adminName}</span>
          <button onClick={handleAdminLogout} className="logout-btn">
            Logout
          </button>
        </div>
        <button onClick={() => navigate("/")} className="admin-back-btn">Back</button>
      </div>

      <div className="admin-form-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="name"
              placeholder="Product title"
              value={form.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="priceCents"
              placeholder="0.00"
              step="0.01"
              value={form.priceCents}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Count</label>
            <input
              type="number"
              name="stock"
              placeholder="50"
              min="0"
              step="1"
              value={form.stock}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="e.g. Electronics"
              value={form.category}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              placeholder="Product description"
              value={form.description}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image"
              placeholder="https://example.com/image.jpg"
              value={form.image}
              onChange={handleInputChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </form>
      </div>

      <div className="admin-table-section">
        <h2>Products</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>
                  <img
                    src={`/${product.image}`}
                    alt={product.name}
                    className="product-thumb"
                  />
                </td>
                <td>{product.name}</td>
                <td>${(product.priceCents / 100).toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-table-section admin-orders-section">
        <h2>Customer Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-orders">No orders yet.</td>
              </tr>
            )}
            {(orders || []).map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.userId?.name || order.userId?.email || "Unknown"}</td>
                <td>
                  {order.items.map((item, idx) => (
                    <div key={item.productId?._id || item.productId || idx} className="order-item">
                      {item.productId?.name || "Product"} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>${(order.totalCostCents / 100).toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
                <td>
                  {["pending", "processing"].includes(order.status) && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="cancel-btn"
                    >
                      Cancel Order
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
