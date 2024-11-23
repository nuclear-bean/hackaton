export function uploadBlob(voiceBlob) {
    console.log("uploading blob")
    const formData = new FormData();
    formData.append('file', voiceBlob, 'recording.wav'); // 'recording.wav' is the file name you can use

// The URL to which you want to POST the Blob
    const externalUrl = 'gs://audio-files-122';

// Use fetch to send the request
    fetch(externalUrl, {
        method: 'POST',
        body: formData,
        headers: {
            'Authentication' : 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ5NzQwYTcwYjA5NzJkY2NmNzVmYTg4YmM1MjliZDE2YTMwNTczYmQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIzMjU1NTk0MDU1OS5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsImF1ZCI6IjMyNTU1OTQwNTU5LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTA0ODkyMzY2OTYwNTA1OTU4MDQzIiwiaGQiOiJzdC5zd3BzLmVkdS5wbCIsImVtYWlsIjoibW1hcmV3aWN6QHN0LnN3cHMuZWR1LnBsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJjOWJNSHY1RVFHWFNrNDNFV3pfNVVBIiwiaWF0IjoxNzMyMzY5OTA5LCJleHAiOjE3MzIzNzM1MDl9.VGSIahhOKjAFr5IsPnhBsqA2sAQHrHHynM9rSmjhNolLr4AjqINXpQFMez1EMovTqlvLvru8BYM3tiF2spd0UbjIINmMvQ7Hui_r2qeUgTmecaasGzwm8fUjNjqeFvBwS5x-993qZZ7R3zC4umw4A3yE32eltlQh89KQNHtIBVp0bpUMrvdc9fzYSJeE_n8U1YdFgfVRiiz1kQFp8Oobd3AYcRzwSj4dWgGEGn9cxVWepmu2ifpATVvMafF1ChlM8Yyo4nVJgTcn_cTCNvUjs1EWhphst1iM8JnYYeuM8NHPLcAEZcnrBnOufouI8pirCRvRoT126oPLxQTl0f_S1A'
            // Note: You typically do NOT need to set `Content-Type` when using FormData.
            // Some servers might require additional headers, check the API documentation.
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Assuming the response is JSON
        })
        .then(data => {
            console.log('Upload successful:', data);
        })
        .catch(error => {
            console.error('Error uploading the Blob:', error);
        });
}