import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../environments/environment";
import {Observable} from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class ServerApiService{

  constructor(private _http: HttpClient) {
  }

  getVariables(): Observable<Object> {
    return this._http.get(API_URL + '/api/get_vars');
  }

  getCountries(): Observable<Object> {
    return this._http.get(API_URL + '/api/get_countries');
  }
}
