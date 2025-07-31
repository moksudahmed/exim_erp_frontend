import React, { useState, useEffect } from "react";
import styles from "./styles/Sales.module.css";
import { FaEdit, FaTrashAlt, FaPrint, FaSort, FaDownload, FaEye, FaMoneyBill } from "react-icons/fa";
import { saveAs } from "file-saver";
import EditSaleModal from "./EditSaleModal";
import OpenSaleModal from "./OpenSaleModal";
import PaymentModal from "./PaymentModal";
import axios from "axios";
import { fetchSales, updateSale } from "../../api/sales";

const Sales = ({ clients, sales = [], products, onUpdateSale, onDeleteSale, isAuthenticated, token }) => {
  const [editingSale, setEditingSale] = useState(null);
  const [payingSale, setPayingSale] = useState(null);
  const [openingSale, setOpeningSale] = useState(null);
  const [filters, setFilters] = useState({ search: "", totalMin: "", totalMax: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const salesPerPage = 20;

  useEffect(() => setCurrentPage(1), [filters]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredSales = sales
    .filter((sale) => {
      const matchesSearch = !filters.search || sale.id.toString().includes(filters.search);
      const matchesMinTotal = !filters.totalMin || sale.total >= parseFloat(filters.totalMin);
      const matchesMaxTotal = !filters.totalMax || sale.total <= parseFloat(filters.totalMax);
      return matchesSearch && matchesMinTotal && matchesMaxTotal;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;
  const currentSales = filteredSales.slice(indexOfFirstSale, indexOfLastSale);

  const exportToCSV = () => {
    const csvContent = [
      ["Sale ID", "Customer", "Total", "Discount"].join(","),
      ...filteredSales.map(
        (sale) =>
          `${sale.id},${clients.find((c) => c.client_id === sale.client_id)?.account_name || "N/A"},${sale.total},${sale.discount}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales_data.csv");
  };

  const handleEdit = (sale) => {
    setEditingSale({ ...sale, sale_products: sale.sale_products.map((item) => ({ ...item })) });
  };

  const handleOpen = (sale) => {
    setOpeningSale(sale);
  };

  const handlePayment = (sale) => {
    setPayingSale(sale);
  };

  const handleOnUpdateSale = async (updatedSale) => {
    if (!isAuthenticated || !token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      if (!updatedSale.sale_products || updatedSale.sale_products.length === 0) {
        alert("Sale must have at least one product.");
        return;
      }

      let newTotal = 0;
      let insufficientStock = false;

      const updatedSaleProducts = updatedSale.sale_products.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return item;

        if (item.quantity > product.stock) {
          alert(`Not enough stock for ${product.title}.`);
          insufficientStock = true;
        }

        const total_price = product.price_per_unit * item.quantity;
        newTotal += total_price;

        return { ...item, price_per_unit: product.price_per_unit, total_price };
      });

      if (insufficientStock) return;

      const saleData = {
        ...updatedSale,
        sale_products: updatedSaleProducts,
        total: newTotal,
      };

      const response = await updateSale(saleData, token);
      if (!response.ok) throw new Error("Failed to update sale");

      const newSales = await fetchSales(token);
      setEditingSale(null);
      alert("Sale updated successfully!");
      onUpdateSale(newSales);
    } catch (error) {
      alert(`Error updating sale: ${error.message}`);
    }
  };

  const handleOnDeleteSale = async (saleId) => {
    if (!saleId) return alert("Invalid sale ID");
    if (!window.confirm("Delete this sale?")) return;

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/v1/sales/${saleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 || response.status === 204) {
        alert("Sale deleted successfully!");
        onDeleteSale(saleId);
      } else {
        throw new Error("Delete failed.");
      }
    } catch (error) {
      alert(`Error deleting sale: ${error.response?.data?.message || error.message}`);
    }
  };

  const onPrintSale = (sale) => {
    const win = window.open("", "_blank");
    if (!win) return alert("Allow pop-ups to print.");

    const saleItemsHtml = sale.sale_products.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      return `<tr><td>${product?.title || "Unknown"}</td><td>${item.quantity}</td><td>$${(item.price_per_unit * item.quantity).toFixed(2)}</td></tr>`;
    }).join("");

    win.document.write(`
      <html><head><title>Receipt</title></head>
      <body>
        <h2>Sale Receipt</h2>
        <p><strong>Sale ID:</strong> ${sale.id}</p>
        <p><strong>Customer:</strong> ${sale.account_name || "N/A"}</p>
        <table border="1" cellspacing="0" cellpadding="5">
          <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${saleItemsHtml}</tbody>
        </table>
        <p><strong>Total:</strong> $${sale.total.toFixed(2)}</p>
        <p><strong>Discount:</strong> $${sale.discount.toFixed(2)}</p>
        <script>window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 300); };</script>
      </body></html>
    `);
    win.document.close();
  };

  const totalPages = Math.ceil(filteredSales.length / salesPerPage);

  return (
    <div className={styles.salesContainer}>
      <h2 className={styles.title}>Sales Management</h2>

      <div className={styles.actionsContainer}>
        <input
          type="text"
          placeholder="Search by ID"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <button onClick={exportToCSV}><FaDownload /> Export CSV</button>
      </div>

      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID <FaSort /></th>
            <th>Customer</th>
            <th>Items</th>
            <th onClick={() => handleSort("total")}>Total <FaSort /></th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{clients.find((c) => c.client_id === sale.client_id)?.account_name || "N/A"}</td>
              <td>{sale.sale_products.map((item) => `${item.product_id} x ${item.quantity}`).join(", ")}</td>
              <td>${sale.total.toFixed(2)}</td>
              <td>{sale.payment_status}</td>
              <td>
                <button onClick={() => handleOpen(sale)}><FaEye /></button>
                <button onClick={() => handleEdit(sale)}><FaEdit /></button>
                <button onClick={() => onPrintSale(sale)}><FaPrint /></button>
                <button onClick={() => handlePayment(sale)}><FaMoneyBill /></button>
                <button onClick={() => handleOnDeleteSale(sale.id)}><FaTrashAlt /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Prev</button>
        {[...Array(totalPages).keys()].map((num) => {
          const page = num + 1;
          return (
            <button
              key={page}
              className={currentPage === page ? styles.activePage : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          );
        })}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>

      {editingSale && (
        <EditSaleModal
          editingSale={editingSale}
          products={products}
          handleItemChange={(index, field, value) => {
            setEditingSale((prev) => {
              const updated = [...prev.sale_products];
              updated[index][field] = value;
              return { ...prev, sale_products: updated };
            });
          }}
          handleSaveClick={() => handleOnUpdateSale(editingSale)}
          setEditingSale={setEditingSale}
        />
      )}

      {payingSale && (
        <PaymentModal
          sale={payingSale}
          client={clients.find((c) => c.client_id === payingSale.client_id)}
          token={token}
          onClose={() => setPayingSale(null)}
        />
      )}

      {openingSale && (
        <OpenSaleModal
          sale={openingSale}
          products={products}
          onClose={() => setOpeningSale(null)}
        />
      )}
    </div>
  );
};

export default Sales;
