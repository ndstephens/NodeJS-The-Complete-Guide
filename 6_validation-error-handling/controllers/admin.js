const Product = require('../models/product')
const { validationResult } = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
    editMode: false,
    errorMessage: '',
    oldInputs: { title: '', price: '', imageUrl: '', description: '' },
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price || undefined
  const description = req.body.description
  const imageUrl = req.body.imageUrl.trim() || undefined

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Admin Add Product',
      activeTab: 'admin-add',
      editMode: false,
      errorMessage: errors.array()[0].msg,
      oldInputs: { title, price, description, imageUrl },
    })
  }

  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  })
  product
    .save()
    .then(() => {
      res.redirect('/admin/list-products')
    })
    .catch(err => {
      console.log(err)
      res.redirect('/500')
    })
}

exports.getListProducts = (req, res, next) => {
  // only display products created by logged in user
  Product.find({ userId: req.user._id })
    // .select('title price -_id') //* only return title and price
    // .populate('userId') //* include all User info based on stored userId
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
        errorMessage: '',
        product,
      })
    })
    .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title
  const price = req.body.price || undefined
  const description = req.body.description
  const imageUrl = req.body.imageUrl.trim() || undefined

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Admin Edit Product',
      activeTab: 'admin-edit',
      editMode: true,
      errorMessage: errors.array()[0].msg,
      product: { _id: id, title, price, description, imageUrl },
    })
  }

  // only allow update if product was created by logged in user
  Product.findOneAndUpdate(
    { _id: id, userId: req.user._id },
    { title, price, description, imageUrl },
    { new: true }
  )
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  // only all deletion if product was created by logged in user
  Product.findOneAndDelete({ _id: req.body.id, userId: req.user._id })
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}
