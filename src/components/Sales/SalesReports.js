import React, { useState, useMemo } from "react";
import { CSVLink } from "react-csv";
import "./styles/SalesReports.css";

const SalesReports = ({ sales, products }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Function to format dates in a readable format
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Memoized filtered sales to optimize performance
  const filteredSales = useMemo(() => {
    if (!startDate || !endDate) return sales;

    const start = new Date(startDate);
    const end = new Date(endDate);

    return sales.filter((sale) => {
      const saleDate = new Date(sale.created_at);
      return saleDate >= start && saleDate <= end;
    });
  }, [sales, startDate, endDate]);

  // Generate CSV data with proper formatting
  const csvData = useMemo(() => {
    return filteredSales.map((sale) => {
      const product = products.find((p) => p.id === sale.product_id);
      return {
        Date: formatDate(sale.created_at),
        Product: product ? product.title : "Unknown Product",
        Amount: `$${sale.total.toFixed(2)}`,
      };
    });
  }, [filteredSales, products]);

  return (
    <div className="sales-reports-container">
      <h2>Sales Reports</h2>

      {/* Filters */}
      <div className="filters">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>

      <button className="generate-btn" disabled={!startDate || !endDate}>
        Generate Report
      </button>

      {/* Sales Table */}
      <div className="table-container">
        <table className="report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) =>
                sale.sale_products.map((item) => {
                  const product = products.find((p) => String(p.id) === String(item.product_id));
                  return (
                    <tr key={`${sale.id}-${item.id}`}>
                      <td>{formatDate(sale.created_at)}</td>
                      <td>{product ? product.title : <span style={{ color: "red" }}>Unknown Product</span>}</td>
                      <td>${item.total_price.toFixed(2)}</td>
                    </tr>
                  );
                })
              )
            ) : (
              <tr>
                <td colSpan="3" className="no-data">No sales found for the selected period</td>
              </tr>
            )}
          </tbody>


        </table>
      </div>

      {/* CSV Export */}
      <CSVLink data={csvData} filename="sales_report.csv" className="export-btn">
        Export as CSV
      </CSVLink>
    </div>
  );
};

export default SalesReports;
