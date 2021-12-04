import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Message } from './message.model'

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  messageListChangedEvent = new Subject<Message[]>();

  constructor(private http: HttpClient) {}

  sendMessages() {
    this.messageListChangedEvent.next(this.messages.slice());
  }

  getMessages() {
    this.http.get<{messages: Message[]}>('http://localhost:3000/messages')
    .subscribe((response) => {
      this.messages = response.messages;
      console.log(this.messages);
      this.sendMessages();
    }, (error: any) => {
      console.log(error.message);
    })
  }

  getMessage(id: string) {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return
    }

    // make sure id of the new Document is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ messageString: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.message);
          this.sendMessages();
        }
      );
  }
}