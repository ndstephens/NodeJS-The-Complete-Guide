const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Products',
    activeTab: 'admin',
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title)
  product.save()
  res.redirect('/')
}

exports.getProducts = (req, res, next) => {
  res.render('shop', {
    pageTitle: 'Shop',
    activeTab: 'shop',
    products: Product.fetchAll(),
  })
}
