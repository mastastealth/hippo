import EmberRouter from '@ember/routing/router';
import config from 'hippo/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('create');
  this.route('train');
  this.route('login');
});
