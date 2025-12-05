const fs = require('fs');

function lerFicheiro(caminho) {
    if (!fs.existsSync(caminho)) {
        return [];
    }
    try {
        const data = fs.readFileSync(caminho, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

function gravarFicheiro(caminho, array) {
    const data = JSON.stringify(array, null, 2);
    fs.writeFileSync(caminho, data, 'utf8');
}

function parseBasicAuth(header) {
    if (!header) return null;
    if (!header.startsWith('Basic ')) return null;
    const encoded = header.slice(6);
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const [username, password] = decoded.split(':');
    return { username, password };
}

// Função para autenticar usuário usando o arquivo
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const credentials = parseBasicAuth(authHeader);

    if (!credentials) {
        return res.status(401).json({ error: 'Acesso não autorizado' });
    }

    const { username, password } = credentials;
    const users = lerFicheiro('users.json'); // Caminho do arquivo de usuários

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    req.user = user;
    next();
};

module.exports = { lerFicheiro, gravarFicheiro, authenticate };
