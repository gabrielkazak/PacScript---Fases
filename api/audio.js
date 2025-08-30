import OpenAI from "openai";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  try {
    const form = formidable({
      keepExtensions: true,
      multiples: false
    });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Erro ao parsear áudio:", err);
        return res.status(500).json({ error: "Falha ao processar áudio" });
      }

      const filePath = files.file[0].filepath;

      const transcription = await client.audio.transcriptions.create({
          file: fs.createReadStream(filePath, { encoding: null }),
          model: "whisper-1",
        });


      res.status(200).json({ text: transcription.text });
    });
  } catch (error) {
    console.error("Erro no Whisper:", error);
    res.status(500).json({ error: "Erro interno" });
  }
}
