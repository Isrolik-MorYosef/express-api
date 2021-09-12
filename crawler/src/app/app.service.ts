
import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from "rxjs";

@Injectable()
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  getUrls(config: any): Observable<object> {
    return this.http.get('http://localhost:7000/api',  {
      params:
        new HttpParams().set('url', config.url).set('limit',config.limit).set('deep',config.deep)});
  }

  getExampleUrls(): Observable<object> {
    return of({urls: ['https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184',
        'https://www.ynet.co.il/news/category/184','https://www.ynet.co.il/news/category/184'],
      length: 50});
  }
}
