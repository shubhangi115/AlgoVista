// Heap Visualization
class Heap {
    constructor() {
        this.canvas = document.getElementById('heapCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.items = [];
        this.maxItems = 31; // 5 levels: 2^5 - 1 = 31
        this.maxLevels = 5;
        this.nodeRadius = 18;
        this.levelHeight = 50;
        this.animationSpeed = 500;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('heapInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    reset() {
        this.setInfoBox('Reset: Clears the heap.');
        this.items = [];
        this.draw();
    }

    async insert() {
        this.setInfoBox('Insert: Adds a new element to the heap and maintains the heap property.');
        if (this.items.length >= this.maxItems) {
            showAlert('Heap is full!', 'danger');
            return;
        }

        const value = getRandomInt(1, 99);
        this.items.push(value);
        
        // Animate insertion
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = '#ffc107';
        this.ctx.beginPath();
        this.ctx.arc(this.getNodeX(this.items.length - 1), this.getNodeY(this.items.length - 1), this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Heapify up
        await this.heapifyUp(this.items.length - 1);
        this.draw();
        
        showAlert(`Inserted ${value}`, 'success');
    }

    async extractMax() {
        this.setInfoBox('Extract Max: Removes and returns the maximum element from the heap.');
        if (this.items.length === 0) {
            showAlert('Heap is empty!', 'danger');
            return;
        }

        const maxValue = this.items[0];
        
        // Highlight root for extraction
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.beginPath();
        this.ctx.arc(this.getNodeX(0), this.getNodeY(0), this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Move last element to root
        this.items[0] = this.items[this.items.length - 1];
        this.items.pop();

        if (this.items.length > 0) {
            await this.heapifyDown(0);
        }

        this.draw();
        
        showAlert(`Extracted max: ${maxValue}`, 'success');
    }

    async heapify() {
        this.setInfoBox('Heapify: Rearranges the heap to maintain the heap property.');
        if (this.items.length === 0) {
            showAlert('Heap is empty!', 'danger');
            return;
        }

        // Build max heap from array
        for (let i = Math.floor(this.items.length / 2) - 1; i >= 0; i--) {
            await this.heapifyDown(i);
        }
        
        showAlert('Heapify completed', 'success');
    }

    async heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            
            if (this.items[index] <= this.items[parentIndex]) {
                break;
            }
            
            // Highlight nodes being compared
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.beginPath();
            this.ctx.arc(this.getNodeX(index), this.getNodeY(index), this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.getNodeX(parentIndex), this.getNodeY(parentIndex), this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            // Swap
            [this.items[index], this.items[parentIndex]] = [this.items[parentIndex], this.items[index]];
            this.draw();
            await sleep(200);
            
            index = parentIndex;
        }
    }

    async heapifyDown(index) {
        while (true) {
            let largest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            
            if (leftChild < this.items.length && this.items[leftChild] > this.items[largest]) {
                largest = leftChild;
            }
            
            if (rightChild < this.items.length && this.items[rightChild] > this.items[largest]) {
                largest = rightChild;
            }
            
            if (largest === index) {
                break;
            }
            
            // Highlight nodes being compared
            this.ctx.save();
            this.ctx.fillStyle = '#28a745';
            this.ctx.beginPath();
            this.ctx.arc(this.getNodeX(index), this.getNodeY(index), this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(this.getNodeX(largest), this.getNodeY(largest), this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            // Swap
            [this.items[index], this.items[largest]] = [this.items[largest], this.items[index]];
            this.draw();
            await sleep(200);
            
            index = largest;
        }
    }

    getNodeX(index) {
        const level = Math.floor(Math.log2(index + 1));
        const nodesInLevel = Math.pow(2, level);
        const positionInLevel = index - Math.pow(2, level) + 1;
        const spacing = this.canvas.width / (nodesInLevel + 1);
        return spacing * (positionInLevel + 1);
    }

    getNodeY(index) {
        const level = Math.floor(Math.log2(index + 1));
        if (level >= this.maxLevels) return 50 + (this.maxLevels - 1) * this.levelHeight;
        return 50 + level * this.levelHeight;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.items.length === 0) return;

        // Draw edges first
        for (let i = 0; i < this.items.length; i++) {
            const leftChild = 2 * i + 1;
            const rightChild = 2 * i + 2;
            
            if (leftChild < this.items.length) {
                this.drawEdge(i, leftChild);
            }
            if (rightChild < this.items.length) {
                this.drawEdge(i, rightChild);
            }
        }
        
        // Draw nodes
        for (let i = 0; i < this.items.length; i++) {
            this.drawNode(i);
        }
    }

    drawEdge(parentIndex, childIndex) {
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.getNodeX(parentIndex), this.getNodeY(parentIndex) + this.nodeRadius);
        this.ctx.lineTo(this.getNodeX(childIndex), this.getNodeY(childIndex) - this.nodeRadius);
        this.ctx.stroke();
    }

    drawNode(index) {
        const x = this.getNodeX(index);
        const y = this.getNodeY(index);
        
        // Draw node
        this.ctx.fillStyle = getRandomColor();
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw node border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw value
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.items[index], x, y);
        
        // Highlight root
        if (index === 0) {
            this.ctx.fillStyle = '#28a745';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.fillText('ROOT', x, y - this.nodeRadius - 10);
        }
    }
}

// Initialize Heap
const heap = new Heap(); 