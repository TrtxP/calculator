// ==========================================================================
// Голосове Озвучення (Speech Synthesis)
// ==========================================================================
function speakCurrentResult() {
    if (!('speechSynthesis' in window)) {
        showToast('Speech Synthesis не підтримується', '⚠️');
        return;
    }

    audio.playAction();
    window.speechSynthesis.cancel();

    let textToSpeak = state.currentInput;
    if (textToSpeak === 'Помилка') {
        textToSpeak = 'Помилка обчислення. Будь ласка, перегляньте математичний порадник.';
    } else {
        textToSpeak = `Результат: ${state.currentInput.replace('-', 'мінус ')}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'uk-UA';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find(v => v.lang.includes('uk') || v.lang.includes('UA'));
    if (ukVoice) utterance.voice = ukVoice;

    window.speechSynthesis.speak(utterance);
    showToast(`Озвучено: ${state.currentInput}`, '🗣️');
}
