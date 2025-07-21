// Array Visualization
class ArrayVisualizer {
    constructor() {
        this.canvas = document.getElementById('arrayCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.elements = [];
        this.maxElements = 6;
        this.elementWidth = 50;
        this.elementHeight = 40;
        this.animationSpeed = 500;
        this.init();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('arrayInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.setInfoBox('Reset: Clears the array and removes all elements.');
        this.elements = [];
        this.draw();
    }

    async insert() {
        this.setInfoBox('Insert: Adds a new element to the end of the array.');
        if (this.elements.length >= this.maxElements) {
            showAlert('Array is full!', 'danger');
            return;
        }

        const value = getRandomInt(1, 99);
        const index = this.elements.length;
        
        // Animate insertion
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = '#ffc107';
        this.ctx.fillRect(
            this.getElementX(index),
            this.getElementY(index),
            this.elementWidth,
            this.elementHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        this.elements.push(value);
        this.draw();
        
        showAlert(`Inserted ${value} at index ${index}`, 'success');
    }

    async delete() {
        this.setInfoBox('Delete: Removes the last element from the array.');
        if (this.elements.length === 0) {
            showAlert('Array is empty!', 'danger');
            return;
        }

        const index = this.elements.length - 1;
        const deletedValue = this.elements[index];
        
        // Highlight element for deletion
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.getElementX(index),
            this.getElementY(index),
            this.elementWidth,
            this.elementHeight
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        this.elements.pop();
        this.draw();
        
        showAlert(`Deleted ${deletedValue} from index ${index}`, 'success');
    }

    async search() {
        this.setInfoBox('Search: Finds an element in the array using linear search.');
        if (this.elements.length === 0) {
            showAlert('Array is empty!', 'danger');
            return;
        }

        const searchValue = this.elements[Math.floor(Math.random() * this.elements.length)];
        
        // Linear search animation
        for (let i = 0; i < this.elements.length; i++) {
            // Highlight current element
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.fillRect(
                this.getElementX(i),
                this.getElementY(i),
                this.elementWidth,
                this.elementHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            if (this.elements[i] === searchValue) {
                // Found! Highlight in green
                this.ctx.save();
                this.ctx.fillStyle = '#28a745';
                this.ctx.fillRect(
                    this.getElementX(i),
                    this.getElementY(i),
                    this.elementWidth,
                    this.elementHeight
                );
                this.ctx.restore();
                
                this.draw();
                await sleep(this.animationSpeed);
                
                showAlert(`Found ${searchValue} at index ${i}`, 'success');
                return;
            }
            
            this.draw();
            await sleep(200);
        }
        
        showAlert(`Value ${searchValue} not found`, 'danger');
    }

    async bubbleSort() {
        this.setInfoBox('Sort: Sorts the array using the Bubble Sort algorithm.');
        if (this.elements.length < 2) {
            showAlert('Need at least 2 elements to sort!', 'warning');
            return;
        }

        const n = this.elements.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                // Highlight elements being compared
                this.ctx.save();
                this.ctx.fillStyle = '#ffc107';
                this.ctx.fillRect(
                    this.getElementX(j),
                    this.getElementY(j),
                    this.elementWidth,
                    this.elementHeight
                );
                this.ctx.fillRect(
                    this.getElementX(j + 1),
                    this.getElementY(j + 1),
                    this.elementWidth,
                    this.elementHeight
                );
                this.ctx.restore();
                
                await sleep(this.animationSpeed);
                
                if (this.elements[j] > this.elements[j + 1]) {
                    // Swap elements
                    [this.elements[j], this.elements[j + 1]] = [this.elements[j + 1], this.elements[j]];
                    
                    // Highlight swap
                    this.ctx.save();
                    this.ctx.fillStyle = '#dc3545';
                    this.ctx.fillRect(
                        this.getElementX(j),
                        this.getElementY(j),
                        this.elementWidth,
                        this.elementHeight
                    );
                    this.ctx.fillRect(
                        this.getElementX(j + 1),
                        this.getElementY(j + 1),
                        this.elementWidth,
                        this.elementHeight
                    );
                    this.ctx.restore();
                    
                    await sleep(this.animationSpeed);
                }
                
                this.draw();
                await sleep(200);
            }
        }
        
        showAlert('Array sorted using Bubble Sort!', 'success');
    }

    async binarySearch() {
        this.setInfoBox('Binary Search: Searches for an element in a sorted array using binary search.');
        if (this.elements.length === 0) {
            showAlert('Array is empty!', 'danger');
            return;
        }

        // First sort the array if not sorted
        const sorted = [...this.elements].sort((a, b) => a - b);
        if (JSON.stringify(sorted) !== JSON.stringify(this.elements)) {
            showAlert('Array must be sorted for binary search!', 'warning');
            return;
        }

        const searchValue = this.elements[Math.floor(Math.random() * this.elements.length)];
        let left = 0;
        let right = this.elements.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            
            // Highlight middle element
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.fillRect(
                this.getElementX(mid),
                this.getElementY(mid),
                this.elementWidth,
                this.elementHeight
            );
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            
            if (this.elements[mid] === searchValue) {
                // Found! Highlight in green
                this.ctx.save();
                this.ctx.fillStyle = '#28a745';
                this.ctx.fillRect(
                    this.getElementX(mid),
                    this.getElementY(mid),
                    this.elementWidth,
                    this.elementHeight
                );
                this.ctx.restore();
                
                this.draw();
                await sleep(this.animationSpeed);
                
                showAlert(`Found ${searchValue} at index ${mid}`, 'success');
                return;
            } else if (this.elements[mid] < searchValue) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
            
            this.draw();
            await sleep(200);
        }
        
        showAlert(`Value ${searchValue} not found`, 'danger');
    }

    getElementX(index) {
        return 20 + index * (this.elementWidth + 10);
    }

    getElementY(index) {
        return this.canvas.height / 2 - this.elementHeight / 2;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw array elements
        for (let i = 0; i < this.elements.length; i++) {
            const x = this.getElementX(i);
            const y = this.getElementY(i);
            
            // Draw element background
            this.ctx.fillStyle = getRandomColor();
            this.ctx.fillRect(x, y, this.elementWidth, this.elementHeight);
            
            // Draw element border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, this.elementWidth, this.elementHeight);
            
            // Draw value
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(this.elements[i], x + this.elementWidth / 2, y + this.elementHeight / 2);
            
            // Draw index
            this.ctx.fillStyle = '#666';
            this.ctx.font = '12px Arial';
            this.ctx.fillText(`[${i}]`, x + this.elementWidth / 2, y + this.elementHeight + 15);
        }
        
        // Draw array info
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Array', this.canvas.width / 2, 20);
        
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(`Size: ${this.elements.length}/${this.maxElements}`, this.canvas.width / 2, this.canvas.height - 10);
    }
}

// Initialize Array Visualizer
const arrayVisualizer = new ArrayVisualizer(); 