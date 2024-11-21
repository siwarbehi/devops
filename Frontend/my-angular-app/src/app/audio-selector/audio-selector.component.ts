import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-audio-selector',
    templateUrl: './audio-selector.component.html',
    styleUrls: ['./audio-selector.component.css']
})
export class AudioSelectorComponent {
    selectedFile: File | null = null;
    selectedFileName: string | null = null;
    result: string | null = null;

    constructor(private http: HttpClient) {}

    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file;
            this.selectedFileName = file.name;
        } else {
            this.selectedFileName = 'No file selected';
        }
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            alert('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', this.selectedFile);

        // Replace with your Flask backend URL
        const uploadUrl = 'http://localhost:5000/api/upload';

        this.http.post<{ genre: string }>(uploadUrl, formData).subscribe(
            (response) => {
                if (response && response.genre) {
                    this.result = `Predicted Genre: ${response.genre}`;
                } else {
                    this.result = 'Unable to determine the genre. Please try again.';
                }
            },
            (error) => {
                console.error('Error:', error);
                alert('An error occurred while uploading the file.');
            }
        );
    }
}
