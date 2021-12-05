
const RazorPay = require('razorpay')
const {nanoid} = require('nanoid')

exports.createOrder = ((req, res) => {
const {price} = req.body
  let instance = new RazorPay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  let options = {
    amount: price * 100, // amount in the smallest currency unit
    currency: "INR",
    receipt: nanoid(),
  };
  instance.orders.create(options, function (err, order) {
    if(err) {
        res.status(500).json({
            error: err
        })
    } else {
        res.send({...order, user : req.user});
    }
  });
});