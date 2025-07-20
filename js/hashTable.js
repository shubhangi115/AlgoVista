// Hash Table Visualization
class HashTable {
    constructor() {
        this.canvas = document.getElementById('hashTableCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.table = new Array(10).fill(null).map(() => []);
        this.animationSpeed = 500;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.table = new Array(10).fill(null).map(() => []);
        this.draw();
    }

    hash(key) {
        return key % 10;
    }

    async insert() {
        const key = getRandomInt(1, 99);
        const value = getRandomInt(100, 999);
        const index = this.hash(key);
        
        // Check for collision
        const collision = this.table[index].length > 0;
        
        // Animate insertion
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = collision ? '#dc3545' : '#ffc107';
        this.ctx.fillRect(
            this.getSlotX(index),
            this.getSlotY(index),
            80,
            30
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Insert the key-value pair
        this.table[index].push({ key, value });
        this.draw();
        
        if (collision) {
            showAlert(`Inserted ${key}:${value} with collision at index ${index}`, 'warning');
        } else {
            showAlert(`Inserted ${key}:${value} at index ${index}`, 'success');
        }
    }

    async delete() {
        if (this.isEmpty()) {
            showAlert('Hash table is empty!', 'danger');
            return;
        }

        // Find a non-empty slot
        let index = 0;
        while (index < this.table.length && this.table[index].length === 0) {
            index++;
        }

        if (index >= this.table.length) {
            showAlert('Hash table is empty!', 'danger');
            return;
        }

        const deletedItem = this.table[index].pop();
        
        // Highlight slot for deletion
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.getSlotX(index),
            this.getSlotY(index),
            80,
            30
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);
        this.draw();
        
        showAlert(`Deleted ${deletedItem.key}:${deletedItem.value} from index ${index}`, 'success');
    }

    async search() {
        if (this.isEmpty()) {
            showAlert('Hash table is empty!', 'danger');
            return;
        }

        // Find a random key to search for
        let foundKey = null;
        let foundIndex = -1;
        
        for (let i = 0; i < this.table.length; i++) {
            if (this.table[i].length > 0) {
                foundKey = this.table[i][0].key;
                foundIndex = i;
                break;
            }
        }

        if (foundKey === null) {
            showAlert('Hash table is empty!', 'danger');
            return;
        }

        const searchIndex = this.hash(foundKey);
        
        // Highlight search
        this.ctx.save();
        this.ctx.fillStyle = '#17a2b8';
        this.ctx.fillRect(
            this.getSlotX(searchIndex),
            this.getSlotY(searchIndex),
            80,
            30
        );
        this.ctx.restore();
        
        await sleep(this.animationSpeed);
        this.draw();
        
        const found = this.table[searchIndex].find(item => item.key === foundKey);
        if (found) {
            showAlert(`Found ${foundKey}:${found.value} at index ${searchIndex}`, 'success');
        } else {
            showAlert(`Key ${foundKey} not found`, 'danger');
        }
    }

    async showCollision() {
        // Insert multiple items with same hash to demonstrate collision
        const key1 = 5;
        const key2 = 15;
        const key3 = 25;
        
        const value1 = getRandomInt(100, 999);
        const value2 = getRandomInt(100, 999);
        const value3 = getRandomInt(100, 999);
        
        // Insert first item
        this.table[5].push({ key: key1, value: value1 });
        this.draw();
        await sleep(this.animationSpeed);
        
        // Insert second item (collision)
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.getSlotX(5),
            this.getSlotY(5),
            80,
            30
        );
        this.ctx.restore();
        await sleep(this.animationSpeed);
        
        this.table[5].push({ key: key2, value: value2 });
        this.draw();
        await sleep(this.animationSpeed);
        
        // Insert third item (another collision)
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.fillRect(
            this.getSlotX(5),
            this.getSlotY(5),
            80,
            30
        );
        this.ctx.restore();
        await sleep(this.animationSpeed);
        
        this.table[5].push({ key: key3, value: value3 });
        this.draw();
        
        showAlert('Demonstrated collision handling with chaining', 'info');
    }

    isEmpty() {
        return this.table.every(slot => slot.length === 0);
    }

    getSlotX(index) {
        return 20 + (index % 5) * 100;
    }

    getSlotY(index) {
        return 50 + Math.floor(index / 5) * 80;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw hash table slots
        for (let i = 0; i < this.table.length; i++) {
            const x = this.getSlotX(i);
            const y = this.getSlotY(i);
            
            // Draw slot
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x, y, 80, 30);
            
            // Draw index
            this.ctx.fillStyle = '#666';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`[${i}]`, x + 40, y - 10);
            
            // Draw items in slot
            const items = this.table[i];
            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const itemY = y + j * 25;
                
                // Draw item background
                this.ctx.fillStyle = getRandomColor();
                this.ctx.fillRect(x + 5, itemY + 5, 70, 20);
                
                // Draw item border
                this.ctx.strokeStyle = '#333';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x + 5, itemY + 5, 70, 20);
                
                // Draw key-value pair
                this.ctx.fillStyle = '#fff';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(`${item.key}:${item.value}`, x + 40, itemY + 15);
            }
        }
        
        // Draw title
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Hash Table with Chaining', this.canvas.width / 2, 20);
        
        // Draw hash function info
        this.ctx.fillStyle = '#666';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Hash Function: h(key) = key % 10', this.canvas.width / 2, this.canvas.height - 10);
    }
}

// Initialize Hash Table
const hashTable = new HashTable(); 