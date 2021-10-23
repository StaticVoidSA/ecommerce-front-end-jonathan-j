import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class HttpConfigInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (request.headers.has('Authorization')) {
          request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + 
            request.headers.get("Authorization")) 
          });
        }

        if (!request.headers.has('Content-Type')) {
          request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        if(!request.headers.has('Content-Encoding')) {
          request = request.clone({ headers: request.headers.set('Content-Encoding', 'gzip') });
        }

        if (!request.headers.has('Accept')) {
          request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
        }

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
              if (event instanceof HttpResponse) {
                // console.log(request.headers);
              }
            return event;
        }));
    }
}
