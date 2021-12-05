import React, { Fragment } from "react";
import { Link } from "react-router-dom";

import MetaData from "../MetaData/MetaData";
import CheckoutSteps from "./CheckoutSteps";

import { useSelector } from "react-redux";
import axios from "axios";
import LoadingOverlay from 'react-loading-overlay'



const ConfirmOrder = ({ history }) => {
  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = React.useState(false);

  // Calculate Order Prices
  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.05 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const processToPayment = () => {

    axios.post("/api/v1/create_order", {
      price : totalPrice,
    }).then(({data}) => {
      var options = {
        key: "rzp_test_7JG9IqXQcYjKiI", // Enter the Key ID generated from the Dashboard
        amount: data.price, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Acme Corp",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          setLoading(true);
          axios.post("/api/v1/order/new", {
            orderItems : cartItems,
            shippingInfo : shippingInfo,
            itemsPrice : itemsPrice,
            shippingPrice : shippingPrice,
            taxPrice : taxPrice,
            totalPrice : totalPrice,
            paymentInfo : {id : response.razorpay_payment_id, status : "PAID"}},
          ).then(({data}) => {
            setTimeout(() => {
              setLoading(false);
              history.push("/payment");
            } , 5000)
          }).catch(err => {
            setLoading(false);
            console.log(err);
          })
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: "9999999999",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    }).catch((err) => {
      console.log(err);
    })


  };

  return (
    <LoadingOverlay active={loading} text='Processing your payment! Please do not press back or exit.' >
      <Fragment>
    <MetaData title={"Confirm Order"} />

    <CheckoutSteps shipping confirmOrder />

    <div className="row d-flex justify-content-between">
      <div className="col-12 col-lg-8 mt-5 order-confirm">
        <h4 className="mb-3">Shipping Info</h4>
        <p>
          <b>Name:</b> {user && user.name}
        </p>
        <p>
          <b>Phone:</b> {shippingInfo.phoneNo}
        </p>
        <p className="mb-4">
          <b>Address:</b>{" "}
          {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`}
        </p>

        <hr />
        <h4 className="mt-4">Your Cart Items:</h4>

        {cartItems.map((item) => (
          <Fragment>
            <hr />
            <div className="cart-item my-1" key={item.product}>
              <div className="row">
                <div className="col-4 col-lg-2">
                  <img src={item.image} alt="Laptop" height="45" width="65" />
                </div>

                <div className="col-5 col-lg-6">
                  <Link to={`/product/${item.product}`} style={{textDecoration:"none"}} >{item.name}</Link>
                </div>

                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                  <p>
                    {item.quantity} x ${item.price} ={" "}
                    <b>${(item.quantity * item.price).toFixed(2)}</b>
                  </p>
                </div>
              </div>
            </div>
            <hr />
          </Fragment>
        ))}
      </div>

      <div className="col-12 col-lg-3 my-4">
        <div id="order_summary">
          <h4>Order Summary</h4>
          <hr />
          <p>
            Subtotal:{" "}
            <span className="order-summary-values">${itemsPrice}</span>
          </p>
          <p>
            Shipping:{" "}
            <span className="order-summary-values">${shippingPrice}</span>
          </p>
          <p>
            Tax: <span className="order-summary-values">${taxPrice}</span>
          </p>

          <hr />

          <p>
            Total: <span className="order-summary-values">${totalPrice}</span>
          </p>

          <hr />
          <button
            id="checkout_btn"
            className="btn btn-primary btn-block"
            onClick={processToPayment}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  </Fragment></LoadingOverlay>
  );
};

export default ConfirmOrder;
