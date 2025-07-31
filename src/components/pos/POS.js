import React, { useState, useEffect } from 'react';
import style from './styles/POS.module.css';
import Receipt from './Receipt';
import Payment from './Payment';
import Cart from './Cart';
import Controls from './Controls';
import SelectItem from './SelectItem';
import ProductList from './ProductList';
import Header from './Header';
import OrderSummary from './OrderSummary';
import Options from './Options';
import { addCashRegister } from '../../api/cashregister';
import { addTransaction } from '../../api/transaction';
import { saveJournalItems } from '../../api/journal_entries';
import { addPayments } from '../../api/payment';
import CustomerSection from './CustomerSection';
import { fetchCustomers} from '../../api/customer';
import { fetchClientsByType } from '../../api/client';
import { fetchSubsidiaryAccounts } from '../../api/subsidiary_account';
import SubsidiaryAccountSelector from './SubsidiaryAccountSelector';
import SubsidiaryAccountSection from './SubsidiaryAccountSection';

const POS = ({ products, onAddSale, onUpdateStock, setCurrentBalance, token }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashGiven, setCashGiven] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);  
  const [cardNumber, setCardNumber] = useState('');
  const [chequeNumber, setChequeNumber] = useState('');
  const [bikashNumber, setBikasNumber] = useState('');
  const [discount, setDiscount] = useState(0);
  const [vat, setVat] = useState(0);
  const [discountedAmount, setDiscountedAmount] = useState(0);
  const [currentDate, setCurrentDate] = useState('');
  const [customerDue, setCustomerDue] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    guestCount: 1,
    diningType: 'Dine-In',
  });

  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const totalAmountBeforeDiscount = cart.reduce(
    (sum, item) => sum + (item.total_price * item.quantity),
    0
  );

  useEffect(() => {
      const loadCustomers = async () => {
        try {
          if (token) {
            const data = await fetchClientsByType('CUSTOMER', token);            
            setCustomers(data);
           
            
          }
        } catch (error) {
          console.error('Error loading customers:', error.message);
        }
      };
      // Get the current date and time
      const now = new Date();
      // Format the date to "YYYY-MM-DDTHH:MM:SS"
      const formattedDate = now.toISOString().slice(0, 19);
      // Set the formatted date in the state
      setCurrentDate(formattedDate);
      loadCustomers();
    }, [token]);

  const totalDiscount = (totalAmountBeforeDiscount * discount) / 100;

  const grossAmount =  ((totalAmountBeforeDiscount - totalDiscount)); 

  const vatAmount = ((totalAmountBeforeDiscount - totalDiscount) * vat) / 100;
  
  const totalAmount = ((totalAmountBeforeDiscount - totalDiscount) + vatAmount);
  
 
  const handleRemoveItem = (productId) => {
    const itemToRemove = cart.find(item => item.product_id === productId);
    if (itemToRemove) {
      setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
      onUpdateStock(itemToRemove.product, itemToRemove.quantity); // Optionally update stock when an item is removed
    }
  };
  
  const handleUpdateQuantity = (productId, newQuantity) => {
    setCart(prevCart => prevCart.map(item => 
      item.product_id === productId
        ? { ...item, quantity: newQuantity, total: newQuantity * item.total_price }
        : item
    ));
  };

  const handleUpdateDiscount = (productId, discount) => {
    setCart(prevCart => prevCart.map(item => 
      item.product_id === productId
        ? { ...item, discount: discount, total: (item.total_price * (1 - item.discount / 100)).toFixed(2) }
        : item
    ));
  };

  const handleTotalDiscountChange = (_discount) => {
   // const discountValue = parseInt(event.target.value, 10) || 0;
    setDiscount(_discount);   
  };

  function getDate() {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${year}/${month}/${date}`;
  }

  const handleCompleteOrder = async(event) => {
    try {
        // event.preventDefault();
    
        //const totalAmount = cart.reduce((sum, item) => sum + item.total_price, 0);
   
          if (cart.length === 0) {
          alert('Cart is empty!');
          return;
        }

        const requiresClient = ['credit', 'bank_transfer', 'bkash'];
        const paymentStatusMap = {
          cash: 'PAID',
          credit: 'PENDING',
          bank_transfer: 'PAID',
          bkash: 'PAID',
        };

        const validateClient = () => {
          if (!selectedAccount) {
            alert("Please select client account!");
            return false;
          }
          return true;
        };

        const validateField = (value, fieldName) => {
          if (!value) {
            alert(`Please enter ${fieldName}!`);
            return false;
          }
          return true;
        };

        let paymentStatus = paymentStatusMap[paymentMethod];
        let clientId = selectedAccount?.client_id || 1;
        console.log(selectedAccount);
        // Special handling for cash
        if (paymentMethod === 'CASH') {
          const change = cashGiven - totalAmount;
          if (change < 0) {
            if (!window.confirm('Insufficient cash given. Do you want to continue and record the rest as credit?')) {
              return;
            }
            if (!validateClient()) return;
            paymentStatus = 'PARTIAL';
            
          }else{
            paymentStatus = 'PAID';
          }
        } else if (requiresClient.includes(paymentMethod) && !validateClient()) {
          paymentStatus = 'PENDING';
          return;
        } else if (paymentMethod === 'bank_transfer' && !validateField(chequeNumber, 'cheque number')) {
           paymentStatus = 'PAID';
          return;
        } else if (paymentMethod === 'bkash' && !validateField(bikashNumber, 'bkash number')) {
           paymentStatus = 'PAID';
          return;
        }

        const sale = {
          user_id: 1,
          total: totalAmount,
          sale_products: cart,
          discount,
          client_id: clientId,
          business_id: 1,
          payment_status: paymentStatus
        };
        const due = cashGiven - totalAmount;
        const payment = {      
                  business_id :1,        
                  amount: cashGiven,
                  payment_method: paymentMethod,
                  reference_number: chequeNumber || bikashNumber || '',
                  notes : paymentStatus
          };
        const payload = {
          sale,
          payment
        };
       // console.log(payload);
        const order = await onAddSale(payload);

        console.log("Sale completed:", order);
        const paymentPlayload = {      
                  business_id :1,        
                  amount: totalAmount,
                  payment_method: paymentMethod,
                  reference_number: '1',
                  notes : paymentStatus,                          
                  sale_id : order.id
          };
        
        const savedPayment = await addPayments(paymentPlayload, token);   

        /*const salePayload = {
              user_id: 1,
              total: totalAmount,
              sale_products: cart,
              discount,
              client_id: selectedAccount.client_id,
              business_id: 1,
              payment_status:'PENDING'
        }; */
   
    // Add Sale entry
    //const order = await onAddSale(salePayload);
    
    //console.log("Sale completed:", order);
    
    /*
    const change = cashGiven - totalAmount;
    if (change < 0) {       

        const cashPaymentPlayload = {      
                      business_id :1,        
                      amount: cashGiven,
                      payment_method: 'cash',
                      reference_number: '1',
                      notes : "Partial cash payment",              
                      sale_id : order.id                                           
              };
            
              const creditPaymentPlayload = {      
                      business_id :1,        
                      amount: change,
                      payment_method: 'credit',
                      reference_number: '1',
                      notes : "Partial credit",    
                      sale_id : order.id                                                                                   
              };
        const savedCashPayment = await addPayments(cashPaymentPlayload, token); 
        const savedCreditPayment = await addPayments(creditPaymentPlayload, token); 
        const pay = cashGiven;
        const due = change;
        Receipt({ cart, grossAmount, totalAmount, vatAmount, order, selectedAccount, pay, due});
        if (cashGiven>0){     
              const journalItems = [
                      {
                          "narration": "Cash",
                          "debitcredit": "DEBIT",
                          "amount": cashGiven,
                          "account_id": 1,
                          "subsidiary_account_id":selectedAccount.subsidiary_account_id
                      },
                      {
                          "narration": "Accounts Receivable",
                          "debitcredit": "DEBIT",
                          "amount": totalAmount - cashGiven,
                          "account_id": 2,
                          "subsidiary_account_id":selectedAccount.subsidiary_account_id
                      },
                      {
                          "narration": "To Sale",
                          "debitcredit": "CREDIT",
                          "amount": order.total,
                          "account_id": 3,
                          "subsidiary_account_id":selectedAccount.subsidiary_account_id
                      }
                  ];

                const journalPayload = {
                  ref_no: `Order No- ${order.id}`,
                  account_type: 'revenue',        
                  company: `Customer No- ${selectedAccount.subsidiary_account_id}`,
                  description:'Sale',
                  transaction_date: order.created_at,
                  user_id: 1,
                  journal_items: journalItems,
                };     
              
                await saveJournalItems(token, journalPayload);
        }else{
                const journalItems = [                      
                      {
                          "narration": "Accounts Receivable",
                          "debitcredit": "DEBIT",
                          "amount": totalAmount,
                          "account_id": 2,
                          "subsidiary_account_id":selectedAccount.subsidiary_account_id
                      },
                      {
                          "narration": "To Sale",
                          "debitcredit": "CREDIT",
                          "amount": order.total,
                          "account_id": 3,
                          "subsidiary_account_id":selectedAccount.subsidiary_account_id
                      }
                  ];

                const journalPayload = {
                  ref_no: `Order No- ${order.id}`,
                  account_type: 'revenue',        
                  company: `Customer No- ${selectedAccount.subsidiary_account_id}`,
                  description:'Sale',
                  transaction_date: order.created_at,
                  user_id: 1,
                  journal_items: journalItems,
                };     
              
                await saveJournalItems(token, journalPayload);

        }
    }else{
          const paymentPlayload = {      
                  business_id :1,        
                  amount: totalAmount,
                  payment_method: paymentMethod,
                  reference_number: '1',
                  notes : 'Paid',                          
                  sale_id : order.id
          };
          
          const savedPayment = await addPayments(paymentPlayload, token);   
          const pay = totalAmount;
          const due = 0; 
          Receipt({ cart, grossAmount, totalAmount, vatAmount, order, selectedAccount, pay, due });      

          const journalItems = [
                {
                    "narration": "Cash",
                    "debitcredit": "DEBIT",
                    "amount": order.total,
                    "account_id": 1,
                    "subsidiary_account_id":selectedAccount.subsidiary_account_id
                },
                {
                    "narration": "To Sale",
                    "debitcredit": "CREDIT",
                    "amount": order.total,
                    "account_id": 3,
                    "subsidiary_account_id":selectedAccount.subsidiary_account_id
                }
            ];

          const journalPayload = {
            ref_no: `Order No- ${order.id}`,
            account_type: 'revenue',        
            company: `Customer No- ${selectedAccount.subsidiary_account_id}`,
            description:'Sale',
            transaction_date: order.created_at,
            user_id: 1,
            journal_items: journalItems,
          };    
        
        
          await saveJournalItems(token, journalPayload);
        
    }

    */
            
     
    
    // Add Cash Register entry
   /* addCashRegister({
      user_id: 1,
      action_type: 'CASH_INFLOW',
      amount: parseFloat(totalAmount),
      description: `Sale of products - ${cart.length} items`
    }, token);*/
  
    // Add Transaction entry  
            
    // Update the frontend cash register state (if needed)
    
    
    setCurrentBalance((prevBalance) => prevBalance + totalAmount);
  
    // Reset the state for the next sale
    setCart([]);
    setPaymentMethod('cash');
    setCashGiven(0);
    setCardNumber('');
    setDiscount(0);   
    setCashGiven(0);
    setChangeAmount(0);
   } catch (error) {
    console.error("Failed to add sale:", error);
  }
  };
  
  const handleNoSale = () => {
    setCart([]);
  };

  const handleDiningTypeChange = (type) => {
    setOrderDetails((prevState) => ({
      ...prevState,
      diningType: type,
    }));
  };

  const handleGuestCountChange = (count) => {
    setOrderDetails((prevState) => ({
      ...prevState,
      guestCount: count,
    }));
  };
  
  return (
    <div className={style.posContainer}>
      <div className={style.orderSection}>
        {/*<Header  orderDetails={orderDetails}/> */}
        <SelectItem
          products={products}
          selectedProduct={selectedProduct}
          quantity={quantity}
          setSelectedProduct={setSelectedProduct}
          cart={cart}
          setCart={setCart}
          onUpdateStock={onUpdateStock}
          setQuantity={setQuantity}
        />
        <Cart cart={cart} 
              handleRemoveItem={handleRemoveItem} 
              handleUpdateQuantity={handleUpdateQuantity} 
              handleUpdateDiscount={handleUpdateDiscount} 
        />
        
       <CustomerSection        
          token={token}
          customers={customers}
          setCustomers={setCustomers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
          setCustomerDue={setCustomerDue}
         // subsidiaryAccounts={subsidiaryAccounts}
         // selectedClient={selectedClient}
         // setSelectedClient={setSelectedClient}
        />
       {/* <SubsidiaryAccountSection
          selectedAccount={selectedAccount}
          setSelectedAccount={setSelectedAccount}
          token={token}
        />*/}
        <Options handleNoSale = {handleNoSale}  
              handleGuestCountChange={handleGuestCountChange} 
              handleDiningTypeChange={handleGuestCountChange} 
              totalAmount={totalAmount} 
              handleCompleteOrder={handleCompleteOrder}
              token={token}
        />
       
      </div>
      <div className={style.orderSummary}>
          <OrderSummary subTotalAmount={totalAmountBeforeDiscount} 
                        totalDiscount={totalDiscount} 
                        discount={discount} 
                        totalAmount={totalAmount} 
                        vat={vat}
                        vatAmount={vatAmount}   
                        grossAmount={grossAmount}        
                        handleTotalDiscountChange={handleTotalDiscountChange} />
          <Payment paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  setCashGiven={setCashGiven}
                  setCardNumber={setCardNumber}
                  cashGiven={cashGiven}
                  cardNumber={cardNumber}
                  totalAmount={totalAmount}
                  changeAmount={changeAmount}
                  setChangeAmount={setChangeAmount}
                  chequeNumber={chequeNumber}
                  setChequeNumber={setChequeNumber}
                  bikashNumber={bikashNumber}
                  setBikasNumber={setBikasNumber}
                  />
      </div>      

      <ProductList
        products={products}
        cart={cart}
        setCart={setCart}
        onUpdateStock={onUpdateStock}
        quantity={quantity}
        discount={discount}
        handleUpdateQuantity={handleUpdateQuantity}        
      />
    </div>
  );
};

export default POS;
