// Graph Visualization
class Graph {
    constructor() {
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.edges = [];
        this.nodeRadius = 25;
        this.animationSpeed = 500;
        this.init();
    }

    init() {
        this.reset();
        this.draw();
    }

    reset() {
        this.nodes = [];
        this.edges = [];
        this.draw();
    }

    addNode() {
        if (this.nodes.length >= 8) {
            showAlert('Maximum 8 nodes allowed!', 'danger');
            return;
        }

        const nodeId = this.nodes.length;
        const angle = (nodeId * 2 * Math.PI) / 8;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 120;
        
        const node = {
            id: nodeId,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle),
            value: String.fromCharCode(65 + nodeId), // A, B, C, ...
            color: getRandomColor(),
            visited: false
        };

        this.nodes.push(node);
        this.draw();
        
        showAlert(`Added node ${node.value}`, 'success');
    }

    addEdge() {
        if (this.nodes.length < 2) {
            showAlert('Need at least 2 nodes to create an edge!', 'danger');
            return;
        }

        // Find two random nodes to connect
        const node1Index = Math.floor(Math.random() * this.nodes.length);
        let node2Index = Math.floor(Math.random() * this.nodes.length);
        
        // Ensure different nodes
        while (node2Index === node1Index) {
            node2Index = Math.floor(Math.random() * this.nodes.length);
        }

        const node1 = this.nodes[node1Index];
        const node2 = this.nodes[node2Index];

        // Check if edge already exists
        const edgeExists = this.edges.some(edge => 
            (edge.from === node1.id && edge.to === node2.id) ||
            (edge.from === node2.id && edge.to === node1.id)
        );

        if (edgeExists) {
            showAlert('Edge already exists!', 'warning');
            return;
        }

        this.edges.push({
            from: node1.id,
            to: node2.id,
            weight: Math.floor(Math.random() * 10) + 1
        });

        this.draw();
        
        showAlert(`Added edge ${node1.value} - ${node2.value}`, 'success');
    }

    async dfs() {
        if (this.nodes.length === 0) {
            showAlert('Graph is empty!', 'danger');
            return;
        }

        // Reset visited flags
        this.nodes.forEach(node => node.visited = false);
        
        const startNode = this.nodes[0];
        await this.dfsTraversal(startNode);
        
        showAlert('DFS traversal completed', 'info');
    }

    async dfsTraversal(node) {
        if (!node || node.visited) return;

        // Mark as visited and highlight
        node.visited = true;
        this.ctx.save();
        this.ctx.fillStyle = '#17a2b8';
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
        
        await sleep(this.animationSpeed);
        this.draw();
        await sleep(200);

        // Get adjacent nodes
        const adjacent = this.getAdjacentNodes(node);
        
        for (const adjNode of adjacent) {
            if (!adjNode.visited) {
                await this.dfsTraversal(adjNode);
            }
        }
    }

    async bfs() {
        if (this.nodes.length === 0) {
            showAlert('Graph is empty!', 'danger');
            return;
        }

        // Reset visited flags
        this.nodes.forEach(node => node.visited = false);
        
        const startNode = this.nodes[0];
        const queue = [startNode];
        startNode.visited = true;

        while (queue.length > 0) {
            const current = queue.shift();
            
            // Highlight current node
            this.ctx.save();
            this.ctx.fillStyle = '#28a745';
            this.ctx.beginPath();
            this.ctx.arc(current.x, current.y, this.nodeRadius, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.restore();
            
            await sleep(this.animationSpeed);
            this.draw();
            await sleep(200);

            // Get adjacent nodes
            const adjacent = this.getAdjacentNodes(current);
            
            for (const adjNode of adjacent) {
                if (!adjNode.visited) {
                    adjNode.visited = true;
                    queue.push(adjNode);
                }
            }
        }
        
        showAlert('BFS traversal completed', 'info');
    }

    getAdjacentNodes(node) {
        const adjacent = [];
        this.edges.forEach(edge => {
            if (edge.from === node.id) {
                const adjNode = this.nodes.find(n => n.id === edge.to);
                if (adjNode) adjacent.push(adjNode);
            } else if (edge.to === node.id) {
                const adjNode = this.nodes.find(n => n.id === edge.from);
                if (adjNode) adjacent.push(adjNode);
            }
        });
        return adjacent;
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw edges first
        this.edges.forEach(edge => {
            const fromNode = this.nodes.find(n => n.id === edge.from);
            const toNode = this.nodes.find(n => n.id === edge.to);
            
            if (fromNode && toNode) {
                this.drawEdge(fromNode, toNode, edge.weight);
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            this.drawNode(node);
        });
    }

    drawEdge(fromNode, toNode, weight) {
        // Draw edge line
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(fromNode.x, fromNode.y);
        this.ctx.lineTo(toNode.x, toNode.y);
        this.ctx.stroke();
        
        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(midX - 10, midY - 8, 20, 16);
        this.ctx.strokeStyle = '#666';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(midX - 10, midY - 8, 20, 16);
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(weight, midX, midY);
    }

    drawNode(node) {
        // Draw node
        this.ctx.fillStyle = node.visited ? '#17a2b8' : node.color;
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, this.nodeRadius, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw node border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        // Draw node label
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value, node.x, node.y);
        
        // Draw node ID
        this.ctx.fillStyle = '#666';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(node.id, node.x, node.y + this.nodeRadius + 15);
    }
}

// Initialize Graph
const graph = new Graph(); 