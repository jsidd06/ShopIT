import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";

import MetaData from "../MetaData/MetaData";
import Loader from "../Layout/Loader/Loader";

import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails, clearErrors } from "../../action/orderAction";

const OrderDetails = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  

  const {
    loading,
    error,
    order ,
  } = useSelector((state) => state.orderDetails);
  
  // useEffect(() => {
  //   if(order){
  //     const {
  //       shippingInfo,
  //       orderItems,
  //       paymentInfo,
  //       user,
  //       totalPrice,
  //       orderStatus,
  //     } = order;
  //   }
  // } , [order]);

  useEffect(() => {
    dispatch(getOrderDetails( ));

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert,error]);

  const shippingDetails = '1212 new streep gzab';
    // shippingInfo &&
    // `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`;

  const isPaid = 'succeeded'

  return (
    <Fragment>
      <MetaData title={"Order Details"} />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {console.log(order)}
          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order # {order._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>
              <p>
                <b>Name:</b> {'sidd'}
              </p>
              <p>
                <b>Phone:</b> {9832943723}
              </p>
              <p className="mb-4">
                <b>Address:</b>
                {shippingDetails}
              </p>
              <p>
                <b>Amount:</b> ${'23433'}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>
              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>

              <h4 className="my-4">Order Status:</h4>
              <p
                className={
                  order.orderStatus &&
                  String(order.orderStatus).includes("Delivered")
                    ? "greenColor"
                    : "redColor"
                }
              >
                <b>{"34343"}</b>
              </p>

              <h4 className="my-4">Order Items:</h4>

              <hr />
              <div className="cart-item my-1">
                {order.orderItems &&
                  order.orderItems.map((item) => (
                    <div key={item.product} className="row my-5">
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </div>

                      <div className="col-5 col-lg-5">
                        <Link to={`/products/${item.product}`}>
                          {item.name}
                        </Link>
                      </div>

                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>${item.price}</p>
                      </div>

                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity} Piece(s)</p>
                      </div>
                    </div>
                  ))}
              </div>
              <hr />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default OrderDetails;
