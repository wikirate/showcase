import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'more-data',
  templateUrl: './more-data.component.html',
  styleUrls: ['./more-data.component.scss']
})
export class MoreDataComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
}
