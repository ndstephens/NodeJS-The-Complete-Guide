const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
    editMode: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title
  const price = req.body.price || undefined
  const description = req.body.description
  const imageUrl = req.body.imageUrl.trim() || undefined

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
    .catch(err => console.log(err))
}

exports.getListProducts = (req, res, next) => {
  Product.find()
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

  Product.findByIdAndUpdate(
    id,
    { title, price, description, imageUrl },
    { new: true }
  )
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body.id)
    .then(() => res.redirect('/admin/list-products'))
    .catch(err => console.log(err))
}
