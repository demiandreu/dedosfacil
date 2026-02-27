import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import FormularioNRUA from './pages/FormularioNRUA'
import Exito from './pages/Exito'
import MiCuenta from './pages/MiCuenta'
import Admin from './pages/Admin'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Factura from './pages/Factura'
import Valoracion from './pages/Valoracion'
import SolicitarNRUA from './pages/SolicitarNRUA'
import Afiliado from './pages/Afiliado'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/afiliado" element={<Afiliado />} />
        <Route path="/solicitar-nrua" element={<SolicitarNRUA />} />
        <Route path="/valoracion" element={<Valoracion />} />
        <Route path="/factura/:orderId" element={<Factura />} />
        <Route path="/" element={<Landing />} />
        <Route path="/formulario" element={<FormularioNRUA />} />
        <Route path="/formulario-nrua" element={<FormularioNRUA />} />
        <Route path="/exito" element={<Exito />} />
        <Route path="/mi-cuenta" element={<MiCuenta />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
<Route path="/privacidad" element={<Privacidad />} />
<Route path="/cookies" element={<Cookies />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:lang/:slug" element={<BlogPost />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
