export const uploadBlobToBucket = async (blob, bucketName, fileName, accessToken) => {
    const url = `https://storage.googleapis.com/upload/storage/v1/b/${bucketName}/o?uploadType=media&name=${fileName}`;

    // Prepare headers with the access token for authorization
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': blob.type, // Ensure you set the correct MIME type
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: blob,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('File uploaded successfully:', result);
        } else {
            console.error('Error uploading file:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};
