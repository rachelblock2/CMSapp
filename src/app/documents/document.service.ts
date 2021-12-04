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

  constructor(private http: HttpClient) {}

  sortAndSend() {
    this.documents.sort((a, b) => (a.name > b.name) ? 1 :((b.name > a.name) ? -1 : 0));
    this.documentListChangedEvent.next(this.documents.slice());
  }

  getDocuments() { 
    this.http.get<{documents: Document[]}>('http://localhost:3000/documents')
    .subscribe((response) => {
      this.documents = response.documents;
      this.sortAndSend();
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


  addDocument(document: Document) {
    if (!document) {
      return
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ messageData: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return
    };

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);
    if (pos < 0) {
      return
    };

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (responseData) => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

  deleteDocument(document: Document) {
    if(!document) {
      return;
    }
    
    const pos = this.documents.findIndex(d => d.id === document.id);
    if (pos < 0){
      return;
    }


     // delete from database
     this.http.delete('http://localhost:3000/documents/' + document.id)
     .subscribe(
       (responseData) => {
         this.documents.splice(pos, 1);
         this.sortAndSend();
       }
     );
  }

}
