const fs = require("fs/promises");

class Contenedor {
  constructor(nombre = "default", ruta = ".") {
    this.nombre = nombre;
    this.ruta = `${ruta}/${nombre}.txt`;
  }

  /** Obtiene lista de productos en base a la información actual del archivo */
  async _getCurrentProducts() {
    try {
      const currentData = await fs.readFile(this.ruta, "utf-8");
      if (!currentData) return [];
      const currentProducts = JSON.parse(currentData);
      return currentProducts;
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Escribe la lista de productos pasada en el archivo */
  async _setProducts(products) {
    try {
      await fs.writeFile(this.ruta, JSON.stringify(products, null, 2));
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Genera un ID en base al último ID de la lista de productos */
  async _createId(products) {
    try {
      if (!products || products.length === 0) return 1;
      return products.sort((a, b) => a.id - b.id)[products.length - 1].id + 1;
    } catch (error) {
      console.error(error.message);
    }
  }

  /**
   * Recibe un objeto, incorpora un id numérico, lo guarda en el archivo, devuelve el id asignado.
   * El id asignado es siempre uno más que el id del último objeto agregado (o 1 si es el primer
   * objeto que se agrega) y es único.
   * */
  async save(nuevoProducto) {
    try {
      const productos = await this._getCurrentProducts();
      const id = await this._createId(productos);
      const productoAgregado = {
        ...nuevoProducto,
        id,
      };
      await this._setProducts([...productos, productoAgregado]);
      return id;
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Recibe un id y devuelve el objeto con ese id, o null si no está. */
  async getById(id) {
    try {
      const products = await this._getCurrentProducts();
      return products.find((product) => product.id === id);
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Devuelve un array con los objetos presentes en el archivo. */
  async getAll() {
    try {
      return await this._getCurrentProducts();
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Elimina del archivo el objeto con el id buscado. */
  async deleteById(id) {
    try {
      const products = await this._getCurrentProducts();
      const filteredProducts = products.filter((product) => product.id !== id);
      await this._setProducts(filteredProducts);
    } catch (error) {
      console.error(error.message);
    }
  }

  /** Elimina todos los objetos presentes en el archivo. */
  async deleteAll() {
    try {
      await this._setProducts([]);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Contenedor;
