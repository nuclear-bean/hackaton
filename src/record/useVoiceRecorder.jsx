import { useState, useCallback } from 'react';

export function useVoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [error, setError] = useState(null);

    let mediaRecorder = null;
    let audioChunks = [];

    const startRecording = useCallback(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    setAudioBlob(audioBlob);
                    audioChunks = [];
                };
                mediaRecorder.start();
                setIsRecording(true);
            })
            .catch(err => {
                setError('Error accessing microphone: ' + err.message);
            });
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    }, []);

    return { isRecording, audioBlob, error, startRecording, stopRecording };
}

