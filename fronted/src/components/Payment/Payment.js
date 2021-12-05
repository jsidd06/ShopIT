import React from 'react'
import { Container } from 'react-bootstrap'
import {Link} from "react-router-dom"

function Payment() {
    
    return (
        <Container className='text-center mt-5'>
            <h1>Thank You for Shopping</h1> 
            <p>Your order will be delivered in 7-10 days</p>
            <Link to="/" className="btn btn-primary" style={{textDecoration:'none',backgroundColor:'#EBE645',color:'black'}}>Go Back to Shop</Link>
        </Container>
    )
}

export default Payment
