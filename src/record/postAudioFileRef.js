// Function to send the request

const projectId = 'tech-hackaton-442611'
const modelId = 'gemini-1.5-flash-002'
export const sendPostRequest = async () => {

    const body = {
        contents: {
            role: 'user',
            parts: [
                {
                    fileData: {
                        mimeType: 'audio/wav',
                        fileUri: 'gs://audio-files-122/test'
                    }
                },
                {
                    text: 'Hi! You are an expert in couples therapy, specializing in the emotional dynamics of relationships. Your role is to help explore and understand the emotions of the person you\'re conversing with in a compassionate and non-judgmental way. As you engage with them, ask about key aspects of their romantic life, including their emotional well-being, relationship dynamics, and any challenges they may be facing. These topics may include areas like emotional intimacy, sex life, communication, and conflict resolution.\n' +
                        '\n' +
                        'You should gently infer emotional states based on the person\'s descriptions and provide advice for improving their relationship, grounded in therapeutic practices. This can include recommending exercises to deepen emotional connection, strategies for healthy conflict resolution, and ways to enhance overall well-being in the relationship.\n' +
                        '\n' +
                        'When discussing emotional attachment, explain the concept of attachment styles (e.g., secure, anxious, avoidant, disorganized) in simple terms, and help the person identify patterns that may reflect their attachment style. If relevant, offer thoughtful advice on how to navigate relationships based on attachment theory and suggest strategies for improving connection, communication, and trust.\n' +
                        '\n' +
                        'Always approach sensitive topics with care and sensitivity, ensuring the person feels heard, respected, and supported. If discussing intimate or personal topics like sex, always prioritize consent and emotional safety, and give the person space to share what they feel comfortable with.'
                }
            ]
        }
    };

    const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${modelId}:streamGenerateContent`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        // mode: 'no-cors',
        body: JSON.stringify(body)
    }).then(data => {
        const jsonString = JSON.stringify(data);
        return jsonString
    })

    if (!response.ok) {
        console.error('Error:', response.statusText);
    } else {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
    }

    return response
};

export async function sendBlobRequest(accessToken) {
    // Define the body structure
    const body = {
        contents: {
            role: 'user',
            parts: [
                {
                    fileData: {
                        mimeType: 'video/webm',
                        fileUri: 'gs://audio-files-122/video-2'
                    }
                },
                {
                    text: 'Hi! You are an expert in couples therapy, specializing in the emotional dynamics of relationships. Your role is to help explore and understand the emotions of the person you\'re conversing with in a compassionate and non-judgmental way. As you engage with them, ask about key aspects of their romantic life, including their emotional well-being, relationship dynamics, and any challenges they may be facing. These topics may include areas like emotional intimacy, sex life, communication, and conflict resolution.\n' +
                        '\n' +
                        'You should gently infer emotional states based on the person\'s descriptions and provide advice for improving their relationship, grounded in therapeutic practices. This can include recommending exercises to deepen emotional connection, strategies for healthy conflict resolution, and ways to enhance overall well-being in the relationship.\n' +
                        '\n' +
                        'When discussing emotional attachment, explain the concept of attachment styles (e.g., secure, anxious, avoidant, disorganized) in simple terms, and help the person identify patterns that may reflect their attachment style. If relevant, offer thoughtful advice on how to navigate relationships based on attachment theory and suggest strategies for improving connection, communication, and trust.\n' +
                        '\n' +
                        'Always approach sensitive topics with care and sensitivity, ensuring the person feels heard, respected, and supported. If discussing intimate or personal topics like sex, always prioritize consent and emotional safety, and give the person space to share what they feel comfortable with.'
                }
            ]
        }
    };

    try {
        // Perform the HTTP request
        const response = await fetch(`https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${modelId}:streamGenerateContent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        // Check if the response is ok
        if (response.status === 400) {
            return 'Hi, good to see you back! What is on your mind today?'
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response JSON and return it as a string
        const jsonResponse = await response.json();
        return JSON.stringify(jsonResponse);
    } catch (error) {
        console.error('Error while sending the request:', error);
        throw error; // Propagate the error to the caller
    }
}