const Product = require("../models/Product");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleWares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");
// create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  req.body.user = req.user.id;
    

  let images = []
  if(typeof req.body.images === 'string'){
    images.push(req.body.images)
  } else {
    images = req.body.images
  }

  let imagesLinks = []

  for(let i = 0; i < images.length; i++){
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products"
    })
    imagesLinks.push({ 
      public_id: result.public_id,
      url: result.secure_url
    })

  }


  req.body.images = imagesLinks

  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    product,
  });
});

// Get all products => /api/v1/products?keyword=apple
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  
  
  
  const resPerPage = 4; // results per page
  const productsCount = await Product.countDocuments();

  const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const products = await apiFeatures.query;

  

    res.status(200).json({
      success: true,
      productsCount,
      resPerPage,
      products,
    });;
});

// Get single product detail => /api/v1/product/:id

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Update product => /api/v1/admin/products/id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = []
  if (typeof req.body.images === 'string') {
      images.push(req.body.images)
  } else {
      images = req.body.images
  }

  if (images !== undefined) {

      // Deleting images associated with the product
      for (let i = 0; i < product.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
      }

      let imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
              folder: 'products'
          });

          imagesLinks.push({
              public_id: result.public_id,
              url: result.secure_url
          })
      }

      req.body.images = imagesLinks

    }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete product => /api/v1/admin/products/:id

exports.deleteProduct = async (req, res, next) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
  const product = await Product.findById(req.params.id);
  if (!product) {
    
    return res.status(404).json({success : false, message : "Product not found"});
  }

// Delete images associated with product
try {
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
  }
} catch (error) {
  res.status(500).json({success : false, message : error});
}

await product.remove();

res.status(200).json({
  success: true,
  message: 'Product is deleted.'
})

}


// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
      success: true,
      products
  })

})

// Create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((r) => {
      if (r.user.toString() === req.user._id.toString()) {
        r.rating = rating;
        r.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});


// GET PRODUCT Review => /api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);


  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
})

// Delete Product Review => /api/v1/reviews
exports.deleteReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);


  const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

  const numOfReviews = reviews.length;

  const ratings =
  product.reviews.reduce((acc, item) => item.rating + acc, 0) /
  reviews.length;

  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  },{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  })

  res.status(200).json({
    success: true,
  });
})
