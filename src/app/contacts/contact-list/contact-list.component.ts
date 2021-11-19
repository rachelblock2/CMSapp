import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ContactsFilterPipe } from '../contacts-filter.pipe';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  subscription: Subscription;
  searchText = 'Enter a search value';
  term: string;

  constructor(private contactService: ContactService) { }

  ngOnInit(): void {
    this.subscription = this.contactService.contactListChangedEvent.subscribe(
      (contacts: Contact[]) => {
        this.contacts = contacts;
      }
    )
    this.contactService.getContacts();

  }

  search(value:string) {
    this.term = value;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
