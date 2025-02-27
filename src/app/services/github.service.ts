import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private readonly baseUrl =
    'https://api.github.com/repos/aheroglu/aheOS/contents';

  constructor(private http: HttpClient) {}

  getRepositoryContents(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }
}
