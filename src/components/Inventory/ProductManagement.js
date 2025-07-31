import React from 'react';

const ProductManagement = ({ products }) => {
  return (
    <div>
      <h2>Product Management</h2>
      <p>Manage your product list, add new products, and update existing products here.</p>
      {/* You can add more UI for adding or editing products */}
      {/* Render the list of products */}
      <table className="product-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Unit Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.title}>
              <td>{product.title}</td>
              <td>${product.price_per_unit}</td>
              <td>{product.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
