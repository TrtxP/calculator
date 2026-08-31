// ==========================================================================
// Клавіатурна навігація
// ==========================================================================
document.addEventListener('keydown', (event) => {
    // Command Palette (Ctrl+K / ⌘K)
    if ((event.ctrlKey || event.metaKey) && (event.key === 'k' || event.key === 'K' || event.key === 'л' || event.key === 'Л')) {
        event.preventDefault();
        openCommandPalette();
        return;
    }

    // Довідник клавіш (F1 або ?)
    if (event.key === 'F1' || (event.key === '?' && document.activeElement.tagName !== 'INPUT')) {
        event.preventDefault();
        openModal('shortcuts-modal');
        return;
    }

    // Навігація всередині відкритого Command Palette
    const paletteModal = document.getElementById('command-palette-modal');
    if (paletteModal && paletteModal.classList.contains('active')) {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (filteredCommandItems.length > 0) {
                selectedCommandIndex = (selectedCommandIndex + 1) % filteredCommandItems.length;
                selectCommandIndex(selectedCommandIndex);
                scrollSelectedCommandIntoView();
            }
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (filteredCommandItems.length > 0) {
                selectedCommandIndex = (selectedCommandIndex - 1 + filteredCommandItems.length) % filteredCommandItems.length;
                selectCommandIndex(selectedCommandIndex);
                scrollSelectedCommandIntoView();
            }
            return;
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (filteredCommandItems.length > 0) {
                executeCommandPaletteItem(selectedCommandIndex);
            }
            return;
        }
    }

    if (event.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
            activeModal.classList.remove('active');
            return;
        }
        clearDisplay();
        return;
    }

    if (event.key === 'F11') {
        event.preventDefault();
        toggleFullScreen();
        return;
    }

    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key);
        triggerKeyEffect(event.key);
        return;
    }

    if (event.key === '.' || event.key === ',') {
        appendNumber('.');
        triggerKeyEffect('.');
        return;
    }

    if (event.key === '=' || event.key === 'Enter') {
        event.preventDefault();
        calculate();
        triggerKeyEffect('=');
        return;
    }

    if (event.key === 'Backspace') {
        backspace();
        triggerKeyEffect('⌫');
        return;
    }

    if (event.key === '+' || event.key === '-') {
        appendOperator(event.key);
        triggerKeyEffect(event.key === '-' ? '−' : '+');
        return;
    }
    if (event.key === '*' || event.key === 'x' || event.key === 'X') {
        appendOperator('*');
        triggerKeyEffect('×');
        return;
    }
    if (event.key === '/') {
        event.preventDefault();
        appendOperator('/');
        triggerKeyEffect('÷');
        return;
    }
    if (event.key === '^') {
        appendOperator('^');
        triggerKeyEffect('xⁿ');
        return;
    }
    if (event.key === '(' || event.key === ')') {
        appendBracket(event.key);
        triggerKeyEffect(event.key);
        return;
    }

    if (event.key === 's' || event.key === 'S' || event.key === 'і' || event.key === 'І') {
        if (!event.ctrlKey && !event.metaKey && document.activeElement.tagName !== 'INPUT') {
            toggleSecondMode();
            return;
        }
    }
    if (event.key === 'd' || event.key === 'D' || event.key === 'в' || event.key === 'В') {
        if (!event.ctrlKey && !event.metaKey && document.activeElement.tagName !== 'INPUT') {
            toggleAngleMode();
            return;
        }
    }
    if (event.key === 'v' || event.key === 'V' || event.key === 'м' || event.key === 'М') {
        if (!event.ctrlKey && !event.metaKey && document.activeElement.tagName !== 'INPUT') {
            speakCurrentResult();
            return;
        }
    }
    if (event.key === 'h' || event.key === 'H' || event.key === 'р' || event.key === 'Р') {
        if (!event.ctrlKey && !event.metaKey && document.activeElement.tagName !== 'INPUT') {
            openModal('history-modal');
            return;
        }
    }

    if ((event.ctrlKey || event.metaKey) && (event.key === 'v' || event.key === 'V')) {
        navigator.clipboard.readText().then(text => {
            const clean = text.trim().replace(',', '.').replace(/\s/g, '');
            if (!isNaN(parseFloat(clean))) {
                state.currentInput = clean;
                state.shouldResetDisplay = true;
                updateDisplay();
                showToast(`Вставлено: ${clean}`, '📋');
            }
        }).catch(() => { });
        return;
    }

    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
        copyToClipboard();
        return;
    }
});

function triggerKeyEffect(label) {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(btn => {
        if (btn.innerText.trim() === label || btn.getAttribute('data-key') === label) {
            btn.classList.add('is-pressed');
            setTimeout(() => btn.classList.remove('is-pressed'), 140);
        }
    });
}

