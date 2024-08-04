import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { COMMENTS_URL } from '../constants/urls';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}
  private apiUrl = COMMENTS_URL;

  addComment(postId: string, text: string) {
    const url = `${this.apiUrl}/images/${postId}/comments`;
    const body = { text };
    return this.http.post(url, body);
  }

  deleteComment(commentId: string) {
    const url = `${this.apiUrl}/${commentId}`;
    return this.http.delete(url);
  }

  getCommentsForPost(postId: string) {
    const url = `${this.apiUrl}/images/${postId}/comments`;
    return this.http.get(url);
  }
}
