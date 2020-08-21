import React, {Component} from 'react'
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import Admin from "./pages/admin/admin";
import WrapLogin from "./pages/login/login";

export default class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path='/login' component={WrapLogin}/>
                    <Route path='/' component={Admin}/>
                </Switch>
            </BrowserRouter>
        )
    }
}

