import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
  new Document('1', 'testName1', 'testDescription1', 'testUrl1', null), 
  new Document('2', 'testName2', 'testDescription2', 'testUrl2', null),
  new Document('3', 'testName3', 'testDescription3', 'testUrl3', null),
  new Document('4', 'testName4', 'testDescription4', 'testUrl4', null),
  new Document('5', 'testName5', 'testDescription5', 'testUrl5', null)
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }

}
