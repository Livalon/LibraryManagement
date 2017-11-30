import { Component, OnInit , Input} from '@angular/core';
import { Headers, Http } from '@angular/http';

@Component({
  selector: 'app-user-inf',
  templateUrl: './user-inf.component.html',
  styleUrls: ['./user-inf.component.css']
})
export class UserInfComponent implements OnInit {
  @Input() heroes: string;

  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
              private http: Http
  ) { }
  ngOnInit(): void {
    this.http.get('http://localhost:8080/LibraryManagementServer/HelloWorld')
      .toPromise()
      .then(response => {
        this.heroes = response.json().age;
        console.log(response.json().age);
      })
      .catch(this.handleError);
  }

  private aaa() {
    alert('aaaaa');
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    this.heroes = '567';
    return Promise.reject(error.message || error);
  }
}
