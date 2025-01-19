import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";
import { useCart } from "./CartContext";

const ProductGrid = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const [jerseys, setJerseys] = useState([]);
  const [showCartPanel, setShowCartPanel] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/app/jerseys/")
      .then((response) => {
        console.log("Jerseys data fetched:", response.data);
        setJerseys(response.data);
      })
      .catch((error) => console.error("Error fetching jerseys:", error));
  }, []);

  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );
  const toggleCartPanel = () => {
    setShowCartPanel(!showCartPanel);
  };
  const proceedToCheckout = () => {
    if (cart.length > 0) {
      navigate("/checkout"); 
    }
  };

  return (
    <div>
      <button className="cart-icon" onClick={toggleCartPanel}>
        🛒 Cart ({cart.length})
      </button>

      <div className={`cart-panel ${showCartPanel ? "show" : ""}`}>
        <button className="close-panel" onClick={toggleCartPanel}>
          X
        </button>
        <h2>Order Summary</h2>
        <ul>
          {cart.map((item, index) => (
            <li key={index}>
              <span>
                {item.name} - ${item.price} - Size: {item.size}
              </span>
              <button
                className="remove-item"
                onClick={() => removeFromCart(index)}
              >
                Remove
              </button>
            </li>
          ))}

          <p className="total-price">Total: {totalPrice.toFixed(2)} bdt</p>
        </ul>

        
        <button
          className="checkout-button"
          disabled={cart.length === 0}
          onClick={proceedToCheckout}
        >
          Proceed to Checkout
        </button>
      </div>

      <div className="product-grid">
        {jerseys.map((jersey) => (
          <div key={jersey.id} className="product-card">
            <div className="image-section">
              <img src={jersey.image} alt={jersey.name} />
            </div>
            <div className="details-section">
              <p className="product-name">{jersey.name}</p>
              <p className="product-price">Price: {jersey.price} bdt</p>
              <p className="product-size">Size: {jersey.size}</p>
              {jersey.in_stock ?(
                <button
                  className="add-to-cart-button"
                  onClick={() => addToCart(jersey)}
                >
                  Add to Cart
                </button>
              ):(
                <button className="out-of-stock-button" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
