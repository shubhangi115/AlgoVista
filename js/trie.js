// Trie Visualization
class Trie {
    constructor() {
        this.canvas = document.getElementById('trieCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.root = { children: {}, isEnd: false, x: 0, y: 0 };
        this.nodeRadius = 20;
        this.levelHeight = 60;
        this.words = ['cat', 'car', 'dog', 'dot', 'can', 'cap'];
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    setInfoBox(message) {
        const infoBox = document.getElementById('trieInfoBox');
        if (infoBox) infoBox.textContent = message;
    }

    reset() {
        this.setInfoBox('Reset: Clears the trie.');
        this.root = { children: {}, isEnd: false, x: 0, y: 0 };
        this.draw();
    }

    insert() {
        this.setInfoBox('Insert Word: Adds a new word to the trie.');
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        let current = this.root;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!current.children[char]) {
                current.children[char] = { children: {}, isEnd: false, x: 0, y: 0 };
            }
            current = current.children[char];
        }
        current.isEnd = true;
        this.repositionNodes();
        this.draw();
        showAlert(`Inserted word: "${word}"`, 'success');
    }

    search() {
        this.setInfoBox('Search Word: Searches for a word in the trie.');
        if (Object.keys(this.root.children).length === 0) {
            showAlert('Trie is empty!', 'danger');
            return;
        }
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        let current = this.root;
        let found = true;
        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            if (!current.children[char]) {
                found = false;
                break;
            }
            current = current.children[char];
        }
        if (found && current.isEnd) {
            showAlert(`Found word: "${word}"`, 'success');
        } else {
            showAlert(`Word "${word}" not found`, 'danger');
        }
    }

    prefix() {
        this.setInfoBox('Prefix Search: Finds all words in the trie that start with a given prefix.');
        if (Object.keys(this.root.children).length === 0) {
            showAlert('Trie is empty!', 'danger');
            return;
        }
        const prefix = this.words[Math.floor(Math.random() * this.words.length)].substring(0, 2);
        let current = this.root;
        let found = true;
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i];
            if (!current.children[char]) {
                found = false;
                break;
            }
            current = current.children[char];
        }
        if (found) {
            this.highlightPrefixWords(current, prefix);
            showAlert(`Found words with prefix: "${prefix}"`, 'success');
        } else {
            showAlert(`No words found with prefix: "${prefix}"`, 'danger');
        }
    }

    highlightPrefixWords(node, prefix) {
        if (node.isEnd) {
            this.draw();
        }
        for (const char in node.children) {
            this.highlightPrefixWords(node.children[char], prefix + char);
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (Object.keys(this.root.children).length === 0) return;
        this.drawEdges(this.root);
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
        this.ctx.fillStyle = node.isEnd ? '#28a745' : getRandomColor();
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.isEnd ? '\u2605' : '\u2022', node.x, node.y);
        for (const char in node.children) {
            this.drawNodes(node.children[char]);
        }
    }
}

// Initialize Trie
const trie = new Trie(); 