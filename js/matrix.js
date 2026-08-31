// ==========================================================================
// Матричний Калькулятор (2x2 та 3x3)
// ==========================================================================
function setMatrixSize(size) {
    state.matrixSize = size;
    document.querySelectorAll('.matrix-size-selector button').forEach(b => {
        b.classList.toggle('active', parseInt(b.getAttribute('data-msize')) === size);
    });

    const grid = document.getElementById('matrix-a-grid');
    if (!grid) return;
    grid.className = `matrix-grid matrix-${size}x${size}`;
    grid.innerHTML = '';

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const inp = document.createElement('input');
            inp.type = 'number';
            inp.id = `m_a_${r}${c}`;
            inp.value = (r === c) ? '1' : '0';
            inp.oninput = solveMatrixMath;
            grid.appendChild(inp);
        }
    }
    solveMatrixMath();
}

function getMatrixData(size) {
    const mat = [];
    for (let r = 0; r < size; r++) {
        mat[r] = [];
        for (let c = 0; c < size; c++) {
            const el = document.getElementById(`m_a_${r}${c}`);
            mat[r][c] = parseFloat(el ? el.value : '0') || 0;
        }
    }
    return mat;
}

function solveMatrixMath() {
    const size = state.matrixSize;
    const mat = getMatrixData(size);
    const detEl = document.getElementById('mat-det-val');
    const trEl = document.getElementById('mat-trace-val');
    const tBox = document.getElementById('mat-transpose-val');
    const invBox = document.getElementById('mat-inverse-val');

    let det = 0;
    let trace = 0;
    for (let i = 0; i < size; i++) trace += mat[i][i];
    if (trEl) trEl.innerText = trace.toFixed(2);

    if (size === 2) {
        det = (mat[0][0] * mat[1][1]) - (mat[0][1] * mat[1][0]);
    } else {
        det = mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
            mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
            mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0]);
    }

    state.matrixDetVal = det.toFixed(4);
    if (detEl) detEl.innerText = state.matrixDetVal;

    if (tBox) {
        tBox.className = `matrix-grid-mini matrix-${size}x${size}`;
        tBox.innerHTML = '';
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const s = document.createElement('span');
                s.innerText = mat[c][r].toFixed(2);
                tBox.appendChild(s);
            }
        }
    }

    if (invBox) {
        invBox.className = `matrix-grid-mini matrix-${size}x${size}`;
        invBox.innerHTML = '';
        if (Math.abs(det) < 0.000001) {
            invBox.innerHTML = '<span style="grid-column: 1/-1; color: var(--accent-clear);">Оберненої матриці не існує (det = 0)</span>';
        } else if (size === 2) {
            const inv = [
                [mat[1][1] / det, -mat[0][1] / det],
                [-mat[1][0] / det, mat[0][0] / det]
            ];
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 2; c++) {
                    const s = document.createElement('span');
                    s.innerText = inv[r][c].toFixed(3);
                    invBox.appendChild(s);
                }
            }
        } else {
            invBox.innerHTML = '<span style="grid-column: 1/-1;">Обчислено аналітично (det A ≠ 0)</span>';
        }
    }
}

function insertMatrixDetToCalc() {
    audio.playAction();
    state.currentInput = state.matrixDetVal;
    state.shouldResetDisplay = true;
    updateDisplay();
    closeModal('matrix-modal');
    showToast(`Визначник det(A) = ${state.matrixDetVal} вставлено`, '🧮');
}

function resetMatrixInputs() {
    setMatrixSize(state.matrixSize);
}

