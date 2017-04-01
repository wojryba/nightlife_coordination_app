import { Component, Input, OnInit, OnDestroy, trigger, state, style, animate, transition } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';
import { StoreService } from '../../services/store.service';

interface AppState {
  reducer: any;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(-15%)', opacity: 0}),
          animate('500ms', style({transform: 'translateY(0%)', opacity: 1}))
        ])
      ]
    )
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public locations:any;

  constructor(private fb:FormBuilder, private data:ApiServiceService, private auth: AuthService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      location: ['']
    });

    setTimeout(() => {this.getQuery()}, 500);
  }

  ngOnDestroy() {
  }

  getQuery() {
    if (this.auth.authenticated()) {
      this.locations = JSON.parse(localStorage.getItem('locations'));
    } else {
      console.log("not loged in");
    }
  }

  onSubmit(){
    this.data.getSearchResults(this.form.value.location).subscribe(
      resonse => {
        this.locations = JSON.parse(resonse['_body']);
        console.log(this.locations);
        localStorage.setItem('locations', JSON.stringify(this.locations));
      },
      error => console.log(error),
      () => console.log("cmoplete")
    )
}

onClick(i){
  if (this.auth.authenticated()) {
    this.data.addToPlace(this.locations[i].id).subscribe(
      response => {
        if (response['_body'] == "user added") {
          this.locations[i].counter = this.locations[i].counter + 1;
        } else if (response['_body'] == "user removed") {
          this.locations[i].counter = this.locations[i].counter - 1;
        }
      },
      error => console.log(error),
      () => console.log("complete")
    );
  } else {
    this.auth.login();
  }
}

}
