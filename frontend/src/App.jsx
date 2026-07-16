import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Cart from './components/Cart'
import Home from './pages/Home'
import Admin from './pages/Admin'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route
          path="/*"
          element={
            <>
              <Header />
              <Cart />
              <main className="pt-16">
                <Home />
              </main>
            </>
          }
        />
      </Routes>
    </CartProvider>
  )
}
