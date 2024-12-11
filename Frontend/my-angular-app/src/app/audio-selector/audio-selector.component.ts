import { Component } from '@angular/core';

@Component({
  selector: 'app-audio-selector',
  templateUrl: './audio-selector.component.html',
  styleUrls: ['./audio-selector.component.css']
})
export class AudioSelectorComponent {
  selectedFileName: string | null = null;  // Nom du fichier sélectionné
  selectedModel: string = 'svm';  // Modèle sélectionné (par défaut SVM)
  selectedFile: File | null = null;  // Fichier sélectionné
  result: string | null = null;  // Résultat de la classification, initialement null

  // Méthode pour gérer la sélection du fichier audio
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Stocke le fichier sélectionné
      this.selectedFileName = file.name;  // Met à jour le nom du fichier
      console.log('Fichier sélectionné:', file);  // Log pour débogage
    }
  }

  // Méthode pour télécharger et classifier le fichier audio
  uploadFile(): void {
    if (!this.selectedFile) {
      this.result = 'Veuillez sélectionner un fichier avant de soumettre.';
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);  // Utilise le fichier sélectionné

    console.log('Envoi du fichier au serveur:', this.selectedFile.name);  // Log pour débogage

    if (this.selectedModel === 'svm') {
      // Appel de l'API pour prédire avec le modèle SVM
      fetch('http://127.0.0.1:5000/predict_svm', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Réponse reçue de l\'API SVM:', response);  // Log pour débogage
        return response.json();
      })
      .then(data => {
        console.log('Données reçues de l\'API SVM:', data);  // Log pour débogage
        if (data.genre) {
          this.result = `Classification avec le modèle SVM... Résultat : ${data.genre}`;
        } else {
          this.result = `Erreur : ${data.error}`;
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel à l\'API SVM:', error);  // Log pour débogage
        this.result = `Erreur lors de l'appel à l'API SVM : ${error.message}`;
      });

    } else if (this.selectedModel === 'vgg') {
      // Appel de l'API pour prédire avec le modèle VGG
      fetch('http://localhost:5001/predict_vgg', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        console.log('Réponse reçue de l\'API VGG:', response);  // Log pour débogage
        return response.json();
      })
      .then(data => {
        console.log('Données reçues de l\'API VGG:', data);  // Log pour débogage
        if (data.predicted_genre) {
          this.result = `Classification avec le modèle VGG... Résultat : ${data.predicted_genre}`;
        } else {
          this.result = `Erreur : ${data.error}`;
        }
      })
      .catch(error => {
        console.error('Erreur lors de l\'appel à l\'API VGG:', error);  // Log pour débogage
        this.result = `Erreur lors de l'appel à l'API VGG : ${error.message}`;
      });

    } else {
      this.result = 'Modèle non valide sélectionné.';
    }
  }
}
