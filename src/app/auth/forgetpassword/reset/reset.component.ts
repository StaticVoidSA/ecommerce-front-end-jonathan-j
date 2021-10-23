import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/shared/resetpassword.service';

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

  constructor(private router: Router, private service: ResetPasswordService, private route: ActivatedRoute) { }

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
      new Promise((resolve) => {
        if (!form.valid) { return; }
        this.gatherFormData(form);
        resolve(this.service.completeReset(this.user.email, this.user.password, this.hash).subscribe(data => {
          if (data.passwordChanged === true) {
            alert(`Password for ${data.email} has been successfully changed`);
            this.router.navigate(["/login"]);
          } else {
            alert(`User ${data.email} does not exist`);
            this.router.navigate(["/signup"]);
          }
        }));
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  onHomeNav() {
    this.router.navigate(["/"]);
  }
}
