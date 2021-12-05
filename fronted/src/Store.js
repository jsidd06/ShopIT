import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import  { productsReducer, productReducer,productDetailsReducer, newReviewReducer , newProductReducer,productReviewsReducer ,reviewReducer} from "./reducers/ProductReducers"
import {authReducer, userReducer, forgotPasswordReducer,allUsersReducer,userDetailsReducer} from "./reducers/userReducer"
import {cartReducer} from "./reducers/CartReducers"
import {myOrdersReducer,orderDetailsReducer,newOrderReducer,allOrdersReducer,orderReducer} from "./reducers/OrderReducers"
const reducer = combineReducers({   
    products: productsReducer, 
    productDetails: productDetailsReducer,
    newProduct: newProductReducer,
    productReviews: productReviewsReducer,
    allUsers: allUsersReducer,
    review: reviewReducer,
    userDetails: userDetailsReducer,
    newOrder: newOrderReducer,
    allOrders: allOrdersReducer,
    order: orderReducer,
    auth: authReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    newReview: newReviewReducer,
    product: productReducer,
})

let initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [] ,shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    }
}

const middleware = [thunk]
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)))


export default store;