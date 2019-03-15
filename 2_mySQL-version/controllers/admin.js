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
  const { title, price, description, imageUrl } = req.body
  // Product.create({
  req.user
    .createProduct({
      title: title.trim(),
      price: parseFloat(price).toFixed(2) || 0.0,
      description: description.trim(),
      imageUrl: imageUrl || 'https://picsum.photos/300/300/?random',
    })
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}

exports.getListProducts = (req, res, next) => {
  Product.findAll()
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
  Product.findByPk(req.params.productId)
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
  const { id, title, price, imageUrl, description } = req.body
  Product.update(
    {
      title: title.trim(),
      price: parseFloat(price).toFixed(2) || 0.0,
      description: description.trim(),
      imageUrl: imageUrl || 'https://picsum.photos/300/300/?random',
    },
    { where: { id } }
  )
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  Product.findByPk(req.body.id)
    .then(product => {
      return product.destroy()
      // delete in Cart as well
    })
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}
