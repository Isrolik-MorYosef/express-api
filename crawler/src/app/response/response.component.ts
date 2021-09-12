import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: ['./response.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResponseComponent implements OnInit {

  @Input() res : Observable<any> = new Observable<any>();
  public constructor(private router: Router) {
  }

  ngOnInit(): void {
    console.log(this.res.subscribe(a => console.log(a)));
  }

  gotoLink(val: string) {
    this.router.navigate([])
      .then(result => {  window.open(val, '_blank'); });
  }
}
