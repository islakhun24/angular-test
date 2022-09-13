import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpServiceUrl {
  result : any;
  input = ''
  constructor(private http: HttpClient) { }

  getUrlList(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  getTopText(){
    this.result = Object.entries(this.input.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    .trim().split(" ").reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), Object.create(null)))
    .map((val:any) => {
      return {
        word: val[0],
        occurences: val[1]
      }
    }).sort((a, b) => parseFloat(b.occurences) - parseFloat(a.occurences));
  }


}
