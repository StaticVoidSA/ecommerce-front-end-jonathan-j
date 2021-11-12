import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/shared/resetpassword.service';
import { NotificationService } from '../../../notification.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})

export class ResetComponent implements OnInit {

  hash: string = "";
  user: any = {
    email: "",
    password: ""
  }

  constructor(private router: Router, 
    private service: ResetPasswordService, 
    private route: ActivatedRoute,
    private notifyService: NotificationService) { }

  ngOnInit() {
    new Promise((resolve) => {
      window.scrollTo(0, 0);
      resolve(this.route.params.subscribe((params: Params) => {
        this.hash = params.hash;
      }));
    });
  }

  gatherFormData(form: NgForm) {
    this.user.email = form.value.email;
    this.user.password = form.value.password;
  }

  onSubmit(form: NgForm) {
    try {
      new Promise(() => {
        if (!form.valid) { return; }
        this.gatherFormData(form);
        this.service.completeReset(this.user.email, this.user.password, this.hash).subscribe((response: any) => {
          if (response.passwordChanged === true) {
            this.notifyService.showSuccess(`has been successfully changed`, `Password for ${response.email}`);
            this.router.navigate(["https://rnr-ecommerce-server-jj.herokuapp.com/reset/login"]);
          } else {
            this.notifyService.showError(`Please sign up`, `User ${response.email} does not exist`);
            this.router.navigate(["https://rnr-ecommerce-server-jj.herokuapp.com/reset/signup"]);
          }
        })
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  onHomeNav() {
    this.router.navigate(["/"]);
  }
}
