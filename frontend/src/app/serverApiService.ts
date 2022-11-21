import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../environments/environment";
import {Observable} from "rxjs";
import {VariableModel} from "./models/variable.model";
import {VariableXLevelFilterModel} from "./models/variableXLevelFilter.model";
import {XLevelModel} from "./models/xLevel.model";


@Injectable({
  providedIn: 'root',
})
export class ServerApiService{

  constructor(private _http: HttpClient) {
  }

  getVariables(): Observable<Array<VariableModel>> {
    return this._http.get(API_URL + '/api/get_vars') as Observable<Array<VariableModel>>;
  }

  getCountries(): Observable<Object> {
    return this._http.get(API_URL + '/api/get_countries');
  }

  getVariablesByXLevel(xLevel: string): Observable<Array<VariableXLevelFilterModel>> {
    return this._http.get(API_URL + '/api/get_var/'+xLevel) as Observable<Array<VariableXLevelFilterModel>>;
  }

  getXLevels(): Observable<Array<XLevelModel>> {
    return this._http.get(API_URL + '/api/get_x_levels') as Observable<Array<XLevelModel>>;
  }
}
