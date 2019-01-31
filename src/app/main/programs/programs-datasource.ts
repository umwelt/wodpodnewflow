import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { element } from 'protractor';

// TODO: Replace this with your own data model type
export interface ProgramsItem {
  mode: string;
  level:string;
  author: {
    name: string;
  };
  trainer_tips: {
    equipment: {
      name: string;
    };
  };
  category_name: string;
  name: string;
  id: number;
}

/**
 * Data source for the Equipments view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class ProgramsDataSource extends DataSource<ProgramsItem> {
  data: ProgramsItem[];
  constructor(private paginator: MatPaginator, private sort: MatSort, private af: AngularFirestore) {
    super();
    if(localStorage.getItem('filledData'))
    localStorage.removeItem('filledData');
    if(localStorage.getItem('woder'))
    localStorage.removeItem('woder');
    var xss = this.af.collection('/programs_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as ProgramsItem;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    var zz = xss.subscribe(check => {
      this.data = check;
    })
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<ProgramsItem[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    if (this.paginator.page) {
      const dataMutations = [
        observableOf(this.data),
        this.paginator.page,
        this.sort.sortChange
      ];
      // Set the paginator's length
      this.paginator.length = this.data.length;

      return merge(...dataMutations).pipe(map(() => {
        return this.getPagedData(this.getSortedData([...this.data]));
      }));
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: ProgramsItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: ProgramsItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'trainer_tips': return compare(a.trainer_tips.equipment.name, b.trainer_tips.equipment.name, isAsc);
        case 'mode': return compare(a.mode, b.mode, isAsc);
        case 'category_name': return compare(a.category_name, b.category_name, isAsc);
        case 'level': return compare(a.level, b.level, isAsc);
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
