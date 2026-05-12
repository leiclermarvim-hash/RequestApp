import fs from "fs";
import path from "path";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    try {
        const filePath = path.join(process.cwd(), "base_pedidos.json");

        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

        data.osms.push(req.body);

        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        return res.status(200).json({ ok: true });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
