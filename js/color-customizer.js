// ==========================================================================
// Кастомізатор Кольорів
// ==========================================================================
function applyRealtimeColor(type, colorHex) {
    if (type === 'accent') {
        document.documentElement.style.setProperty('--accent-operator', colorHex);
        document.documentElement.style.setProperty('--accent-equals', colorHex);
        document.documentElement.style.setProperty('--badge-bg', `${colorHex}25`);
        document.documentElement.style.setProperty('--badge-border', `${colorHex}55`);
        document.getElementById('picker-accent-color').value = colorHex;
        document.getElementById('hex-accent-color').value = colorHex;
    } else if (type === 'bg') {
        document.documentElement.style.setProperty('--bg-body', colorHex);
        document.documentElement.style.setProperty('--bg-card', `${colorHex}d9`);
        document.getElementById('picker-bg-color').value = colorHex;
        document.getElementById('hex-bg-color').value = colorHex;
    }
}

function resetCustomColors() {
    document.documentElement.style.removeProperty('--accent-operator');
    document.documentElement.style.removeProperty('--accent-equals');
    document.documentElement.style.removeProperty('--badge-bg');
    document.documentElement.style.removeProperty('--badge-border');
    document.documentElement.style.removeProperty('--bg-body');
    document.documentElement.style.removeProperty('--bg-card');
    showToast('Кольори теми відновлено', '🎨');
}

