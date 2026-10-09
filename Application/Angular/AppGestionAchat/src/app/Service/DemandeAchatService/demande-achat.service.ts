import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DemandeAchatService {
  private apiUrl = 'http://localhost:8080/demandes/create';

  constructor(private http: HttpClient) {}

  createDemandeAchat(demandeAchatData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, demandeAchatData);
  }

  // Méthode pour récupérer les demandes d'achat d'un utilisateur spécifique
  getDemandesByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8080/demandes/user/${userId}`);
  }
  deleteDemandeAchat(demandeId: number) {
    return this.http.delete(`http://localhost:8080/demandes/delete/${demandeId}`);
  }
}
