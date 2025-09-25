const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Default to index.html for root requests
    let filePath = req.url === '/' ? 'index.html' : req.url.slice(1);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File not found');
        return;
    }
    
    // Set content type based on file extension
    const ext = path.extname(filePath).slice(1);
    const contentTypes = {
        'html': 'text/html',
        'js': 'text/javascript',
        'css': 'text/css',
        'json': 'application/json'
    };
    const contentType = contentTypes[ext] || 'text/plain';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Server error');
            return;
        }
        
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});