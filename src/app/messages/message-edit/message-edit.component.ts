import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Contact } from '../../contacts/contact.model';
import { ContactService } from '../../contacts/contact.service';

import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectRef: ElementRef; 
  @ViewChild('msgText') msgTextRef: ElementRef; 
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender: Contact;

  constructor(private messageService: MessageService,
    private contactService: ContactService) { }

  ngOnInit(): void {
    this.contactService.getContact('101')
      .subscribe(
        response => {
          this.currentSender = response.contact;
        }
      )
  }

  onSendMessage() {
    const subject = this.subjectRef.nativeElement.value;
    const msgText = this.msgTextRef.nativeElement.value;
    const newMessage = new Message('1', subject, msgText, this.currentSender);
    console.log(newMessage);
    this.messageService.addMessage(newMessage);
    this.onClear();
  }

  onClear() {
    this.subjectRef.nativeElement.value = '';
    this.msgTextRef.nativeElement.value = '';
  }

}
