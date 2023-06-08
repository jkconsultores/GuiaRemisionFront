import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private url=environment.urlApi;
  constructor(public http:HttpClient) { }

  public login(form:any){
    return this.http.post(this.url+'Session/login',form);
  }
}
