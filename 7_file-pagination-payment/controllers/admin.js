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
  const price = req.body.price
  const description = req.body.description
  const image = req.file
  // const imageUrl = req.body.imageUrl || 'https://picsum.photos/300/300/?random'

  if (!image) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Admin Add Product',
      activeTab: 'admin-add',
      editMode: false,
      errorMessage: 'Attached file is not an image',
      oldInputs: { title, price, description },
    })
  }

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Admin Add Product',
      activeTab: 'admin-add',
      editMode: false,
      errorMessage: errors.array()[0].msg,
      oldInputs: { title, price, description },
    })
  }

  const imageUrl = `/${image.path}`

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
      err.statusCode = 500
      next(err)
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
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
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
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id
  const title = req.body.title
  const price = req.body.price
  const description = req.body.description
  const image = req.file

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Admin Edit Product',
      activeTab: 'admin-edit',
      editMode: true,
      errorMessage: errors.array()[0].msg,
      product: { _id: id, title, price, description },
    })
  }

  const updateObject = image
    ? { title, price, description, imageUrl: `/${image.path}` }
    : { title, price, description }

  // only allow update if product was created by logged in user
  Product.findOneAndUpdate({ _id: id, userId: req.user._id }, updateObject, {
    new: true,
  })
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}

exports.postDeleteProduct = (req, res, next) => {
  // only all deletion if product was created by logged in user
  Product.findOneAndDelete({ _id: req.body.id, userId: req.user._id })
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => {
      err.statusCode = 500
      next(err)
    })
}
