const Product = require('../models/product')
const Cart = require('../models/cart')

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
  Cart.updateCartItem(product)
  res.redirect('/admin/list-products')
}

exports.postDeleteProduct = (req, res, next) => {
  Product.deleteById(req.body.productId, err => {
    if (err) {
      next()
    } else {
      res.redirect('/admin/list-products')
    }
  })
}
