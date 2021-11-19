import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];
  maxDocumentId: number;

  constructor(private http: HttpClient) {
    this.maxDocumentId = this.getMaxId();
   }

  getMaxId(): number {
    let maxId = 0;
    for (let document of this.documents) {
      let currentId = parseInt(document.id); //should be document.id
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId
  }

  getDocuments() { 
    this.http.get<Document[]>('https://cms-fall-2021-default-rtdb.firebaseio.com/documents.json')
    .subscribe((documents: Document[]) => {
      this.documents = documents;
      this.maxDocumentId = this.getMaxId();
      this.documents.sort((a, b) => (a.name > b.name) ? 1 :((b.name > a.name) ? -1 : 0));
      console.log(this.documents);
      this.documentListChangedEvent.next(this.documents.slice());
    }, (error: any) => {
        console.log(error.message);
    })
  }

  getDocument(id: string) {
    for (let document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
  }

  storeDocuments() {
    JSON.stringify(this.documents);
    const headers = new HttpHeaders().set('content-type', 'application/json');
    this.http.put('https://cms-fall-2021-default-rtdb.firebaseio.com/documents.json', this.documents, {headers})
    .subscribe(() => {
      this.documentListChangedEvent.next(this.documents.slice());
    })
  }

  addDocument(newDocument: Document) {
    if (!newDocument) {
      return
    }

    this.maxDocumentId++; //increases the id for the new document so it is unique
    newDocument.id = this.maxDocumentId.toString();

    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    };

    let pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return
    };
    
    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if(!document) {
      return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0){
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }

}
