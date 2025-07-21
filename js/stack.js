// Stack Visualization
class Stack {
    constructor() {
        this.canvas = document.getElementById('stackCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.maxItems = 5;
        this.itemHeight = 30;
        this.itemWidth = 60;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('stackInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    reset() {
        this.setInfoBox('Reset: Clears the stack.');
        this.items = [];
        this.draw();
    }

    push() {
        this.setInfoBox('Push: Adds a new element to the top of the stack.');
        if (this.items.length >= this.maxItems) {
            showAlert('Stack overflow!', 'danger');
            return;
        }
        const value = getRandomInt(1, 99);
        this.items.push(value);
        this.draw();
        showAlert(`Pushed ${value} to stack`, 'success');
    }

    pop() {
        this.setInfoBox('Pop: Removes the top element from the stack.');
        if (this.items.length === 0) {
            showAlert('Stack underflow!', 'danger');
            return;
        }
        const value = this.items[this.items.length - 1];
        this.items.pop();
        this.draw();
        showAlert(`Popped ${value} from stack`, 'success');
    }

    peek() {
        this.setInfoBox('Peek: Views the top element of the stack without removing it.');
        if (this.items.length === 0) {
            showAlert('Stack is empty!', 'danger');
            return;
        }
        const value = this.items[this.items.length - 1];
        this.draw();
        showAlert(`Peeked: ${value}`, 'info');
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.canvas.width / 2 - this.itemWidth / 2 - 5,
            20,
            this.itemWidth + 10,
            this.canvas.height - 40
        );
        for (let i = 0; i < this.items.length; i++) {
            const y = this.canvas.height - 20 - (i + 1) * this.itemHeight;
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                y,
                this.itemWidth,
                this.itemHeight
            );
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                y,
                this.itemWidth,
                this.itemHeight
            );
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                this.items[i],
                this.canvas.width / 2,
                y + this.itemHeight / 2
            );
        }
        if (this.items.length > 0) {
            this.ctx.fillStyle = '#28a745';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                'TOP',
                this.canvas.width / 2 + this.itemWidth / 2 + 20,
                this.canvas.height - 20 - this.items.length * this.itemHeight + this.itemHeight / 2
            );
        }
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Size: ${this.items.length}/${this.maxItems}`,
            this.canvas.width / 2,
            10
        );
    }
}

// Initialize Stack
const stack = new Stack(); 