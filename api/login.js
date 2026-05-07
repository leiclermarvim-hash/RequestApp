export default async function handler(req, res) {
  // Configuração de CORS para evitar que o navegador bloqueie a resposta
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { usuario, senha } = req.body;
  // Link simplificado (mais estável)
  const URL_CSV = "https://raw.githubusercontent.com/leiclermarvim-hash/RequestApp/main/configuracoes/usuarios.csv";

  try {
    const response = await fetch(URL_CSV);
    
    if (!response.ok) {
      return res.status(404).json({ error: "Arquivo CSV não encontrado no GitHub" });
    }

    const textoCsv = await response.text();

    // Divide por linhas e remove linhas totalmente vazias (evita o travamento)
    const linhas = textoCsv.split(/\r?\n/).filter(l => l.trim() !== "");
    
    const separador = textoCsv.includes(';') ? ';' : ',';
    
    const usuarios = linhas.slice(1).map(linha => {
      const valores = linha.split(separador);
      return {
        matricula: valores[0]?.trim() || "",
        senha: valores[1]?.trim() || "",
        nome: valores[2]?.trim() || "",
        perfil: valores[3]?.trim() || "",
        centro: valores[4]?.trim() || ""
      };
    });

    // Comparação rigorosa
    const userEncontrado = usuarios.find(u => 
      u.matricula === usuario?.toString().trim() && 
      u.senha === senha?.toString().trim()
    );

    if (userEncontrado) {
      return res.status(200).json({ authenticated: true, user: userEncontrado });
    } else {
      return res.status(401).json({ authenticated: false, message: "Usuário ou senha inválidos" });
    }
  } catch (error) {
    console.error("Erro na API:", error);
    return res.status(500).json({ error: "Erro interno no servidor da Vercel" });
  }
}
