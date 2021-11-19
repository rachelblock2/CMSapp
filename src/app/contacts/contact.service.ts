import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  maxContactId: number;

  constructor(private http: HttpClient) {
    this.maxContactId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let contact of this.contacts) {
      let currentId = parseInt(contact.id); //should be document.id
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId
  }

  getContacts() {
    this.http.get<Contact[]>('https://cms-fall-2021-default-rtdb.firebaseio.com/contacts.json')
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
      this.maxContactId = this.getMaxId();
      this.contacts.sort((a, b) => (a.name > b.name) ? 1 :((b.name > a.name) ? -1 : 0));
      console.log(this.contacts);
      this.contactListChangedEvent.next(this.contacts.slice());
    }, (error: any) => {
      console.log(error.message);
    })
  }

  getContact(id: string): Contact {
    for (let contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  storeContacts() {
    JSON.stringify(this.contacts);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.http.put('https://cms-fall-2021-default-rtdb.firebaseio.com/contacts.json', this.contacts, {headers})
    .subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    })
  }

  addContact(newContact: Contact) {
    if (!newContact) {
      return
    }

    this.maxContactId++;
    newContact.id = this.maxContactId.toString();

    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }

    let pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return
    };

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if(!contact) {
      return;
    }
    const pos = this.contacts.indexOf(contact);
    if (pos < 0){
      return;
    }

    this.contacts.splice(pos, 1);
    this.storeContacts();
  }

}
