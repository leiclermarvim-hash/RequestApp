const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    // 1. Bloqueia métodos que não sejam POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // 2. Tratamento do corpo da requisição (Vercel pode enviar como objeto ou string)
        const corpo = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const { matricula, senha } = corpo;

        // 3. Caminho para o CSV
        const csvPath = path.join(process.cwd(), 'configuracoes', 'usuarios.csv');
        
        if (!fs.existsSync(csvPath)) {
            return res.status(500).json({ error: "Arquivo de usuários não encontrado no servidor." });
        }

        const csvData = fs.readFileSync(csvPath, 'utf8');

        // 4. Quebra as linhas e remove linhas vazias ou espaços extras
        const linhas = csvData.split(/\r?\n/).filter(line => line.trim() !== "");
        
        // Remove o cabeçalho
        const dadosUsuarios = linhas.slice(1);
        
        let usuarioEncontrado = null;

        for (let linha of dadosUsuarios) {
            // 5. AJUSTE CRÍTICO: Usando ";" como separador conforme sua base
            const [u_mat, u_pass, u_nome, u_perfil, u_centro] = linha.split(';');

            // 6. Comparação rigorosa removendo espaços em branco
            if (u_mat?.trim() === matricula?.toString().trim() && u_pass?.trim() === senha?.toString().trim()) {
                usuarioEncontrado = {
                    matricula: u_mat.trim(),
                    nome: u_nome.trim(),
                    perfil: u_perfil.trim().toLowerCase(),
                    centro: u_centro.trim()
                };
                break;
            }
        }

        if (usuarioEncontrado) {
            res.status(200).json({ authenticated: true, user: usuarioEncontrado });
        } else {
            res.status(401).json({ authenticated: false, message: "Matrícula ou senha incorretos." });
        }

    } catch (error) {
        res.status(500).json({ 
            error: "Erro no processamento do login", 
            details: error.message 
        });
    }
}
