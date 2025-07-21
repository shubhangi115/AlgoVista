// Queue Visualization
class Queue {
    constructor() {
        this.canvas = document.getElementById('queueCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.maxItems = 6;
        this.itemHeight = 30;
        this.itemWidth = 60;
        this.animationSpeed = 500;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('queueInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    reset() {
        this.setInfoBox('Reset: Clears the queue.');
        this.items = [];
        this.draw();
    }

    async enqueue() {
        this.setInfoBox('Enqueue: Adds a new element to the rear of the queue.');
        if (this.items.length >= this.maxItems) {
            showAlert('Queue is full!', 'danger');
            return;
        }

        const value = getRandomInt(1, 99);
        
        // Animate enqueue operation
        const startX = this.canvas.width + 50;
        const endX = this.canvas.width - 20 - this.items.length * this.itemWidth;
        
        for (let i = 0; i <= 20; i++) {
            const currentX = startX - (i / 20) * (startX - endX);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
            
            // Draw moving item
            this.ctx.fillStyle = '#ffc107';
            this.ctx.fillRect(
                currentX,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                currentX,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                value,
                currentX + this.itemWidth / 2,
                this.canvas.height / 2
            );
            
            await sleep(this.animationSpeed / 20);
        }

        this.items.push(value);
        this.draw();
        
        showAlert(`Enqueued ${value}`, 'success');
    }

    async dequeue() {
        this.setInfoBox('Dequeue: Removes the front element from the queue.');
        if (this.items.length === 0) {
            showAlert('Queue is empty!', 'danger');
            return;
        }

        const value = this.items[0];
        
        // Highlight front item
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.canvas.width - 20 - this.items.length * this.itemWidth,
            this.canvas.height / 2 - this.itemHeight / 2,
            this.itemWidth,
            this.itemHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Animate dequeue operation
        const startX = this.canvas.width - 20 - this.items.length * this.itemWidth;
        const endX = -100;
        
        for (let i = 0; i <= 20; i++) {
            const currentX = startX - (i / 20) * (startX - endX);
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.draw();
            
            // Draw moving item
            this.ctx.fillStyle = '#dc3545';
            this.ctx.fillRect(
                currentX,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                currentX,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                value,
                currentX + this.itemWidth / 2,
                this.canvas.height / 2
            );
            
            await sleep(this.animationSpeed / 20);
        }

        this.items.shift();
        this.draw();
        
        showAlert(`Dequeued ${value}`, 'success');
    }

    async front() {
        this.setInfoBox('Front: Views the front element of the queue without removing it.');
        if (this.items.length === 0) {
            showAlert('Queue is empty!', 'danger');
            return;
        }

        const value = this.items[0];
        
        // Highlight front item
        this.ctx.save();
        this.ctx.fillStyle = '#17a2b8';
        this.ctx.fillRect(
            this.canvas.width - 20 - this.items.length * this.itemWidth,
            this.canvas.height / 2 - this.itemHeight / 2,
            this.itemWidth,
            this.itemHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);
        this.draw();
        
        showAlert(`Front element: ${value}`, 'info');
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw queue container
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(
            20,
            this.canvas.height / 2 - this.itemHeight / 2 - 5,
            this.canvas.width - 40,
            this.itemHeight + 10
        );

        // Draw queue items
        for (let i = 0; i < this.items.length; i++) {
            const x = this.canvas.width - 20 - (i + 1) * this.itemWidth;
            
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(
                x,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
                x,
                this.canvas.height / 2 - this.itemHeight / 2,
                this.itemWidth,
                this.itemHeight
            );
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(
                this.items[i],
                x + this.itemWidth / 2,
                this.canvas.height / 2
            );
        }

        // Draw front and rear pointers
        if (this.items.length > 0) {
            // Front pointer
            this.ctx.fillStyle = '#28a745';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(
                'FRONT',
                this.canvas.width - 20 - this.items.length * this.itemWidth + this.itemWidth / 2,
                this.canvas.height / 2 - this.itemHeight / 2 - 15
            );
            
            // Rear pointer
            this.ctx.fillStyle = '#dc3545';
            this.ctx.fillText(
                'REAR',
                this.canvas.width - 20 - this.itemWidth + this.itemWidth / 2,
                this.canvas.height / 2 + this.itemHeight / 2 + 15
            );
        }

        // Draw queue info
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

// Initialize Queue
const queue = new Queue(); 