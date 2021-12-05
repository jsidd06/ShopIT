import React, { Fragment }from 'react'
import {Route, Redirect } from 'react-router-dom'
import { useSelector} from 'react-redux'

const ProtectRouter = ({isAdmin,component: Component, ...rest}) => {


    const { isAuthenticatedUser, loading,user } = useSelector(state => state.auth)

    return (
        <Fragment>
            {loading === false && (
                <Route {...rest} render={props => {
                    if(isAuthenticatedUser === false) {
                        return <Redirect to="/login" />
                    }


                    if(isAdmin === true && user.role !== 'admin') {
                        return <Redirect to="/" />
                    }

                    return <Component {...props} />
                }}
                />
            )}
        </Fragment>
    )
}

export default ProtectRouter
