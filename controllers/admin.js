const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body)
  console.log('Product:', product)
  product.save()
  res.redirect('/')
}

exports.getListProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render('admin/list-products', {
      pageTitle: 'Admin List Products',
      activeTab: 'admin-list',
      products,
    })
  })
}
