import React, { useState, useEffect } from "react";
import { useCart } from "../Components/CartContext";
import axios from "axios";
import "./Checkout.css";

const Checkout = () => {
  const { cart, user, clearCart } = useCart();
  const [formData, setFormData] = useState({
    email: user?.email || "", 
    address: "",
    phone: "",
    payment_method: "",
    First_Name: "",
    Last_Name: "",
  });

  useEffect(() => {
    if (user.email) {
      console.log("Setting email in formData from user:", user.email);
      setFormData((prevData) => ({
        ...prevData,
        email: user.email,
      }));
    }
  }, [user.email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    if (!formData.email) {
      alert("Email is missing. Please log in to proceed.");
      return;
    }
  
  
    const orderData = {
      email: formData.email,
      First_Name: formData.First_Name,
      Last_Name: formData.Last_Name,
      address: formData.address,
      phone: formData.phone,
      total_price: totalPrice,
      payment_method: formData.payment_method,
      items: cart.map((item) => ({
        jersey: item.id, 
        quantity: 1, 
      })),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/app/orders/",
        orderData
      );

      alert("Order confirmed! Thank you for your purchase.");
      console.log("Order response:", response.data);

     
      clearCart();

     
      setFormData({
        email: user.email,
        address: "",
        phone: "",
        payment_method: "",
        First_Name: "",
        Last_Name: "",
      });
    } catch (error) {
      console.error(
        "Error submitting order:",
        error.response ? error.response.data : error
      );
      alert("There was an error processing your order. Please try again.");
    }
  };


  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price),
    0
  );

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <label>
          Email:
          {formData.email ? (
            <input type="email" name="email" value={formData.email} readOnly />
          ) : (
            <p className="login-prompt">Please log in for email input</p>
          )}
        </label>
        <label>
          First Name:
          <input
            type="text"
            name="First_Name"
            value={formData.First_Name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Last Name:
          <input
            type="text"
            name="Last_Name"
            value={formData.Last_Name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Payment Method:
          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
          >
            <option value="">Select Payment Method</option>
            <option value="online">Online payment</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </label>

        
        <div className="order-summary">
          <h3>Order Summary</h3>
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name}- Size: {item.size} - {item.price} bdt{" "}
              </li>
            ))}
          </ul>
          <p>
            <strong>Total:</strong> {totalPrice.toFixed(2)} bdt
          </p>
        </div>

        <button type="submit" className="confirm-button">
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
