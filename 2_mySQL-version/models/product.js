const db = require('../utils/database')

module.exports = class Product {
  constructor({ title, imageUrl, price, description } = {}) {
    this.title = title.trim()
    this.imageUrl = imageUrl.trim() || 'https://picsum.photos/300/300/?random'
    this.price = parseFloat(price).toFixed(2) || '0.00'
    this.description = description.trim()
  }

  save() {
    return db.execute(
      'INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)',
      [this.title, this.price, this.description, this.imageUrl]
    )
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products')
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
  }

  static deleteById(id, cb) {
    // getProductsFromFile(products => {
    //   const filteredProducts = products.filter(p => p.id !== id)
    //   fs.writeFile(prodPath, JSON.stringify(filteredProducts), err => cb(err))
    // })
  }
}
