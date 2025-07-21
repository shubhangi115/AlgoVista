// Binary Tree Visualization
class BinaryTree {
    constructor() {
        this.canvas = document.getElementById('binaryTreeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.root = null;
        this.nodeRadius = 20;
        this.levelHeight = 60;
        this.animationSpeed = 500;
        this.maxLevels = 5;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.root = null;
        this.draw();
        this.setInfoBox('Reset: Clears the binary tree.');
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('binaryTreeInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    async insert() {
        this.setInfoBox('Insert: Adds a new node to the binary tree.');
        const value = getRandomInt(1, 99);
        const newNode = { value, left: null, right: null };
        
        if (!this.root) {
            this.root = newNode;
            this.root.x = this.canvas.width / 2;
            this.root.y = 50;
            this.draw();
            showAlert(`Inserted ${value} as root`, 'success');
            return;
        }

        if (this.getTreeLevel(this.root) >= this.maxLevels) {
            showAlert('Maximum tree depth reached (5 levels)', 'danger');
            return;
        }

        // Find insertion position
        let current = this.root;
        let parent = null;
        let isLeft = false;

        while (current) {
            parent = current;
            if (value < current.value) {
                current = current.left;
                isLeft = true;
            } else {
                current = current.right;
                isLeft = false;
            }
        }

        // Insert the new node
        if (isLeft) {
            parent.left = newNode;
        } else {
            parent.right = newNode;
        }

        this.repositionNodes();
        this.draw();
        
        showAlert(`Inserted ${value}`, 'success');
    }

    async delete() {
        this.setInfoBox('Delete: Removes a node from the binary tree.');
        if (!this.root) {
            showAlert('Tree is empty!', 'danger');
            return;
        }

        // Find a leaf node to delete
        let current = this.root;
        let parent = null;
        let isLeft = false;

        while (current.left || current.right) {
            parent = current;
            if (current.left) {
                current = current.left;
                isLeft = true;
            } else {
                current = current.right;
                isLeft = false;
            }
        }

        const deletedValue = current.value;

        // Highlight node for deletion
        this.ctx.save();
        this.ctx.fillStyle = '#dc3545';
        this.ctx.beginPath();
        this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
        
        await sleep(this.animationSpeed);

        // Remove the node
        if (parent) {
            if (isLeft) {
                parent.left = null;
            } else {
                parent.right = null;
            }
        } else {
            this.root = null;
        }

        this.repositionNodes();
        this.draw();
        
        showAlert(`Deleted ${deletedValue}`, 'success');
    }

    async inorder() {
        this.setInfoBox('Inorder: Traverses the tree in left-root-right order.');
        if (!this.root) {
            showAlert('Tree is empty!', 'danger');
            return;
        }

        await this.inorderTraversal(this.root);
        showAlert('Inorder traversal completed', 'info');
    }

    async inorderTraversal(node) {
        if (node) {
            await this.inorderTraversal(node.left);
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
            
            await this.inorderTraversal(node.right);
        }
    }

    async preorder() {
        this.setInfoBox('Preorder: Traverses the tree in root-left-right order.');
        if (!this.root) {
            showAlert('Tree is empty!', 'danger');
            return;
        }

        await this.preorderTraversal(this.root);
        showAlert('Preorder traversal completed', 'info');
    }

    async preorderTraversal(node) {
        if (node) {
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#28a745';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
            
            await this.preorderTraversal(node.left);
            await this.preorderTraversal(node.right);
        }
    }

    async postorder() {
        this.setInfoBox('Postorder: Traverses the tree in left-right-root order.');
        if (!this.root) {
            showAlert('Tree is empty!', 'danger');
            return;
        }

        await this.postorderTraversal(this.root);
        showAlert('Postorder traversal completed', 'info');
    }

    async postorderTraversal(node) {
        if (node) {
            await this.postorderTraversal(node.left);
            await this.postorderTraversal(node.right);
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#ffc107';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
        }
    }

    repositionNodes() {
        if (!this.root) return;
        
        const levels = this.getLevels();
        const maxLevel = levels.length - 1;
        
        for (let level = 0; level < levels.length; level++) {
            const nodesInLevel = levels[level];
            const y = 50 + level * this.levelHeight;
            const spacing = this.canvas.width / (nodesInLevel.length + 1);
            
            for (let i = 0; i < nodesInLevel.length; i++) {
                nodesInLevel[i].x = spacing * (i + 1);
                nodesInLevel[i].y = y;
            }
        }
    }

    getLevels() {
        const levels = [];
        if (!this.root) return levels;
        
        const queue = [{ node: this.root, level: 0 }];
        
        while (queue.length > 0) {
            const { node, level } = queue.shift();
            
            if (!levels[level]) {
                levels[level] = [];
            }
            levels[level].push(node);
            
            if (node.left) {
                queue.push({ node: node.left, level: level + 1 });
            }
            if (node.right) {
                queue.push({ node: node.right, level: level + 1 });
            }
        }
        
        return levels;
    }

    getTreeLevel(node) {
        if (!node) return 0;
        return 1 + Math.max(this.getTreeLevel(node.left), this.getTreeLevel(node.right));
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.root) return;

        // Draw edges first
        this.drawEdges(this.root);
        
        // Draw nodes
        this.drawNodes(this.root);
    }

    drawEdges(node) {
        if (!node) return;
        
        if (node.left) {
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y + this.nodeRadius);
            this.ctx.lineTo(node.left.x, node.left.y - this.nodeRadius);
            this.ctx.stroke();
            this.drawEdges(node.left);
        }
        
        if (node.right) {
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y + this.nodeRadius);
            this.ctx.lineTo(node.right.x, node.right.y - this.nodeRadius);
            this.ctx.stroke();
            this.drawEdges(node.right);
        }
    }

    drawNodes(node) {
        if (!node) return;
        
        // Draw node
        this.ctx.fillStyle = getRandomColor();
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
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
        this.ctx.fillText(node.value, node.x, node.y);
        
        // Recursively draw child nodes
        this.drawNodes(node.left);
        this.drawNodes(node.right);
    }
}

// Initialize Binary Tree
const binaryTree = new BinaryTree(); 