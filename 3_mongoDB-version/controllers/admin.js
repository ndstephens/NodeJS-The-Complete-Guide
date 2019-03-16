const Product = require('../models/product')
// const Cart = require('../models/cart')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
    editMode: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body)
  product
    .save()
    .then(() => {
      res.redirect('/admin/list-products')
    })
    .catch(err => console.log(err))
}

exports.getListProducts = (req, res, next) => {
  Product.fetchall()
    .then(products => {
      res.render('admin/list-products', {
        pageTitle: 'Admin List Products',
        activeTab: 'admin-list',
        products,
      })
    })
    .catch(err => console.log(err))
}

exports.getEditProduct = (req, res, next) => {
  Product.findById(req.params.productId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: 'Admin Edit Product',
        activeTab: 'admin-edit',
        editMode: true,
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const editedProduct = new Product(req.body)
  editedProduct
    .save()
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}

// exports.postDeleteProduct = (req, res, next) => {
//   // Product.findByPk(req.body.id)
//   req.user
//     .getProducts({ where: { id: req.body.id } })
//     .then(product => {
//       return product.destroy()
//       // delete in Cart as well
//     })
//     .then(() => res.redirect('/admin/list-products'))
//     .catch(err => console.log(err))
// }
