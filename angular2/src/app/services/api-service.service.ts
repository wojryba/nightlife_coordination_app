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
  return this.http.post('api/search', data, options)
}


addToPlace(place, query) {
  let data = JSON.stringify({place, query});
  let headers =new Headers({ 'Content-Type': 'application/json;charset=utf-8'});
  let options = new RequestOptions({headers: headers});
  return this.authHttp.post('api/add', data, options)
}

}
