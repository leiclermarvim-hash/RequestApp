// api/login.js
export default async function handler(req, res) {
  // 1. Só permite requisições do tipo POST (envio de formulário)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { usuario, senha } = req.body;

  // 2. Variáveis de Ambiente (Configuradas no Vercel)
  // Isso evita que você escreva a senha diretamente no código
  const ADMIN_USER = process.env.AUTH_USER;
  const ADMIN_PASS = process.env.AUTH_PASS;

  // 3. Validação
  if (usuario === ADMIN_USER && senha === ADMIN_PASS) {
    // Aqui você pode retornar um token ou apenas confirmar o acesso
    return res.status(200).json({ 
      authenticated: true, 
      message: "Login realizado com sucesso!" 
    });
  } else {
    return res.status(401).json({ 
      authenticated: false, 
      message: "Usuário ou senha incorretos." 
    });
  }
}