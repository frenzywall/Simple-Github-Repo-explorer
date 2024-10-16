
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware for parsing JSON
app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/repositories/:owner', async (req, res) => {
    const owner = req.params.owner;
    const api_url = `https://api.github.com/users/${owner}/repos`;

    try {
        const response = await axios.get(api_url);
        const repositories = response.data.map(repo => ({
            name: repo.name,
            full_name: repo.full_name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
            created_at: repo.created_at
        }));
        
        res.json(repositories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching repositories.' });
    }
});
app.get('/files/:owner/:repo/:branch', async (req, res) => {
    const { owner, repo, branch } = req.params;
    const api_url = `https://api.github.com/repos/${owner}/${repo}/contents?ref=${branch}`;

    try {
        const response = await axios.get(api_url);
        const files = response.data
            .filter(item => item.type === 'file')
            .map(file => ({
                name: file.name,
                path: file.path,
                download_url: file.download_url,
                size: file.size
            }));

        res.json(files);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching files.' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
