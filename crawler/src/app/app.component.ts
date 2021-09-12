import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs/operators";
import {AppService} from "./app.service";
import {NgxUiLoaderService} from "ngx-ui-loader";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'crawler';
  limit = 0;
  deep = 0;
  manageReqForm = new FormGroup({
    url: new FormControl('', [Validators.required, Validators.pattern(/(http[s]?:\/\/)?([^\/\s]+\/)(.*)/)]),
    limit: new FormControl('', [Validators.required, Validators.min(0)]),
    deep: new FormControl('', [Validators.required, Validators.min(0)])
  });
  destroy$: Subject<void> = new Subject<void>();
  data: Observable<any> = new Observable<any>();

  constructor(private appService: AppService,
              private loader: NgxUiLoaderService) {
  }

  ngOnInit(): void {
    // this.data = this.appService.getExampleUrls();
  }

  onSubmit() {
    this.loader.startLoader('01');
    this.data = this.appService.getUrls(this.manageReqForm.value).pipe(takeUntil(this.destroy$));
    this.data.subscribe(d => {
      this.loader.stopLoader('01');

      console.log('message::::', d);
      this.manageReqForm.reset();
    });
  }

  add(field: string) {
    this.manageReqForm.controls[field].setValue(Number(this.manageReqForm.controls[field].value + 1))
  }

  subtract(field: string) {
    this.manageReqForm.controls[field].setValue(Number(this.manageReqForm.controls[field].value - 1))
  }

  ngOnDestroy(): void {
    this.destroy$.next()
  }
}
