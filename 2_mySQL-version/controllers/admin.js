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
  Product.create({
    title: title.trim(),
    price: parseFloat(price).toFixed(2) || 0.0,
    description: description.trim(),
    imageUrl: imageUrl || 'https://picsum.photos/300/300/?random',
  })
    // .then(() => res.redirect('/'))
    .then(result => console.log('Product Created...'))
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
  product.save(err => {
    if (err) {
      next()
    } else {
      Cart.updateCartItem(product, err => {
        if (err) {
          next()
        } else {
          res.redirect('/admin/list-products')
        }
      })
    }
  })
}

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body
  Product.deleteById(productId, err => {
    if (err) {
      next()
    } else {
      Cart.deleteCartItem(productId, err => {
        if (err) {
          next()
        } else {
          res.redirect('/admin/list-products')
        }
      })
    }
  })
}
