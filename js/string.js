// String Visualization
class StringVisualizer {
    constructor() {
        this.canvas = document.getElementById('stringCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.text = '';
        this.maxLength = 11;
        this.charWidth = 30;
        this.charHeight = 40;
        this.animationSpeed = 500;
        this.sampleStrings = ['HELLO', 'WORLD', 'ALGORITHM', 'DATA', 'STRUCTURE'];
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.text = '';
        this.draw();
    }

    async insert() {
        if (this.text.length >= this.maxLength) {
            showAlert('String is at maximum length!', 'danger');
            return;
        }

        const sampleString = this.sampleStrings[Math.floor(Math.random() * this.sampleStrings.length)];
        const char = sampleString[Math.floor(Math.random() * sampleString.length)];
        const position = this.text.length;
        
        // Animate insertion
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = '#ffc107';
        this.ctx.fillRect(
            this.getCharX(position),
            this.getCharY(position),
            this.charWidth,
            this.charHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        this.text += char;
        this.draw();
        
        showAlert(`Inserted '${char}' at position ${position}`, 'success');
    }

    async delete() {
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }

        const position = this.text.length - 1;
        const deletedChar = this.text[position];
        
        // Highlight character for deletion
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.getCharX(position),
            this.getCharY(position),
            this.charWidth,
            this.charHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        this.text = this.text.slice(0, -1);
        this.draw();
        
        showAlert(`Deleted '${deletedChar}' from position ${position}`, 'success');
    }

    async reverse() {
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }

        if (this.text.length === 1) {
            showAlert('String has only one character!', 'warning');
            return;
        }

        // Animate reverse process
        const n = this.text.length;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            // Highlight characters being swapped
            this.ctx.save();
            this.ctx.fillStyle = '#ffc107';
            this.ctx.fillRect(
                this.getCharX(i),
                this.getCharY(i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.fillRect(
                this.getCharX(n - 1 - i),
                this.getCharY(n - 1 - i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            // Swap characters
            const temp = this.text[i];
            this.text = this.text.substring(0, i) + this.text[n - 1 - i] + this.text.substring(i + 1);
            this.text = this.text.substring(0, n - 1 - i) + temp + this.text.substring(n - i);
            
            // Highlight swap
            this.ctx.save();
            this.ctx.fillStyle = '#dc3545';
            this.ctx.fillRect(
                this.getCharX(i),
                this.getCharY(i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.fillRect(
                this.getCharX(n - 1 - i),
                this.getCharY(n - 1 - i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
        }
        
        showAlert('String reversed!', 'success');
    }

    async substring() {
        if (this.text.length < 2) {
            showAlert('String too short for substring operation!', 'warning');
            return;
        }

        const start = Math.floor(Math.random() * (this.text.length - 1));
        const end = start + Math.floor(Math.random() * (this.text.length - start)) + 1;
        
        // Highlight substring
        for (let i = start; i < end; i++) {
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.fillRect(
                this.getCharX(i),
                this.getCharY(i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed / 2);
        }
        
        this.draw();
        await sleep(this.animationSpeed);
        
        const substring = this.text.substring(start, end);
        showAlert(`Substring [${start}:${end}]: "${substring}"`, 'success');
    }

    async findPattern() {
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }

        // Create a simple pattern to search for
        const pattern = this.text.length >= 2 ? this.text.substring(0, 2) : this.text[0];
        
        // Animate pattern search
        for (let i = 0; i <= this.text.length - pattern.length; i++) {
            // Highlight current window
            for (let j = 0; j < pattern.length; j++) {
                this.ctx.save();
                this.ctx.fillStyle = '#ffc107';
                this.ctx.fillRect(
                    this.getCharX(i + j),
                    this.getCharY(i + j),
                    this.charWidth,
                    this.charHeight
                );
                this.ctx.restore();
            }
            
            await sleep(this.animationSpeed);
            
            // Check if pattern matches
            const currentSubstring = this.text.substring(i, i + pattern.length);
            if (currentSubstring === pattern) {
                // Pattern found! Highlight in green
                for (let j = 0; j < pattern.length; j++) {
                    this.ctx.save();
                    this.ctx.fillStyle = '#28a745';
                    this.ctx.fillRect(
                        this.getCharX(i + j),
                        this.getCharY(i + j),
                        this.charWidth,
                        this.charHeight
                    );
                    this.ctx.restore();
                }
                
                this.draw();
                await sleep(this.animationSpeed);
                
                showAlert(`Pattern "${pattern}" found at position ${i}`, 'success');
                return;
            }
            
            this.draw();
            await sleep(200);
        }
        
        showAlert(`Pattern "${pattern}" not found`, 'danger');
    }

    async palindrome() {
        if (this.text.length === 0) {
            showAlert('String is empty!', 'danger');
            return;
        }

        const n = this.text.length;
        let isPalindrome = true;
        
        // Check palindrome by comparing characters from both ends
        for (let i = 0; i < Math.floor(n / 2); i++) {
            // Highlight characters being compared
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.fillRect(
                this.getCharX(i),
                this.getCharY(i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.fillRect(
                this.getCharX(n - 1 - i),
                this.getCharY(n - 1 - i),
                this.charWidth,
                this.charHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            if (this.text[i] !== this.text[n - 1 - i]) {
                isPalindrome = false;
                // Highlight mismatch in red
                this.ctx.save();
                this.ctx.fillStyle = '#dc3545';
                this.ctx.fillRect(
                    this.getCharX(i),
                    this.getCharY(i),
                    this.charWidth,
                    this.charHeight
                );
                this.ctx.fillRect(
                    this.getCharX(n - 1 - i),
                    this.getCharY(n - 1 - i),
                    this.charWidth,
                    this.charHeight
                );
                this.ctx.restore();
                
                this.draw();
                await sleep(this.animationSpeed);
                
                showAlert(`Not a palindrome: '${this.text[i]}' ≠ '${this.text[n - 1 - i]}'`, 'danger');
                return;
            }
            
            this.draw();
            await sleep(200);
        }
        
        if (isPalindrome) {
            showAlert(`"${this.text}" is a palindrome!`, 'success');
        }
    }

    getCharX(position) {
        return 20 + position * (this.charWidth + 5);
    }

    getCharY(position) {
        return this.canvas.height / 2 - this.charHeight / 2;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw string characters
        for (let i = 0; i < this.text.length; i++) {
            const x = this.getCharX(i);
            const y = this.getCharY(i);
            
            // Draw character background
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(x, y, this.charWidth, this.charHeight);
            
            // Draw character border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.charWidth, this.charHeight);
            
            // Draw character
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 16px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.text[i], x + this.charWidth / 2, y + this.charHeight / 2);
            
            // Draw position index
            this.ctx.fillStyle = '#666';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(i, x + this.charWidth / 2, y + this.charHeight + 12);
        }
        
        // Draw string info
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('String', this.canvas.width / 2, 20);
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Length: ${this.text.length}/${this.maxLength}`, this.canvas.width / 2, this.canvas.height - 10);
        
        // Draw current string value
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px Arial';
        this.ctx.fillText(`"${this.text}"`, this.canvas.width / 2, this.canvas.height - 30);
    }
}

// Initialize String Visualizer
const stringVisualizer = new StringVisualizer(); 