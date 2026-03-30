import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error(error));
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
  };

  const totalCarrito = carrito.reduce((total, prod) => total + prod.precio, 0);

  return (
    <div className="App">
      <header>
        <h1>🌱 EcoMarket</h1>
        <div className="carrito-resumen">
          🛒 Carrito: {carrito.length} | Total: ${totalCarrito}
        </div>
      </header>

      <main>
        <h2>Catálogo de Plantas</h2>
        <div className="grilla-productos">
          {productos.map(producto => (
            <div key={producto.id} className="tarjeta-producto">
              <div className="icono-planta">{producto.imagenUrl}</div>
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p className="precio">${producto.precio}</p>
              <button onClick={() => agregarAlCarrito(producto)}>
                Agregar
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;