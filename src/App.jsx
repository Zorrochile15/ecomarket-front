import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Usamos tu usuario para mantener el carrito separado en la base de datos
  const usuarioId = "MaximoLF"; 

  // 1. Cargar el catálogo desde el Microservicio 1 (Puerto 8080)
  useEffect(() => {
    fetch('http://localhost:8080/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error("Error cargando catálogo:", error));
  }, []);

  // 2. Cargar el carrito guardado desde el Microservicio 2 (Puerto 8081)
  useEffect(() => {
    fetch(`http://localhost:8081/carrito/${usuarioId}`)
      .then(response => response.json())
      .then(data => setCarrito(data))
      .catch(error => console.error("Error cargando carrito:", error));
  }, []);

  // 3. Enviar un nuevo producto al Microservicio 2 (Puerto 8081)
  const agregarAlCarrito = (producto) => {
    const nuevoItem = {
      productoId: producto.id,
      nombre: producto.nombre,
      cantidad: 1,
      precioTotal: producto.precio
    };

    fetch(`http://localhost:8081/carrito/${usuarioId}/agregar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoItem)
    })
    .then(response => response.json())
    .then(data => {
      // Actualizamos la vista solo cuando el backend confirma que se guardó
      setCarrito([...carrito, data]);
    })
    .catch(error => console.error("Error agregando al carrito:", error));
  };

  const totalCarrito = carrito.reduce((total, item) => total + item.precioTotal, 0);

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