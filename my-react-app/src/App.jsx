import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Header from './Components/Navbar';
import {BrowserRouter as Router,Route,Routes} from "react-router-dom"
import Home from "./Pages/Home"
import Shop from "./Pages/Shop"
import Checkout from "./Pages/Checkout";
import { CartProvider } from './Components/CartContext';


function App() {
  return (
    <>    <CartProvider>
          <Router>
            <Header /> 
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Shop" element={<Shop />} />
                <Route path="/Checkout" element={<Checkout/>}/>
            </Routes>
        </Router>
        </CartProvider>
  
  
     
    </>
  );
}

export default App;