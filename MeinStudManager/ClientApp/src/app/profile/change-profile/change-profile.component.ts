import { Component,   OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/user/user.model';
import { UserService } from 'src/app/shared/user/user.service';


@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrls: ['./change-profile.component.css']
})
export class ChangeProfileComponent implements OnInit  {

  public editMode: string = 'editFalse';
  public userId: string;
  public user: Observable<User>;
  private oldValue: string;
  changeProfileForm: FormGroup = new FormGroup({});

  constructor(
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.userId = this.userService.getUserId();

    this.changeProfileForm = new FormGroup({
      'userName' : new FormControl({value: '', disabled: true},[Validators.required]),
      'firstName': new FormControl({value: '', disabled: true}),
      'lastName': new FormControl({value: '', disabled: true}),
      'email': new FormControl({value: '', disabled: true},[Validators.required, Validators.email]),
      'phoneNumber' : new FormControl({value: '', disabled: true})
    });

    this.user = this.userService.getUser();
    this.user.subscribe(res =>{
      this.changeProfileForm.patchValue({
        'userName' : res.userName,
        'firstName' : res.firstName,
        'lastName' : res.lastName,
        'email'    : res.email,
        'phoneNumber': res.phoneNumber
      })
    });
  }

  onSubmit() {
    const putUser = new User(
      this.changeProfileForm.get('firstName').value,
      this.changeProfileForm.get('lastName').value,
      this.userId,
      this.changeProfileForm.get('userName').value,
      this.changeProfileForm.get('email').value,
      true, // hardcoded right now
      this.changeProfileForm.get('phoneNumber').value,
      true  // hardcoded right now
    );
     this.userService.putUser(putUser).subscribe(
       res => {

         window.confirm("Änderung erfolgreich");
       },
       errorRes => {

       }
     );
  }

  public changeValue(value:string) {
    this.oldValue = this.changeProfileForm.get(value).value;
    this.editMode = value;
    this.changeProfileForm.get(value).enable();
  }
  public saveValue(value :string) {

    this.editMode= 'editFalse';
    this.changeProfileForm.get(value).disable();
    // check if value changed before submitting
    if(this.changeProfileForm.get(value).value !== this.oldValue) {
      this.onSubmit();
    }

  }
}
