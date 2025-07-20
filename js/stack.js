// Stack Visualization
class Stack {
    constructor() {
        this.canvas = document.getElementById('stackCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.maxItems = 5;
        this.itemHeight = 30;
        this.itemWidth = 60;
        this.animationSpeed = 500;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.items = [];
        this.draw();
    }

    async push() {
        if (this.items.length >= this.maxItems) {
            showAlert('Stack overflow!', 'danger');
            return;
        }

        const value = getRandomInt(1, 99);
        
        // Animate push operation
        const startY = this.canvas.height - 20;
        const endY = this.canvas.height - 20 - (this.items.length + 1) * this.itemHeight;
        
        for (let i = 0; i <= 20; i++) {
            const currentY = startY - (i / 20) * (startY - endY);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
            
            // Draw moving item
            this.ctx.fillStyle = '#ffc107';
            this.ctx.fillRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                currentY,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                currentY,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                value,
                this.canvas.width / 2,
                currentY + this.itemHeight / 2
            );
            
            await sleep(this.animationSpeed / 20);
        }

        this.items.push(value);
        this.draw();
        
        showAlert(`Pushed ${value} to stack`, 'success');
    }

    async pop() {
        if (this.items.length === 0) {
            showAlert('Stack underflow!', 'danger');
            return;
        }

        const value = this.items[this.items.length - 1];
        
        // Highlight top item
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.canvas.width / 2 - this.itemWidth / 2,
            this.canvas.height - 20 - this.items.length * this.itemHeight,
            this.itemWidth,
            this.itemHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Animate pop operation
        const startY = this.canvas.height - 20 - this.items.length * this.itemHeight;
        const endY = this.canvas.height + 50;
        
        for (let i = 0; i <= 20; i++) {
            const currentY = startY + (i / 20) * (endY - startY);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
            
            // Draw moving item
            this.ctx.fillStyle = '#dc3545';
            this.ctx.fillRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                currentY,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                this.canvas.width / 2 - this.itemWidth / 2,
                currentY,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                value,
                this.canvas.width / 2,
                currentY + this.itemHeight / 2
            );
            
            await sleep(this.animationSpeed / 20);
        }

        this.items.pop();
        this.draw();
        
        showAlert(`Popped ${value} from stack`, 'success');
    }

    async peek() {
        if (this.items.length === 0) {
            showAlert('Stack is empty!', 'danger');
            return;
        }

        const value = this.items[this.items.length - 1];
        
        // Highlight top item
        this.ctx.save();
        this.ctx.fillStyle = '#17a2b8';
        this.ctx.fillRect(
            this.canvas.width / 2 - this.itemWidth / 2,
            this.canvas.height - 20 - this.items.length * this.itemHeight,
            this.itemWidth,
            this.itemHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);
        this.draw();
        
        showAlert(`Peeked: ${value}`, 'info');
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw stack container
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            this.canvas.width / 2 - this.itemWidth / 2 - 5,
            20,
            this.itemWidth + 10,
            this.canvas.height - 40
        );

        // Draw stack items
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

        // Draw top pointer
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

        // Draw stack info
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