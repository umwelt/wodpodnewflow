import { Component, OnInit, ViewChild,ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { MusclesDataSource } from './muscles-datasource';
import { fuseAnimations } from '@fuse/animations';
import {FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-muscles',
  templateUrl: './muscles.component.html',
  styleUrls: ['./muscles.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None
})

export class MusclesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MusclesDataSource;
  showCard=false;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'name'];
  email = new FormControl('', [Validators.required, Validators.email]);

  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }
  ngOnInit() {
    this.dataSource = new MusclesDataSource(this.paginator, this.sort);
  }
}
