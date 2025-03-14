function generateSudoku() {
    // 创建空白数独板
    const board = Array(9).fill().map(() => Array(9).fill(0));
    
    // 随机填充一些数字
    for (let i = 0; i < 17; i++) {
        while (true) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            const num = Math.floor(Math.random() * 9) + 1;
            if (board[row][col] === 0 && isValid(board, row, col, num)) {
                board[row][col] = num;
                break;
            }
        }
    }
    
    // 保存完整解答
    const solution = JSON.parse(JSON.stringify(board));
    solveSudoku(solution);
    
    return { puzzle: board, solution: solution };
}

function isValid(board, row, col, num) {
    // 检查行
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
    }
    
    // 检查列
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) return false;
    }
    
    // 检查3x3方格
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }
    
    return true;
}

function solveSudoku(board) {
    const emptySpot = findEmptySpot(board);
    if (!emptySpot) return true;
    
    const [row, col] = emptySpot;
    
    for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = 0;
        }
    }
    
    return false;
}

function findEmptySpot(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) return [i, j];
        }
    }
    return null;
}

// 生成数独题目和答案
const { puzzle, solution } = generateSudoku();

// 创建数独表格
function createSudokuTable() {
    const table = document.getElementById('sudoku');
    for (let i = 0; i < 9; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('td');
            cell.className = 'sudoku-cell';
            if (puzzle[i][j] !== 0) {
                cell.textContent = puzzle[i][j];
                cell.classList.add('given');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'sudoku-input';
                input.maxLength = 1;
                input.dataset.row = i;
                input.dataset.col = j;
                input.addEventListener('input', function(e) {
                    const value = e.target.value;
                    if (!/^[1-9]$/.test(value)) {
                        e.target.value = '';
                    }
                });
                cell.appendChild(input);

                const solutionSpan = document.createElement('span');
                solutionSpan.className = 'solution';
                solutionSpan.style.display = 'none';
                solutionSpan.textContent = solution[i][j];
                cell.appendChild(solutionSpan);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

// 检查用户填写的答案
function checkAnswers() {
    const inputs = document.querySelectorAll('.sudoku-input');
    let allCorrect = true;

    inputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        const value = parseInt(input.value) || 0;

        if (value === solution[row][col]) {
            input.classList.remove('incorrect');
        } else {
            input.classList.add('incorrect');
            allCorrect = false;
        }
    });

    if (allCorrect) {
        alert('恭喜你！答案全部正确！');
    }
}

// 显示/隐藏答案
function toggleSolution() {
    const solutions = document.querySelectorAll('.solution');
    const inputs = document.querySelectorAll('.sudoku-input');
    const isShowingSolution = solutions[0].style.display === 'none';
    
    solutions.forEach(span => {
        span.style.display = isShowingSolution ? 'inline' : 'none';
    });
    
    inputs.forEach(input => {
        input.style.visibility = isShowingSolution ? 'hidden' : 'visible';
    });
}

// 初始化数独表格
createSudokuTable();
checkAnswers();