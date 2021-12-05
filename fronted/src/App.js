import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { useSelector} from "react-redux";
import Footer from "./components/Layout/Footer/Footer";
import Header from "./components/Layout/Header/Header";
import Home from "./components/Home/Home"
import ProductDetails from "./components/Product/productDetails";
import Login from '../src/components/Login/Login';
import Register from './components/Register/Register';
import Profile from "./components/Profile/Profile";
import {loadUser } from "./action/userAction"
import { useEffect } from 'react';
import store from "./Store"
import ProtectRouter from './components/Route/ProtectRouter';
import UpdateProfile from './components/Update/UpdateProfile';
import UpdatePassword from './components/Update/UpdatePassword';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import Cart from './components/Cart/Cart';
import Shipping from './components/Cart/Shipping';
import ConfirmOrder from './components/Cart/ConfirmOrder';
import Payment from './components/Payment/Payment';
import ListOrders from './components/Order/ListOrder';
import OrderDetails from './components/Order/OrderDetails';
import Dashboard from './components/Admin/DashBoard';
import ProductList from './components/Admin/ProductList';
import NewProduct from './components/Admin/NewProduct';
import UpdateProduct from './components/Admin/UpdateProduct';
import OrdersList from './components/Admin/OrdersList';
import ProcessOrder from './components/Admin/ProcessOrder';
import UsersList from './components/Admin/UsersList';
import UpdateUser from './components/Admin/UpdateUser';
import ProductReview from './components/Admin/ProductReview';
function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  } , [])

  const {user, isAuthenticated , loading} = useSelector(state => state.auth);

  return (
    <Router>
    <div className="App">
      <Header />
      <div className="container container-fluid">
        <Route path="/" exact component={Home} />
        <Route path="/search/:keyword" component={Home} />
        <Route path="/product/:id" component={ProductDetails} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/password/forgot" component={ForgotPassword}  exact />
        <Route path="/cart" component={Cart}  exact />
        <ProtectRouter path="/me" component={Profile}  exact />
        <ProtectRouter path="/order/confirm" component={ConfirmOrder}  exact/>
        <ProtectRouter path="/payment" component={Payment}  exact/>
        <ProtectRouter path="/shipping" component={Shipping} exact/>
        <ProtectRouter path="/me/update" component={UpdateProfile}  exact/>
        <ProtectRouter path="/password/update" component={UpdatePassword}  exact/>
        <ProtectRouter path="/orders/me" component={ListOrders}  exact/>
        <ProtectRouter path="/order/:id" component={OrderDetails}  exact/>
        

      </div>
      <ProtectRouter path="/dashboard" isAdmin={true} component={Dashboard}  exact/>
      <ProtectRouter path="/admin/products" isAdmin={true} component={ProductList}  exact/>
      <ProtectRouter path="/admin/product" isAdmin={true} component={NewProduct}  exact/>
      <ProtectRouter path="/admin/product/:id" isAdmin={true} component={UpdateProduct}  exact/>
      <ProtectRouter path="/admin/orders" isAdmin={true} component={OrdersList}  exact/>
      <ProtectRouter path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact/> 
      <ProtectRouter path="/admin/users" isAdmin={true} component={UsersList} exact/> 
      <ProtectRouter path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact/> 
      <ProtectRouter path="/admin/reviews" isAdmin={true} component={ProductReview} exact/> 
      {!loading && (!isAuthenticated || user.role !== 'admin') &&(
        <Footer />
      )}
      
    </div>
  </Router>
  )
  }
export default App;
