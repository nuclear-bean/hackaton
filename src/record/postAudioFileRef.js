// Function to send the request
import js from "@eslint/js";

export const sendPostRequest = async () => {
    const projectId = 'tech-hackaton-442611'
    const modelId = 'gemini-1.5-flash-002'
    const accessToken = 'ya29.a0AeDClZCxlBZ7HIZ5zaRulQo9_DcRk5HuDRo-1KCm3iIeAM3JouT1jnO4uNX05pYZ11tCc8LFInwgiPsVclUSvjgGAxOOgKxwatkDn4gBVSv_3Tn1GP1p4o-92tMJX5HokPRPbV18smCG34NsetvwM7BseujXUIwvMC2bAOFyaCgYKAeUSARASFQHGX2MiQXD6rZjs8CGj9EHwVepV7g0175'

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