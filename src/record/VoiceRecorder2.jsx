import { useState } from 'react';

// import './VoiceRecorder.css';
import {useVoiceRecorder} from "./useVoiceRecorder.jsx";
import {uploadVideoBlobToBucket} from "./uploadnew.js"
import {sendPostRequest} from "./postAudioFileRef.js";
import {joinTextFields} from "./joinResponse.js";

export function VoiceRecorder2({ uploadUrl }) {
  const { isRecording, audioBlob, error, startRecording, stopRecording } = useVoiceRecorder();
  const [uploadStatus, setUploadStatus] = useState(null);

  const accessToken = 'ya29.a0AeDClZAcdvWgBaohKCosAE4895_KCGdgRZjo06Q7ZAFpdOnmm6RonztU4TH_h7x8pTLdVfP7OlxGdvprEjH8d2nQR1wfDfg3ONcXlgpzy1qSiZTq56OxhOEIgsbNMREDQNZgezMWphG_y5k0ou2_h5d80SKPPfUX1xqyMOVcMKcvZgaCgYKAY8SARASFQHGX2MizlOoV6KHVWndaQCoesjxVA0181'

  const handleUpload = async () => {
    setUploadStatus('Uploading...');

    try {
      // await uploadRecording(uploadUrl);
      await uploadVideoBlobToBucket(audioBlob, 'audio-files-122', 'test', accessToken)
      setUploadStatus('Upload successful!');
      let respJson
      await sendPostRequest()
      const response = joinTextFields(respJson)
      console.log(response)
    } catch {
      setUploadStatus('Upload failed. Please try again.');
    }
  };

  return (
    <div className="voice-recorder">
      <div className="button-group">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`button ${isRecording ? 'stop' : 'start'}`}
          disabled={!!audioBlob}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
        <button
          onClick={handleUpload}
          className="button upload"
          disabled={!audioBlob || isRecording}
        >
          Upload Recording
        </button>
      </div>

      {error && (
        <div className="alert error">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      )}

      {uploadStatus && (
        <div className={`alert ${uploadStatus.includes('successful') ? 'success' : 'error'}`}>
          <h4>Upload Status</h4>
          <p>{uploadStatus}</p>
        </div>
      )}

      {audioBlob && !isRecording && (
        <audio controls src={URL.createObjectURL(audioBlob)} className="audio-player" />
      )}
    </div>
  );
}

