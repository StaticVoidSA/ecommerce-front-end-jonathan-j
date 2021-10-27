import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface RespData {
    email: string,
    emailSent: boolean
}

interface EmailRespData {
    email: string,
    passwordChanged: boolean
}

@Injectable({providedIn: 'root'})
export class ResetPasswordService {

    constructor(private http: HttpClient) {}

    resetPassword(email: string) {
        return this.http.post<RespData>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/resetpassword/reset',
            {
                email: email
            }
        );
    }

    completeReset(email: string, password: string, hash: string) {
        return this.http.post<EmailRespData>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/resetpassword/complete',
            {
                email: email,
                password: password,
                hash: hash
            }
        )
    }
}
