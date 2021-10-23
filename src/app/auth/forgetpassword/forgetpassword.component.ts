import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/shared/resetpassword.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css']
})
export class ForgetpasswordComponent implements OnInit {

  private data = {
    email: '',
    token: ''
  };

  constructor(private router: Router, private service: ResetPasswordService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onHomeNav() {
    this.router.navigate(['/']);
  }

  gatherFormData(form: NgForm): string {
    return this.data.email = form.value.email;
  }

  onSubmit(form: NgForm) {
    try {
      new Promise((resolve) => {
        this.gatherFormData(form);
        resolve(this.service.resetPassword(this.data.email).subscribe(data => {
          if (data.emailSent === true) {
            alert(`An email has been sent to ${data.email}`);
            this.router.navigate(['/']);
          } else {
            alert(`${data.email} does not exist. \nPlease create an account`);
            this.router.navigate(["/signup"]);
          }
        }));
      });
    } catch (error) {
      throw new Error(error);
    }  
  } 
}
