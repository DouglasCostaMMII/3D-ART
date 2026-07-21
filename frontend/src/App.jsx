import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Cart from './components/Cart'
import Footer from './components/Footer'
import Home from './pages/Home'
import SobrePage from './pages/SobrePage'
import DepoimentosPage from './pages/DepoimentosPage'
import FAQPage from './pages/FAQPage'
import Admin from './pages/Admin'
import Maintenance from './pages/Maintenance'
import { maintenanceMode } from './config/flags'

function StoreLayout({ children }) {
  return (
    <>
      <Header />
      <Cart />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/admin" element={<Admin />} />
        {maintenanceMode ? (
          <Route path="/*" element={<Maintenance />} />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<StoreLayout><Home /></StoreLayout>} />
            <Route path="/sobre" element={<StoreLayout><SobrePage /></StoreLayout>} />
            <Route path="/depoimentos" element={<StoreLayout><DepoimentosPage /></StoreLayout>} />
            <Route path="/faq" element={<StoreLayout><FAQPage /></StoreLayout>} />
            <Route path="/*" element={<StoreLayout><Home /></StoreLayout>} />
          </>
        )}
      </Routes>
    </CartProvider>
  )
}
