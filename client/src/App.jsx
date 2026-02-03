import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import FormularioNRUA from './pages/FormularioNRUA'
import Exito from './pages/Exito'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/formulario" element={<FormularioNRUA />} />
        <Route path="/formulario-nrua" element={<FormularioNRUA />} />
        <Route path="/exito" element={<Exito />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
