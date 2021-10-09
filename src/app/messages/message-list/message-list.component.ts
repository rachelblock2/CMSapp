import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'Hello there.', 'General Kenobi!', 'Obi Wan'),
    new Message('2', 'Homework', 'Did you complete the homework for this week?', 'teacher'),
    new Message('3', 'Re: Homework', 'You mean watching Star Wars? Yes.', 'student')]

  constructor() { }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
