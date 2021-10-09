import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  documents: Document[] = [new Document('1', 'testName', 'testDescription', 'testUrl', null), 
  new Document('2', 'testName', 'testDescription', 'testUrl', null)]

  constructor() { }

  ngOnInit(): void {
  }

}
