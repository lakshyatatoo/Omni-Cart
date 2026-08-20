import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import api from "../../utils/axios";
import "./AdminDashboard.css";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    imageUrl: "",
    stock: ""
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/products", {
        title: form.title,
        price: form.price,
        category: form.category,
        description: form.description,
        imageUrl: form.imageUrl,
        stock: form.stock
      });
      setProducts([response.data.product, ...products]);
      setForm({
        title: "",
        price: "",
        category: "",
        description: "",
        imageUrl: "",
        stock: ""
      });
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      await api.delete(`/api/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={() => navigate("/")} className="admin-back-btn">Back</button>
      </div>

      <div className="admin-form-section">
        <h2>Add New Product</h2>
        <form onSubmit={handleAddProduct} className="product-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Product title"
              value={form.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              value={form.price}
              onChange={handleInputChange}
              required
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
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              value={form.stock}
              onChange={handleInputChange}
              min="0"
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
              <th>Title</th>
              <th>Price</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>{product.title}</td>
                <td>${parseFloat(product.price).toFixed(2)}</td>
                <td>{product.category || "-"}</td>
                <td>{product.stock || 0}</td>
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
    </div>
  );
}