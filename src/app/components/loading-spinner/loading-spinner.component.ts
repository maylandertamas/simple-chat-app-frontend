import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {

  @Input() isLoading: boolean = false;
  @Input() diameter: number = 70;
  constructor() { }

  ngOnInit(): void {
  }

}
