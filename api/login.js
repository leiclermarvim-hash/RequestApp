const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { matricula, senha } = JSON.parse(req.body);

    try {
        // Caminho para o seu CSV (ajuste conforme a árvore da imagem)
        const csvPath = path.join(process.cwd(), 'configuracoes', 'usuarios.csv');
        const csvData = fs.readFileSync(csvPath, 'utf8');

        // Quebra as linhas e ignora o cabeçalho
        const linhas = csvData.split('\n').slice(1);
        
        let usuarioEncontrado = null;

        for (let linha of linhas) {
            // matricula, senha, nome, perfil, centro
            const [u_mat, u_pass, u_nome, u_perfil, u_centro] = linha.split(',');

            if (u_mat?.trim() === matricula?.trim() && u_pass?.trim() === senha?.trim()) {
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
            res.status(401).json({ authenticated: false, message: "Credenciais inválidas" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao ler base de usuários", details: error.message });
    }
}
