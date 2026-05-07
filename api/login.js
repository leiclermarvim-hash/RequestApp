export default function handler(req, res) {
  const { usuario, senha } = req.body;
  // Estes valores você define no painel da Vercel (Environment Variables)
  if (usuario === process.env.AUTH_USER && senha === process.env.AUTH_PASS) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
}
