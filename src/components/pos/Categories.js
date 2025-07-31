import React from 'react';
import style from './styles/Categories.module.css';

const Categories = ({ products, onAddToCart }) => {
  const categories = Array.from(new Set(products.map(product => product.category)));

  const handleAddToCart = (product) => {
    const quantity = 1;
    const discount = 0;
    onAddToCart(product, quantity, discount);
  };

  return (
    <div className={style.categoriesContainer}>
      {categories.map(category => (
        <div key={category} className={style.category}>
          <h3>{category}</h3>
          <div className={style.productGrid}>
            {products.filter(product => product.category === category).map(product => (
              <button
                key={product.id}
                className={style.productButton}
                onClick={() => handleAddToCart(product)}
              >
                {product.title}
              </button>
            ))}
          </div>
        </div>
      ))}
      {categories.length === 0 && <div className={style.noCategories}>No categories available.</div>}
    </div>
  );
};

export default Categories;
