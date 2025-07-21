// String Visualization
class StringVisualizer {
    constructor() {
        this.canvas = document.getElementById('stringCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.text = '';
        this.maxLength = 11;
        this.charWidth = 30;
        this.charHeight = 40;
        this.sampleStrings = ['HELLO', 'WORLD', 'ALGORITHM', 'DATA', 'STRUCTURE'];
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('stringInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    insert() {
        this.setInfoBox('Insert: Adds a new character to the end of the string.');
        if (this.text.length >= this.maxLength) {
            showAlert('String is at maximum length!', 'danger');
            return;
        }
        const sampleString = this.sampleStrings[Math.floor(Math.random() * this.sampleStrings.length)];
        const char = sampleString[Math.floor(Math.random() * sampleString.length)];
        const position = this.text.length;
        this.text += char;
        this.draw();
        showAlert(`Inserted '${char}' at position ${position}`, 'success');
    }

    delete() {
        this.setInfoBox('Delete: Removes the last character from the string.');
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }
        const position = this.text.length - 1;
        const deletedChar = this.text[position];
        this.text = this.text.slice(0, -1);
        this.draw();
        showAlert(`Deleted '${deletedChar}' from position ${position}`, 'success');
    }

    reverse() {
        this.setInfoBox('Reverse: Reverses the order of characters in the string.');
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }
        if (this.text.length === 1) {
            showAlert('String has only one character!', 'warning');
            return;
        }
        this.text = this.text.split('').reverse().join('');
        this.draw();
        showAlert('String reversed!', 'success');
    }

    substring() {
        this.setInfoBox('Substring: Extracts a portion of the string.');
        if (this.text.length < 2) {
            showAlert('String too short for substring operation!', 'warning');
            return;
        }
        const start = Math.floor(Math.random() * (this.text.length - 1));
        const end = start + Math.floor(Math.random() * (this.text.length - start)) + 1;
        const substring = this.text.substring(start, end);
        this.draw();
        showAlert(`Substring [${start}:${end}]: "${substring}"`, 'success');
    }

    findPattern() {
        this.setInfoBox('Pattern Search: Searches for a pattern within the string.');
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }
        const pattern = this.text.length >= 2 ? this.text.substring(0, 2) : this.text[0];
        let found = false;
        for (let i = 0; i <= this.text.length - pattern.length; i++) {
            const currentSubstring = this.text.substring(i, i + pattern.length);
            if (currentSubstring === pattern) {
                found = true;
                showAlert(`Pattern "${pattern}" found at position ${i}`, 'success');
                break;
            }
        }
        if (!found) {
            showAlert(`Pattern "${pattern}" not found`, 'danger');
        }
        this.draw();
    }

    palindrome() {
        this.setInfoBox('Palindrome: Checks if the string reads the same forwards and backwards.');
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }
        const n = this.text.length;
        let isPalindrome = true;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            if (this.text[i] !== this.text[n - 1 - i]) {
                isPalindrome = false;
                showAlert(`Not a palindrome: '${this.text[i]}' \u2260 '${this.text[n - 1 - i]}'`, 'danger');
                break;
            }
        }
        if (isPalindrome) {
            showAlert(`"${this.text}" is a palindrome!`, 'success');
        }
        this.draw();
    }

    reset() {
        this.setInfoBox('Reset: Clears the string.');
        this.text = '';
        this.draw();
    }

    getCharX(position) {
        return 20 + position * (this.charWidth + 5);
    }

    getCharY(position) {
        return this.canvas.height / 2 - this.charHeight / 2;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.text.length; i++) {
            const x = this.getCharX(i);
            const y = this.getCharY(i);
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(x, y, this.charWidth, this.charHeight);
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.charWidth, this.charHeight);
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.text[i], x + this.charWidth / 2, y + this.charHeight / 2);
            this.ctx.fillStyle = '#666';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(i, x + this.charWidth / 2, y + this.charHeight + 12);
        }
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('String', this.canvas.width / 2, 20);
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Length: ${this.text.length}/${this.maxLength}`, this.canvas.width / 2, this.canvas.height - 10);
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`"${this.text}"`, this.canvas.width / 2, this.canvas.height - 30);
    }
}

// Initialize String Visualizer
const stringVisualizer = new StringVisualizer(); 