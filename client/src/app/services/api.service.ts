import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const httpHeaders:HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  private errorHandle = (error:HttpErrorResponse): ObservableInput<any> => {
    if (error.error instanceof ErrorEvent) { // Client Side Error (Probably wont be happening with such a simple API lol)
      console.error('API Service:', error.error.message);
      return throwError('Client Side Error Occurred');
    } else { // Server/Response Error
      console.error('Server Response:', error.error.message);
      return throwError('Server Side Error Occurred');
    }
  }

  getJsonData(): Observable<any> {
    let path:string = '/api/getJson';
    return this.http.get<any>(environment.jsonApi, { "headers": httpHeaders }).pipe(
      tap(()=>{ console.log('Sussesful GET ', environment.jsonApi); }),
      catchError(this.errorHandle)
    );
  }

  checkUpdates():void {
    this.http.get<string>(environment.updateApi, { "headers": httpHeaders }).pipe(
      tap(()=>{ console.log('Sussesful GET', environment.updateApi); }),
      catchError(this.errorHandle)
    ).subscribe((result:string) => {
      let old = localStorage.getItem('cssVer');
      if (old === result) console.log('Up-To-Date!');
      else {
        localStorage.setItem('cssVer', result);
        console.log('Reloading')
        window.location.reload();
      }
    });
  }

}