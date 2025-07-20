// Linked List Visualization
class LinkedList {
    constructor() {
        this.canvas = document.getElementById('linkedListCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.head = null;
        this.nodeRadius = 25;
        this.nodeSpacing = 80;
        this.animationSpeed = 500;
        this.maxNodes = 5;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.nodes = [];
        this.head = null;
        this.draw();
    }

    async insert() {
        if (this.nodes.length >= this.maxNodes) {
            showAlert('Linked List is full!', 'danger');
            return;
        }
        const value = getRandomInt(1, 99);
        const newNode = {
            value: value,
            next: null,
            x: 50,
            y: this.canvas.height / 2,
            color: getRandomColor()
        };

        // Animate insertion
        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.fillStyle = '#ffc107';
        this.ctx.beginPath();
        this.ctx.arc(newNode.x, newNode.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();

        await sleep(this.animationSpeed);

        // Insert at beginning
        newNode.next = this.head;
        this.head = newNode;
        this.nodes.unshift(newNode);

        // Reposition nodes
        this.repositionNodes();
        this.draw();
        
        showAlert(`Inserted ${value} at the beginning`, 'success');
    }

    async delete() {
        if (!this.head) {
            showAlert('List is empty!', 'danger');
            return;
        }

        // Highlight head node for deletion
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.beginPath();
        this.ctx.arc(this.head.x, this.head.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();

        await sleep(this.animationSpeed);

        const deletedValue = this.head.value;
        this.head = this.head.next;
        this.nodes.shift();

        this.repositionNodes();
        this.draw();
        
        showAlert(`Deleted ${deletedValue} from the beginning`, 'success');
    }

    async traverse() {
        if (!this.head) {
            showAlert('List is empty!', 'danger');
            return;
        }

        let current = this.head;
        let index = 0;

        while (current) {
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();

            await sleep(this.animationSpeed);

            // Reset node color
            this.draw();
            await sleep(200);

            current = current.next;
            index++;
        }

        showAlert(`Traversed ${index} nodes`, 'info');
    }

    repositionNodes() {
        let current = this.head;
        let x = 50;
        const y = this.canvas.height / 2;

        while (current) {
            current.x = x;
            current.y = y;
            x += this.nodeSpacing;
            current = current.next;
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw nodes and connections
        let current = this.head;
        let prevNode = null;

        while (current) {
            // Draw connection to next node
            if (current.next) {
                this.ctx.strokeStyle = '#666';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(current.x + this.nodeRadius, current.y);
                this.ctx.lineTo(current.next.x - this.nodeRadius, current.next.y);
                this.ctx.stroke();

                // Draw arrow
                const angle = Math.atan2(current.next.y - current.y, current.next.x - current.x);
                this.ctx.save();
                this.ctx.translate(current.next.x - this.nodeRadius, current.next.y);
                this.ctx.rotate(angle);
                this.ctx.fillStyle = '#666';
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(-8, -4);
                this.ctx.lineTo(-8, 4);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.restore();
            }

            // Draw node
            this.ctx.fillStyle = current.color;
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();

            // Draw node border
            this.ctx.strokeStyle = '#333';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw value
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(current.value, current.x, current.y);

            prevNode = current;
            current = current.next;
        }

        // Draw head pointer
        if (this.head) {
            this.ctx.fillStyle = '#28a745';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('HEAD', this.head.x, this.head.y - this.nodeRadius - 15);
        }
    }
}

// Initialize Linked List
const linkedList = new LinkedList(); 