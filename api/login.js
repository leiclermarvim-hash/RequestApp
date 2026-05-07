export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { usuario, senha } = req.body;

  // Estas variáveis você vai configurar lá no site da Vercel depois
  if (usuario === process.env.AUTH_USER && senha === process.env.AUTH_PASS) {
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(401).json({ authenticated: false, message: "Usuário ou senha incorretos" });
  }
}
