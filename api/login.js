export default async function handler(req, res) {
  const { usuario, senha } = req.body;
  const URL_CSV = "https://raw.githubusercontent.com/leiclermarvim/RequestApp/main/configuracoes/usuarios.csv";

  try {
    const response = await fetch(URL_CSV);
    const textoCsv = await response.text();

    // Divide o texto por linhas
    const linhas = textoCsv.split('\n');
    
    // Identifica o separador (tenta ponto e vírgula primeiro, depois vírgula)
    const separador = textoCsv.includes(';') ? ';' : ',';
    
    const usuarios = linhas.slice(1).map(linha => {
      // Divide a linha usando o separador detetado
      const valores = linha.split(separador);
      return {
        matricula: valores[0]?.trim(),
        senha: valores[1]?.trim(),
        nome: valores[2]?.trim(),
        perfil: valores[3]?.trim(),
        centro: valores[4]?.trim()
      };
    });

    // Procura o utilizador (removendo espaços em branco extras)
    const userEncontrado = usuarios.find(u => 
      u.matricula === usuario.toString().trim() && 
      u.senha === senha.toString().trim()
    );

    if (userEncontrado) {
      return res.status(200).json({ authenticated: true, user: userEncontrado });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao ler base de utilizadores" });
  }
}
