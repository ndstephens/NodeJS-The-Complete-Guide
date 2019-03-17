const Product = require('../models/product')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Admin Add Product',
    activeTab: 'admin-add',
    editMode: false,
  })
}

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title.trim()
  const price = parseFloat(req.body.price).toFixed(2) || 0.0
  const description = req.body.description.trim()
  const imageUrl = req.body.imageUrl || 'https://picsum.photos/300/300/?random'

  const product = new Product({ title, price, description, imageUrl })
  product
    .save()
    .then(() => {
      res.redirect('/admin/list-products')
    })
    .catch(err => console.log(err))
}

// exports.getListProducts = (req, res, next) => {
//   Product.fetchall()
//     .then(products => {
//       res.render('admin/list-products', {
//         pageTitle: 'Admin List Products',
//         activeTab: 'admin-list',
//         products,
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.getEditProduct = (req, res, next) => {
//   Product.findById(req.params.productId)
//     .then(product => {
//       res.render('admin/edit-product', {
//         pageTitle: 'Admin Edit Product',
//         activeTab: 'admin-edit',
//         editMode: true,
//         product,
//       })
//     })
//     .catch(err => console.log(err))
// }

// exports.postEditProduct = (req, res, next) => {
//   const editedProduct = new Product(req.body)
//   editedProduct
//     .save()
//     .then(() => res.redirect('/admin/list-products'))
//     .catch(err => console.log(err))
// }

// exports.postDeleteProduct = (req, res, next) => {
//   Product.deleteById(req.body.id)
//     .then(() => res.redirect('/admin/list-products'))
//     .catch(err => console.log(err))
// }
