import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from "angularfire2/firestore";
import { element } from 'protractor';

// TODO: Replace this with your own data model type
export interface allWodsItem {
  info: {
    name: string;
    movements_description: string;
    type: string;
    rounds: number;
  };
  fromProgram: any;
  id: number;
}

/**
 * Data source for the Equipments view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class allWodsDataSource extends DataSource<allWodsItem> {
  data: allWodsItem[];prodata;
  constructor(private paginator: MatPaginator, private sort: MatSort, private af: AngularFirestore) {
    super();
    var xpro = this.af.collection('/programs_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    xpro.subscribe(pcheck => {
      this.prodata = pcheck;
      var xss = this.af.collection('/wods_bank').snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as allWodsItem;
          const id = a.payload.doc.id;
          return { id, ...data };
        })));
      var zz = xss.subscribe(check => {
        this.data = check;
        var founder=this.prodata.filter((x)=>{
          if(check.findIndex(a => {return a.fromProgram==x.id})>=0) return x;
        });
        this.data.filter((i,idx)=>{
          founder.filter((j,jdx)=>{
            if(i.fromProgram==j.id){
              this.data[idx].fromProgram=founder[jdx];              
            }
          });
        });
      });
    })
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<allWodsItem[]> {
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
  private getPagedData(data: allWodsItem[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: allWodsItem[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'rounds': return compare(a.info.rounds, b.info.rounds, isAsc);
        case 'type': return compare(a.info.type, b.info.type, isAsc);
        case 'fromProgram': return compare(+a.fromProgram, +b.fromProgram, isAsc);
        case 'movements_description': return compare(a.info.movements_description, b.info.movements_description, isAsc);
        case 'name': return compare(a.info.name, b.info.name, isAsc);
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
