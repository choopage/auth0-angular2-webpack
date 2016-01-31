/*
 * Angular 2 decorators and services
 */
import {Component} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {FORM_PROVIDERS, FORM_DIRECTIVES, Control} from 'angular2/common';
import {AuthHttp, tokenNotExpired, JwtHelper} from 'angular2-jwt';
import {Http} from 'angular2/http';
import {Home} from './home/home';
import {Users} from './User/users';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [FORM_PROVIDERS ],
  directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES],
  pipes: [],
  styles: [`
      #main { margin: 10px 0 }
      #main button { margin-bottom: 5px }
      .search * { margin: 10px 0; }
      .no-users { color: red; }
      .container { width: 100% }
      img { max-width: 50px; }
  `],
  template: `
    <h1>Welcome to Angular2 with Auth0</h1>
    <button *ng-if="!loggedIn()" (click)="login()">Login</button>
    <button *ng-if="loggedIn()" (click)="logout()">Logout</button>


   <div id="sidebar" class="col-sm-3">
      <div class="search">
        <input [ngFormControl]="searchTerm" class="form-control" placeholder='Seach for users' />
        <button class="btn btn-primary" (click)="getUsers()">Get Users</button>
      </div>
      <div class="list-group">
        <p class="no-users" *ngIf="users.total_count == 0">No users found</p>
        <a
          class="users list-group-item"
          *ngFor="#user of users.items"
          [routerLink]="['Users', { userLogin: user.login}]"
        >

          <img class="img-circle" src="{{user.avatar_url}}"  />
          <strong>{{user.login}}</strong>
        </a>
      </div>
    </div>
    <div id="main" class="col-sm-9">
      <router-outlet></router-outlet>
    </div>
  `
})

@RouteConfig([
  {path: '/home', component: Home, name: 'Home'},
  { path: '/users/:userLogin/...', component: Users, name : 'Users'},
  { path: '/**', redirectTo: ['Home']}
])

export class App {
  lock = new Auth0Lock('xxxxx', 'yyyy');
  users: Array<Object> = [];
  searchTerm: Control = new Control();

  // We want an instance of router so we can route manually
  constructor(public http: Http, private _router: Router) {}

  getUsers() {
    this.http.get(`https://api.github.com/search/users?q=${this.searchTerm.value}`)
      .map(response => response.json())
      .subscribe(
        data => this.users = data,
        error => console.log(error)
      );
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 * or via chat on Gitter at https://gitter.im/AngularClass/angular2-webpack-starter
 */
