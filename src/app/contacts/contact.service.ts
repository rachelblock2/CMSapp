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

  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.contacts.sort((a, b) => (a.name > b.name) ? 1 :((b.name > a.name) ? -1 : 0));
    this.contactListChangedEvent.next(this.contacts.slice());
  }

  getContacts() {
    this.http.get<{contacts: Contact[]}>('http://localhost:3000/contacts')
    .subscribe((response) => {
      this.contacts = response.contacts;
      this.sortAndSend();
      console.log(this.contacts);
    }, (error: any) => {
      console.log(error.message);
    })
  }

  getContact(id: string) {
    // console.log(this.contacts);
    // for (let contact of this.contacts) {
    //   console.log(id);
    //   console.log(contact.id); //needs to be _?
    //   if (contact.id === id) {
    //     console.log(contact);
    //     return contact;
    //   }
    // }
    // return null;
    return this.http.get<{message: string, contact: Contact}>('http://localhost:3000/contacts/' + id)
  }

  addContact(contact: Contact) {
    if (!contact) {
      return
    }

    // make sure id of the new Document is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ messageData: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          contact.id = responseData.contact.id;
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return
    }

    const pos = this.contacts.findIndex(c => c.id === originalContact.id);
    if (pos < 0) {
      return
    };

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        (responseData) => {
          this.contacts[pos] = newContact;
          console.log(newContact);
          this.sortAndSend();
        }
      );
  }

  deleteContact(contact: Contact) {
    if(!contact) {
      return;
    }

    const pos = this.contacts.findIndex(c => c.id === contact.id);
    if (pos < 0){
      return;
    }

     // delete from database
     this.http.delete('http://localhost:3000/contacts/' + contact.id)
     .subscribe(
       (responseData) => {
         this.contacts.splice(pos, 1);
         this.sortAndSend();
       }
     );
  }

}
