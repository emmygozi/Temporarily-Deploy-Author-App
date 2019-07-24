import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from '@components/views/Login';
import Home from '@components/views/Home';
import NotFound from '@components/views/NotFound';
import Profile from '@components/containers/Profile/Profile';
import EditProfile from '@components/containers/Profile/EditProfile';
import SingleArticle from '../containers/views/Article/SingleArticle';
import EditArticle from '../containers/views/Article/EditArticle';
import NewArticle from '../containers/views/Article/NewArticle';

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/new-article" component={NewArticle} />
      <Route exact path="/article/:articleId" component={SingleArticle} />
      <Route exact path="/article/:articleId/edit" component={EditArticle} />
      <Route exact path="/profile/:username" component={Profile} />
      <Route exact path="/profile/:username/edit" component={EditProfile} />
      
      <Route path="*" component={NotFound} />
    </Switch>
  </Router>
);

export default Routes;
