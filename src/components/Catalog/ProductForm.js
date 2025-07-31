import React, { useState } from 'react';
import styles from './styles/ProductForm.module.css';

const ProductForm = ({ onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [productType, setProductType] = useState('tangible');
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('');
  const [quantityPerUnit, setQuantityPerUnit] = useState('');
  const [isStockTracked, setIsStockTracked] = useState(true);
  const [taxRate, setTaxRate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProduct = {
      title,
      price_per_unit: parseFloat(pricePerUnit),
      stock: parseInt(stock, 10),
      category,
      sub_category: subCategory,
      product_type: productType,
      unit_of_measurement: unitOfMeasurement || null,
      quantity_per_unit: quantityPerUnit ? parseFloat(quantityPerUnit) : null,
      is_stock_tracked: isStockTracked,
      tax_rate: taxRate ? parseFloat(taxRate) : null,
      description,
      business_id:1
    };
    
    onAddProduct(newProduct);

    // Clear form
    setTitle('');
    setPricePerUnit('');
    setStock('');
    setCategory('');
    setSubCategory('');
    setProductType('tangible');
    setUnitOfMeasurement('kg');
    setQuantityPerUnit('');
    setIsStockTracked(true);
    setTaxRate('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm}>
      <div className={styles.inputGroup}>
        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className={styles.inputGroup}>
        <label>Price per Unit:</label>
        <input type="number" step="0.01" value={pricePerUnit} onChange={(e) => setPricePerUnit(e.target.value)} required />
      </div>

      <div className={styles.inputGroup}>
        <label>Stock:</label>
        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
      </div>

      <div className={styles.inputGroup}>
        <label>Category:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>

      <div className={styles.inputGroup}>
        <label>Sub Category:</label>
        <input type="text" value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
      </div>

      {/*<div className={styles.inputGroup}>
        <label>Product Type:</label>
        <select value={productType} onChange={(e) => setProductType(e.target.value)}>
          <option value="tangible">Tangible</option>
          <option value="intangible">Intangible</option>
        </select>
      </div>
        */}
      <div className={styles.inputGroup}>
        <label>Unit of Measurement:</label>
        <select value={unitOfMeasurement} onChange={(e) => setUnitOfMeasurement(e.target.value)}>
          <option value="piece">PIECE</option>
          <option value="kg">KG</option>
           <option value="mt">METRIC TONS</option>
          <option value="g">G</option>
          <option value="lb">LB</option>
          <option value="litre">LITRE</option>
          <option value="ml">ML</option>
          <option value="meter">METER</option>
          <option value="cm">CM</option>
          <option value="pack">PACK</option>
          <option value="box">BOX</option>
          <option value="dozen">DOZEN</option>
          <option value="carton">CARTON</option>
          <option value="set">SET</option>
          <option value="hour">HOUR</option>
          <option value="service">SERVICE</option>
        </select>
      </div>      

      <div className={styles.inputGroup}>
        <label>Quantity per Unit:</label>
        <input type="number" step="0.01" value={quantityPerUnit} onChange={(e) => setQuantityPerUnit(e.target.value)} />
      </div>

      <div className={styles.inputGroup}>
        <label>Track Stock:</label>
        <input type="checkbox" checked={isStockTracked} onChange={(e) => setIsStockTracked(e.target.checked)} />
      </div>

      <div className={styles.inputGroup}>
        <label>Tax Rate (%):</label>
        <input type="number" step="0.01" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
      </div>

      <div className={styles.inputGroup}>
        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <button type="submit" className={styles.submitButton}>
        Add Product
      </button>
    </form>
  );
};

export default ProductForm;
