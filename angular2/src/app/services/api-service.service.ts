import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

@Injectable()
export class ApiServiceService {

  constructor(private http: Http, public authHttp: AuthHttp,) { }

getSearchResults(location) {
  let data = JSON.stringify({location});
  let headers = new Headers({ 'Content-Type': 'application/json;charset=utf-8' });
  let options = new RequestOptions({ headers: headers });

  return this.http.post('http://localhost:3000/api/search', data, options)
}

addToPlace(place) {
  let data = JSON.stringify({place});
  let headers =new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
  let options = new RequestOptions({headers: headers});
  return this.authHttp.post('http://localhost:3000/api/add', data, options)
}

}
