import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/shared/auth.service';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

  public options = ['Email', 'SMS', 'Post'];
  private optionsChecked = [];
  private optionsMap = {
    Email: false,
    SMS: false,
    Post: false,
  };

  private user: any = {
    name: '',
    surname: '',
    email: '',
    password: '',
    contact: []
  }

  constructor(private router: Router, 
    private authService: AuthenticationService,
    private notifyService: NotificationService) { }

  ngOnInit() {
    this.optionsChecked.splice(0, this.optionsChecked.length);
    window.scrollTo(0, 0);
  }

  gatherFormData(form: NgForm) {
    this.user.name = form.value.name;
    this.user.surname = form.value.surname;
    this.user.email = form.value.email;
    this.user.contact = this.optionsChecked;
    this.user.password = form.value.password;
  }

  onSignup(form: NgForm) {
    try {
      if (!form.valid) { return; }
      this.gatherFormData(form);
      this.authService.signup(this.user.name, this.user.surname, this.user.email, this.user.password)
        .subscribe(data => {
          if (data.success === true) {
            this.notifyService.showSuccess("Thank you for signing up!", `Sigup successful for ${this.user.name}`);
            this.router.navigate(["/login"]);
          } else if (data.success === false) {
            this.notifyService.showError("Sorry. Please try signing up again", `Error signing up user ${this.user.name}`);
            this.router.navigate(["/signup"]);
          }
        });
    } catch (error) {
      throw new Error(error);
    }
  }

  onHomeNav() {
    this.router.navigate(['/']);
  }

  updateCheckedOptions(option, event) {
    this.optionsMap[option] = event.target.checked;
    this.optionsChecked.push(option);
  };
}
