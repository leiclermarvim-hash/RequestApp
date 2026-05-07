export default async function handler(req, res) {
  const { usuario, senha } = req.body;
  const URL_CSV = "https://raw.githubusercontent.com/leiclermarvim/fast-request-data/main/configuracoes/usuarios.csv";

  try {
    const response = await fetch(URL_CSV);
    const textoCsv = await response.text();

    // Converte o texto CSV em uma lista (Array) de objetos
    const linhas = textoCsv.split('\n');
    const cabecalho = linhas[0].split(',');
    
    const usuarios = linhas.slice(1).map(linha => {
      const valores = linha.split(',');
      return {
        matricula: valores[0]?.trim(),
        senha: valores[1]?.trim(),
        nome: valores[2]?.trim(),
        perfil: valores[3]?.trim(),
        centro: valores[4]?.trim()
      };
    });

    // Procura o usuário
    const userEncontrado = usuarios.find(u => u.matricula === usuario && u.senha === senha);

    if (userEncontrado) {
      return res.status(200).json({ authenticated: true, user: userEncontrado });
    } else {
      return res.status(401).json({ authenticated: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Erro ao ler base de usuários" });
  }
}
