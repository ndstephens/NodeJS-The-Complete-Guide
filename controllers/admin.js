const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
    editMode: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body)
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

exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productId, product => {
    if (!product) {
      next()
    } else {
      res.render('admin/edit-product', {
        pageTitle: 'Admin Edit Product',
        activeTab: 'admin-edit',
        editMode: true,
        product,
      })
    }
  })
}

exports.postEditProduct = (req, res, next) => {
  // create new Product from updated info
  const product = new Product(req.body)
  // save method has logic to update Product in list if id already exists
  product.save()
  res.redirect('/admin/list-products')
}
