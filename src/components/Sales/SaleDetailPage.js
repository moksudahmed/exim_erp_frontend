import React, { useState } from "react";
import styles from "./styles/SaleDetailPage.module.css";
import clsx from "clsx";
import MakePaymentForm from "./MakePaymentForm";

const SaleDetailPage = ({
  sale,
  client,
  sales = [],
  onBack,
  onMakePayment,
  onEdit,
}) => {
  const [isPaying, setIsPaying] = useState(false);

  if (!sale) return null;

  const otherOrders = sales.filter(
    (s) => s.client_id === sale.client_id && s.id !== sale.id
  );

  const getStatusBadge = (status) => {
    const style =
      status === "PAID"
        ? styles.statusPaid
        : status === "DUE"
        ? styles.statusDue
        : styles.statusPending;
    return <span className={clsx(styles.statusBadge, style)}>{status}</span>;
  };

  const handlePaymentSubmit = (paymentData) => {
    // Here you can call API or your handler with paymentData
    console.log(paymentData);
    onMakePayment(sale.id, paymentData);
    setIsPaying(false);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={onBack} aria-label="Back to Orders">
        ← Back to Orders
      </button>

      {!isPaying ? (
        <>
          <h1 className={styles.title}>Order Details - #{sale.id}</h1>

          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <dl className={styles.detailsList}>
              <div>
                <dt>Customer</dt>
                <dd>{client ? client.account_name : "Unknown"}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>৳ {sale.total.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Payment Type</dt>
                <dd>{sale.payment_type}</dd>
              </div>
              <div>
                <dt>Payment Status</dt>
                <dd>{getStatusBadge(sale.payment_status || "PENDING")}</dd>
              </div>
              <div>
                <dt>Discount</dt>
                <dd>{sale.discount || 0}%</dd>
              </div>
              <div>
                <dt>Date</dt>
                <dd>{new Date(sale.created_at).toLocaleString()}</dd>
              </div>
            </dl>

            <div className={styles.actions}>
              <button
                className={clsx(styles.primaryBtn, styles.actionBtn)}
                onClick={() => setIsPaying(true)}
              >
                Make Payment
              </button>
              <button
                className={clsx(styles.secondaryBtn, styles.actionBtn)}
                onClick={() => onEdit(sale.id)}
              >
                Edit Order
              </button>
            </div>
          </section>

          {otherOrders.length > 0 && (
            <section className={styles.card}>
              <h2 className={styles.sectionTitle}>
                Other Orders by {client ? client.account_name : "Customer"}
              </h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Total</th>
                      <th>Payment Type</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {otherOrders.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>৳ {o.total.toFixed(2)}</td>
                        <td>{o.payment_type}</td>
                        <td>{getStatusBadge(o.payment_status || "PENDING")}</td>
                        <td>{new Date(o.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <MakePaymentForm
          saleId={sale.id}
          onSubmit={handlePaymentSubmit}
          onCancel={() => setIsPaying(false)}
        />
      )}
    </div>
  );
};

export default SaleDetailPage;
