import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PlacesApiClient extends HttpClient {
  private readonly _baseUrl: string = "https://api.stadiamaps.com/geocoding/v1";

  constructor(
    private _handler: HttpHandler
  ){
    super(_handler);
  }

  public override get<T>( url: string, options?: {
    params?: HttpParams | {
      [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  }}): Observable<T> {
    url = this._baseUrl + url;

    return super.get<T>(url, {
      params: {
        lang: 'es-HN',
        ...options.params
      }
    });
  }
}

/*
  interface optionsGet {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType: 'arraybuffer';
    withCredentials?: boolean;
  }
*/
