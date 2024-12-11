import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {

  // URL pour le back-end SVM
  private apiUrlSvm = 'http://127.0.0.1:5000/predict_svm'; 

  // URL pour le back-end VGG
  private apiUrlVgg = 'http://vgg-backend:5001/predict_vgg';  // URL correcte pour le back-end VGG

  constructor(private http: HttpClient) {}

  // Méthode pour télécharger un fichier et appeler l'API en fonction du modèle souhaité (SVM ou VGG)
  uploadFile(file: File, modelType: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Choisir l'API en fonction du modèle (SVM ou VGG)
    let apiUrl = '';
    if (modelType === 'svm') {
      apiUrl = this.apiUrlSvm;  // Utiliser l'API SVM
    } else if (modelType === 'vgg') {
      apiUrl = this.apiUrlVgg;  // Utiliser l'API VGG
    } else {
      throw new Error('Modèle inconnu');
    }

    // Faire l'appel HTTP à l'API choisie
    return this.http.post(apiUrl, formData);
  }
}
