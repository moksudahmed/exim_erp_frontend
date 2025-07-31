import React, { useState } from "react";
import styles from "./styles/MakePaymentForm.module.css";


const paymentMethods = [
  "cash",
  "credit",
  "bank_transfer",
  "bkash"
  // add other enum values here...
];

const MakePaymentForm = ({ saleId, onSubmit, onCancel }) => {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().slice(0, 16)); // ISO local datetime format yyyy-MM-ddTHH:mm
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!amount || Number(amount) <= 0) {
      errs.amount = "Amount must be greater than zero";
    }
    if (!paymentMethod) {
      errs.paymentMethod = "Select a payment method";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    // Build payment data object according to your DB schema
    const paymentData = {
      sale_id: saleId,
      business_id:1,
      amount: Number(amount),
      payment_method: paymentMethod,
      reference_number: referenceNumber || saleId,
      notes: notes || null,
      payment_date: new Date(paymentDate).toISOString(),
    };

    onSubmit(paymentData);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>Make Payment for Sale #{saleId}</h2>

      <label>
        Amount <span className={styles.required}>*</span>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className={errors.amount ? styles.inputError : ""}
        />
        {errors.amount && <div className={styles.errorMsg}>{errors.amount}</div>}
      </label>

      <label>
        Payment Method <span className={styles.required}>*</span>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className={errors.paymentMethod ? styles.inputError : ""}
        >
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {errors.paymentMethod && <div className={styles.errorMsg}>{errors.paymentMethod}</div>}
      </label>

      <label>
        Reference Number
        <input
          type="text"
          value={referenceNumber}
          onChange={(e) => setReferenceNumber(e.target.value)}
          placeholder="Optional"
        />
      </label>

      <label>
        Notes
        <textarea
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes"
        />
      </label>

      <label>
        Payment Date
        <input
          type="datetime-local"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </label>

      <div className={styles.buttons}>
        <button type="submit" className={styles.primaryBtn}>
          Submit Payment
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default MakePaymentForm;
