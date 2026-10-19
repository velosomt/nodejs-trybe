// Recebe, apenas em 127.0.0.1, o conteúdo extraído no navegador e salva em _ferramentas/raw.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 47123;
const ORIGIN = 'https://cursos.betrybe.com';
const RAW_DIR = path.join(__dirname, 'raw');
const MAX_BYTES = 5 * 1024 * 1024;

fs.mkdirSync(RAW_DIR, { recursive: true });

const setCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Private-Network', 'true');
};

http.createServer((req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') return res.writeHead(204).end();
  if (req.method !== 'POST' || req.url !== '/save') return res.writeHead(404).end();

  let size = 0;
  const chunks = [];
  req.on('data', (c) => {
    size += c.length;
    if (size > MAX_BYTES) req.destroy();
    else chunks.push(c);
  });
  req.on('end', () => {
    try {
      const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      const name = String(data.file ?? '');
      if (!/^[\w.-]+\.json$/.test(name)) throw new Error('nome inválido');
      fs.writeFileSync(path.join(RAW_DIR, name), JSON.stringify(data.payload, null, 2));
      console.log('salvo', name);
      res.writeHead(200).end('ok');
    } catch (err) {
      res.writeHead(400).end(err.message);
    }
  });
}).listen(PORT, '127.0.0.1', () => console.log(`receiver em http://127.0.0.1:${PORT}`));
