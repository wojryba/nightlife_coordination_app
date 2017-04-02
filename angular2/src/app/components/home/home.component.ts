import { Component, Input, OnInit, OnDestroy, trigger, state, style, animate, transition } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiServiceService } from '../../services/api-service.service';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    // animations for displaing locations
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
export class HomeComponent implements OnInit {
  public form: FormGroup;
  public locations:any;

  constructor(private fb:FormBuilder, private data:ApiServiceService, private auth: AuthService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      location: ['']
    });

    // check if user is logged in and if so set locations
    setTimeout(() => {this.getQuery()}, 500);
  }

  getQuery() {
    if (this.auth.authenticated()) {
      // if user is logged in,
      // get the query from localStorage
      let query = JSON.parse(localStorage.getItem('query'));
      //  and make API call to get locations
      this.data.getSearchResults(query).subscribe(
        resonse => {
          this.locations = JSON.parse(resonse['_body']);
          console.log(this.locations);
        },
        error => console.log(error),
        () => console.log("cmoplete")
      )
    } else {
      // if user is not logged in do nothing
      console.log("not loged in");
    }
  }

  onSubmit(){
    // save the query to localStorage for use after login
    localStorage.setItem('query', JSON.stringify(this.form.value.location));
    // make API calls for locatons
    this.data.getSearchResults(this.form.value.location).subscribe(
      resonse => {
        // set recived locations to be displeyed
        this.locations = JSON.parse(resonse['_body']);
      },
      error => console.log(error),
      () => console.log("cmoplete")
    )
}

onClick(i){
  if (this.auth.authenticated()) {
    // make API call to add or remove user to given location
    this.data.addToPlace(this.locations[i].id, this.locations).subscribe(
      response => {
        // response is current counter. set it to the proper location
        this.locations[i].counter = JSON.parse(response['_body']);
      },
      error => console.log(error),
      () => console.log("complete")
    );
  } else {
    this.auth.login();
  }
}

}
