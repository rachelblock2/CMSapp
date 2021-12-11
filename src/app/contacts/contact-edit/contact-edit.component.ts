import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  groupContacts: Contact[] = [];
  contact: Contact;
  originalContact: Contact;
  editMode: boolean = false;

  id: string;

  constructor(private router: Router, 
    private route: ActivatedRoute, private contactService: ContactService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];

        if (!this.id) {
          this.editMode = false;
          return
        }

        this.contactService.getContact(this.id)
          .subscribe(contactData => {
            this.originalContact = contactData.contact;
          

            if (!this.originalContact) {
              return
            }

            this.editMode = true;
            console.log(this.editMode);
            this.contact = JSON.parse(JSON.stringify(this.originalContact));


            if (this.originalContact.group && this.originalContact.group.length > 0) {
              this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
              console.log(this.groupContacts);
            }
      });
      }
    );
  }

  onSubmit(form: NgForm) {
    let value = form.value;
    let newContact = new Contact('', value.name, value.email, value.phone, value.imageUrl, this.groupContacts);
    console.log(this.editMode);
    
    if (this.editMode) {
      this.contactService.updateContact(this.originalContact, newContact);
      console.log(newContact);
    } else {
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }

    if (this.contact && newContact.id === this.contact.id) {
      return true;
    }

    for (let i=0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id) {
        return true;
      }
    }
    return false;
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
    console.log(this.groupContacts);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
      return;
    }
    this.groupContacts.splice(index, 1);
  }

}
