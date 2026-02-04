import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import FormularioNRUA from './pages/FormularioNRUA'
import Exito from './pages/Exito'
import Admin from './pages/Admin'
import AvisoLegal from './pages/AvisoLegal'
import Privacidad from './pages/Privacidad'
import Cookies from './pages/Cookies'
import Factura from './pages/Factura'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/factura/:orderId" element={<Factura />} />
        <Route path="/" element={<Landing />} />
        <Route path="/formulario" element={<FormularioNRUA />} />
        <Route path="/formulario-nrua" element={<FormularioNRUA />} />
        <Route path="/exito" element={<Exito />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
<Route path="/privacidad" element={<Privacidad />} />
<Route path="/cookies" element={<Cookies />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
