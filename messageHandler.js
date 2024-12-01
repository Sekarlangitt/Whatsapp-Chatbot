const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const PREDEFINED_RESPONSES = {
    halo: "Hallo, nama saya UniSky! Apa yang bisa saya bantu?",
    "!ping": "Pong! 🏫",
    "!help": `Selamat datang di President University Bot! 🎓
Berikut adalah beberapa topik yang bisa kamu tanyakan:
- !programs : Program studi di President University
- !admission : Cara pendaftaran mahasiswa
- !campus : Fasilitas kampus
- !events : Kegiatan dan acara kampus
- !faculty : Daftar fakultas dan dosen

Kirimkan pertanyaan apapun tentang President University!`,
};

const UNI_SYSTEM_PROMPT = `
Kamu adalah UniSky, asisten digital dan admin dari President University. Kamu memiliki pengetahuan tentang berbagai aspek universitas, termasuk:
- Program studi yang tersedia
- Prosedur pendaftaran dan penerimaan mahasiswa
- Fasilitas kampus seperti gedung, ruang kelas, laboratorium, dll.
- Kegiatan dan acara kampus yang akan datang
- Daftar fakultas dan dosen yang mengajar
- Sejarah dan informasi penting tentang President University

Karakteristik komunikasi:
- Gunakan bahasa Indonesia yang ramah dan profesional
- Berikan informasi yang relevan, jelas, dan singkat
- Jawab hanya yang kamu tahu dan hindari spekulasi
- Tanyakan jika ada kebutuhan lebih spesifik untuk memberi jawaban yang lebih tepat
- Hindari penggunaan emoticon berlebihan
`;

const handleMessage = async (msg) => {
    try {
        const messageText = msg.body.toLowerCase();

        // Check for predefined commands
        for (const [command, response] of Object.entries(PREDEFINED_RESPONSES)) {
            if (messageText === command.toLowerCase()) {
                await msg.reply(response);
                return;
            }
        }

        // Echo command
        if (msg.body.startsWith("!echo ")) {
            await msg.reply(msg.body.slice(6));
            return;
        }

        // Reject media messages
        if (msg.hasMedia) {
            await msg.reply("Maaf, saya hanya melayani pesan teks tentang President University.");
            return;
        }

        // Use generative AI for complex queries
        const chat = model.startChat({
            history: [],
            generationConfig: { maxOutputTokens: 300 },
        });

        const prompt = `${UNI_SYSTEM_PROMPT}
Pertanyaan pengguna: ${msg.body}`;

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();

        await msg.reply(text);
    } catch (error) {
        console.error("Error processing message:", error);
        await msg.reply("Maaf, ada gangguan. Coba tanya lagi.");
    }
};

module.exports = { handleMessage };
