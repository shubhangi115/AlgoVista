// Trie Visualization
class Trie {
    constructor() {
        this.canvas = document.getElementById('trieCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.root = { children: {}, isEnd: false, x: 0, y: 0 };
        this.nodeRadius = 20;
        this.levelHeight = 60;
        this.animationSpeed = 500;
        this.words = ['cat', 'car', 'dog', 'dot', 'can', 'cap'];
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.root = { children: {}, isEnd: false, x: 0, y: 0 };
        this.draw();
    }

    async insert() {
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        let current = this.root;
        
        // Animate insertion
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            if (!current.children[char]) {
                current.children[char] = { children: {}, isEnd: false, x: 0, y: 0 };
            }
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#ffc107';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
            
            current = current.children[char];
        }
        
        current.isEnd = true;
        this.repositionNodes();
        this.draw();
        
        showAlert(`Inserted word: "${word}"`, 'success');
    }

    async search() {
        if (Object.keys(this.root.children).length === 0) {
            showAlert('Trie is empty!', 'danger');
            return;
        }

        // Find a random word to search for
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        let current = this.root;
        let found = true;
        
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            if (!current.children[char]) {
                found = false;
                break;
            }
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#17a2b8';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
            
            current = current.children[char];
        }
        
        if (found && current.isEnd) {
            // Highlight end node
            this.ctx.save();
            this.ctx.fillStyle = '#28a745';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            
            showAlert(`Found word: "${word}"`, 'success');
        } else {
            showAlert(`Word "${word}" not found`, 'danger');
        }
    }

    async prefix() {
        if (Object.keys(this.root.children).length === 0) {
            showAlert('Trie is empty!', 'danger');
            return;
        }

        // Find a random prefix to search for
        const prefix = this.words[Math.floor(Math.random() * this.words.length)].substring(0, 2);
        let current = this.root;
        let found = true;
        
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            
            if (!current.children[char]) {
                found = false;
                break;
            }
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#ffc107';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
            
            current = current.children[char];
        }
        
        if (found) {
            // Highlight all words with this prefix
            await this.highlightPrefixWords(current, prefix);
            showAlert(`Found words with prefix: "${prefix}"`, 'success');
        } else {
            showAlert(`No words found with prefix: "${prefix}"`, 'danger');
        }
    }

    async highlightPrefixWords(node, prefix) {
        if (node.isEnd) {
            this.ctx.save();
            this.ctx.fillStyle = '#28a745';
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);
        }
        
        for (const char in node.children) {
            await this.highlightPrefixWords(node.children[char], prefix + char);
        }
    }

    repositionNodes() {
        const levels = this.getLevels();
        
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
        const queue = [{ node: this.root, level: 0 }];
        
        while (queue.length > 0) {
            const { node, level } = queue.shift();
            
            if (!levels[level]) {
                levels[level] = [];
            }
            levels[level].push(node);
            
            for (const char in node.children) {
                queue.push({ node: node.children[char], level: level + 1 });
            }
        }
        
        return levels;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (Object.keys(this.root.children).length === 0) return;

        // Draw edges first
        this.drawEdges(this.root);
        
        // Draw nodes
        this.drawNodes(this.root);
    }

    drawEdges(node) {
        for (const char in node.children) {
            const child = node.children[char];
            
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(node.x, node.y + this.nodeRadius);
            this.ctx.lineTo(child.x, child.y - this.nodeRadius);
            this.ctx.stroke();
            
            // Draw character on edge
            const midX = (node.x + child.x) / 2;
            const midY = (node.y + child.y) / 2;
            
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(midX - 8, midY - 8, 16, 16);
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(midX - 8, midY - 8, 16, 16);
            
            this.ctx.fillStyle = '#333';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(char, midX, midY);
            
            this.drawEdges(child);
        }
    }

    drawNodes(node) {
        // Draw node
        this.ctx.fillStyle = node.isEnd ? '#28a745' : getRandomColor();
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw node border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw node content
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.isEnd ? '★' : '•', node.x, node.y);
        
        // Recursively draw child nodes
        for (const char in node.children) {
            this.drawNodes(node.children[char]);
        }
    }
}

// Initialize Trie
const trie = new Trie(); 