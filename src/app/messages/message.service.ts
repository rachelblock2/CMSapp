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
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.maxMessageId = this.getMaxId();
  }

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId
  }

  getMessages() {
    this.http.get<Message[]>('https://cms-fall-2021-default-rtdb.firebaseio.com/messages.json')
    .subscribe((messages: Message[]) => {
      this.messages = messages;
      this.maxMessageId = this.getMaxId();
      this.messageListChangedEvent.next(this.messages.slice());
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

  storeMessages() {
    JSON.stringify(this.messages);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.http.put('https://cms-fall-2021-default-rtdb.firebaseio.com/messages.json', this.messages, {headers})
    .subscribe(() => {
      this.messageListChangedEvent.next(this.messages.slice());
    })
  }

  addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages();
  }
}
