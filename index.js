const express = require("express");
const Contenedor = require("./contenedor");

const PORT = process.env.PORT || 8080;

// Instancias
const app = express();
const contenedorProductos = new Contenedor("productos", "./data");

// Middlewares
app.use(express.static("public"));

// Rutas
app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "/public/index.html"));
});
app.get("/productos", async (req, res) => {
  const productos = await contenedorProductos.getAll();
  res.json(productos);
});
app.get("/productoRandom", async (req, res) => {
  const cantidadProductos = (await contenedorProductos.getAll()).length;
  // Asumo primer ID=1 y IDs continuos:
  const idRandom = Math.floor(Math.random() * cantidadProductos + 1);
  console.log(idRandom);
  // Podía usar idRandom directamente en el array de contenedorProductos.getAll, pero así uso más métodos de la clase:
  const productoRandom = await contenedorProductos.getById(idRandom);
  res.json(productoRandom);
});

// Inicialización
const connectedServer = app.listen(PORT, () => {
  console.log("Servidor iniciado.");
  console.log(`Escuchando en el puerto: ${PORT}.`);
});

// Manejo de eventos
connectedServer.on("error", (err) => {
  console.log(err.message);
});
