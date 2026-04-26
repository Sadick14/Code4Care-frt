export async function fetchSpeechAudio(text: string, voice = 'alloy', model = 'eleven_multilingual_v1') {
  // This expects a server-side proxy at /api/tts that calls a TTS provider (ElevenLabs, Polly, etc.)
  // Request shape: { text, voice, model }
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice, model }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`TTS proxy failed: ${res.status} ${txt}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export default fetchSpeechAudio;
