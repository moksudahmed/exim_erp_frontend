import React, { useState } from "react";
import { FaDownload, FaSort, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import styles from "./styles/Orders.module.css";
import clsx from "clsx";
import SaleDetailPage from "./SaleDetailPage";
import { addPayments, addSalesPayments } from "../../api/payment";
const OrderComponent = ({ sales, clients }) => {
  const [filters, setFilters] = useState({
    search: "",
    totalMin: "",
    totalMax: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "asc",
  });

  const [selectedSale, setSelectedSale] = useState(null);

  // Sorting handler
  const handleSort = (key) => {
    setSortConfig((prevConfig) => {
      const direction =
        prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc";
      return { key, direction };
    });
  };

  // Filter and sort sales list
  const filteredSales = sales
    .filter((sale) => {
      const client = clients.find((c) => c.client_id === sale.client_id);
      const customerName = client?.account_name?.toLowerCase() || "";
      const searchTerm = filters.search.toLowerCase();

      // Check if search matches customer name OR sale ID (as string)
      const matchesCustomer = !filters.search || customerName.includes(searchTerm);
      const matchesSaleId = !filters.search || sale.id.toString().includes(searchTerm);

      const matchesSearch = matchesCustomer || matchesSaleId;

      const matchesMinTotal =
        !filters.totalMin || sale.total >= parseFloat(filters.totalMin);
      const matchesMaxTotal =
        !filters.totalMax || sale.total <= parseFloat(filters.totalMax);

      return matchesSearch && matchesMinTotal && matchesMaxTotal;
    })
    .sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      if (valueA < valueB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  // CSV export function
  const exportToCSV = () => {
    const headers = [
      "Sale ID",
      "Customer Name",
      "Total",
      "Payment Type",
      "Discount",
      "Created At",
    ];
    const rows = filteredSales.map((sale) => {
      const client = clients.find((c) => c.client_id === sale.client_id);
      const customerName = client ? client.account_name : "Unknown";
      return [
        sale.id,
        customerName,
        sale.total,
        sale.payment_type,
        sale.discount,
        sale.created_at,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Styled payment status badge
  const getStatusBadge = (status) => {
    const style =
      status === "PAID"
        ? styles.statusPaid
        : status === "DUE"
        ? styles.statusDue
        : styles.statusPending;
    return <span className={clsx(styles.statusBadge, style)}>{status}</span>;
  };

  // Action handlers for detail page
  const handleMakePayment = (saleId, paymentData) => {
    alert(`Make payment for Sale #${saleId}`);
    // Implement payment logic here
    
    addSalesPayments(paymentData);
  };

  const handleEditOrder = (saleId) => {
    alert(`Edit order #${saleId}`);
    // Implement edit logic here
  };

  if (selectedSale) {
    const client = clients.find((c) => c.client_id === selectedSale.client_id);
    return (
      <SaleDetailPage
        sale={selectedSale}
        client={client}
        sales={sales}           // <-- pass full sales array here
        onBack={() => setSelectedSale(null)}
        onMakePayment={handleMakePayment}
        onEdit={handleEditOrder}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🧾 Sales Orders</h2>

      <div className={styles.filtersInline}>
        <input
          type="text"
          placeholder="🔍 Search by Customer or Sale ID"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Total"
          value={filters.totalMin}
          onChange={(e) => setFilters({ ...filters, totalMin: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Total"
          value={filters.totalMax}
          onChange={(e) => setFilters({ ...filters, totalMax: e.target.value })}
        />
        <button className={styles.exportBtn} onClick={exportToCSV}>
          <FaDownload /> Export CSV
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort("id")}>
                #ID <FaSort />
              </th>
              <th onClick={() => handleSort("client_id")}>Customer</th>
              <th onClick={() => handleSort("total")}>Total</th>
              <th>Payment Type</th>
              <th>Status</th>
              <th>Discount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => {
              const client = clients.find((c) => c.client_id === sale.client_id);
              const customerName = client ? client.account_name : "Unknown";
              return (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{customerName}</td>
                  <td>৳ {sale.total.toFixed(2)}</td>
                  <td>{sale.payment_type}</td>
                  <td>{getStatusBadge(sale.payment_status || "PENDING")}</td>
                  <td>{sale.discount || 0}%</td>
                  <td>{new Date(sale.created_at).toLocaleString()}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.viewBtn}
                        title="View"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <FaEye />
                      </button>
                      <button title="Edit" onClick={() => handleEditOrder(sale.id)}>
                        <FaEdit />
                      </button>
                      <button title="Delete" className={styles.deleteBtn}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderComponent;
