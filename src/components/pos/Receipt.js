const receiptStyles = `
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #333;
    }
    h2 {
      text-align: center;
      margin-bottom: 15px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f0f0f0;
      font-weight: bold;
    }
    p {
      margin: 5px 0;
    }
  </style>
`;

const Receipt = ({ cart, grossAmount, totalAmount, vatAmount, order, selectedAccount, pay, due }) => {
  const dueRow = due < 0
    ? `
      <tr>
        <th></th>
        <th></th>
        <th><strong>Due</strong></th>
        <th><strong>: Tk ${due.toFixed(2)}</strong></th>
      </tr>
    `
    : '';

  const receiptContent = `
    <h2>Receipt</h2>
    <p>Order #${order.id}</p>
    <p>${selectedAccount.label}</p>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Qty</th>
          <th>Each</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${cart.map(item => `
          <tr>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>Tk ${item.price_per_unit ? item.price_per_unit.toFixed(2) : '0.00'}</td>
            <td>Tk ${(item.price_per_unit * item.quantity).toFixed(2)}</td>
          </tr>
        `).join('')}
        <tr>
          <th></th>
          <th></th>
          <th><strong>Gross Amount</strong></th>
          <th><strong>: Tk ${grossAmount.toFixed(2)}</strong></th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th><strong>VAT 5%</strong></th>
          <th><strong>: Tk ${vatAmount.toFixed(2)}</strong></th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th><strong>Net Amount</strong></th>
          <th><strong>: Tk ${totalAmount.toFixed(2)}</strong></th>
        </tr>
        <tr>
          <th></th>
          <th></th>
          <th><strong>Pay</strong></th>
          <th><strong>: Tk ${pay.toFixed(2)}</strong></th>
        </tr>
        ${dueRow}
      </tbody>
    </table>
    <p><strong>Thank you</strong></p>
  `;

  const receiptWindow = window.open('', '_blank', 'width=400,height=600');
  
  if (receiptWindow) {
    receiptWindow.document.write(receiptStyles + receiptContent);
    receiptWindow.document.close();
    receiptWindow.print();
  } else {
    console.error('Failed to open a new window for printing the receipt.');
  }
};

export default Receipt;
