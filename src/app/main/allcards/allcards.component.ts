import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AngularFirestore } from "angularfire2/firestore";
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allcards',
  templateUrl: './allcards.component.html',
  styleUrls: ['./allcards.component.scss'],
  animations: fuseAnimations
})
export class AllcardsComponent implements OnInit {

  cards: any[];
  cardsFilteredByTitle: any[];
  filteredCards: any[];
  searchTerm: string;

  constructor(private af: AngularFirestore,public toastr: ToastrService) { }
  ngOnInit(): void {
    this.searchTerm = '';
    this.getCards();
  }
  getCards() {
    var xss = this.af.collection('/cards_bank').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      })));
    var zz = xss.subscribe(check => {
      this.cards = check;
      this.filteredCards = this.cardsFilteredByTitle = this.cards;
    });
  }
  filterCoursesByTerm(): void {
    const searchTerm = this.searchTerm.toLowerCase();
    if (searchTerm === '') {
      this.filteredCards = this.cardsFilteredByTitle;
    }
    else {
      this.filteredCards = this.cardsFilteredByTitle.filter((course) => {
        return course.name.toLowerCase().includes(searchTerm);
      });
    }
  }
  removeCards(row) {
    Swal({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.af.doc(`cards_bank/${row.id}`).delete();
        this.toastr.success('Card Removed Successfully!', 'Success!');
      } 
    })
  }

}
