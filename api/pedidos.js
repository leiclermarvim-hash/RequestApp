import fs from "fs";
import path from "path";

export default async function handler(req, res) {

    // ✅ Caminho absoluto do arquivo pedidos.json
    const filePath = path.join(process.cwd(), "pedidos.json");

    try {

        // ✅ POST – salvar novo pedido (OSM pai + itens filhos)
        if (req.method === "POST") {

            const novoPedido = req.body;

            if (!novoPedido || !novoPedido.id) {
                return res.status(400).json({ error: "Pedido inválido" });
            }

            // Lê o arquivo atual
            let data = { osms: [] };

            if (fs.existsSync(filePath)) {
                const fileContent = fs.readFileSync(filePath, "utf8");
                data = JSON.parse(fileContent || '{"osms":[]}');
            }

            // Adiciona nova OSM (PAI)
            data.osms.push(novoPedido);

            // Salva novamente
            fs.writeFileSync(
                filePath,
                JSON.stringify(data, null, 2),
                "utf8"
            );

            return res.status(200).json({ ok: true });
        }

        // ✅ GET – listar pedidos (opcional, mas útil)
        if (req.method === "GET") {

            if (!fs.existsSync(filePath)) {
                return res.status(200).json({ osms: [] });
            }

            const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
            return res.status(200).json(data);
        }

        // ❌ Outros métodos não permitidos
        return res.status(405).json({ error: "Método não permitido" });

    } catch (error) {
        console.error("Erro API pedidos:", error);
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
}
