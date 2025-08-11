// backend/index.js

const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.port ? Number(process.env.port) : 3000;

// Configurações
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');
const FILE_TTL_MS = 5 * 60 * 1000;    // 5 minutos
const PROGRESS_INTERVAL_MS = 500;     // intervalo SSE em ms

// Garante existência da pasta de downloads
if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Armazena os jobs de download
const jobs = new Map();

/**
 * SSE: envia o estado de todos os jobs a cada PROGRESS_INTERVAL_MS
 */
app.get('/progress', (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.flushHeaders();

  const timer = setInterval(() => {
    const payload = {};
    for (const [id, job] of jobs.entries()) {
      payload[id] = {
        status: job.status,
        percent: job.percent,
        filename: job.filename,
        downloadUrl: job.downloadUrl
      };
    }
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, PROGRESS_INTERVAL_MS);

  req.on('close', () => clearInterval(timer));
});

/**
 * POST /download
 * Recebe { url }, extrai título com yt-dlp JSON, faz download como <título>.mp3
 */
app.post('/download', async (req, res) => {
  const { url } = req.body;
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({ error: 'URL inválida' });
  }

  const jobId = uuidv4();
  const startTime = Date.now();
  jobs.set(jobId, {
    status: 'queued',
    percent: 0,
    filename: null,
    downloadUrl: null,
    timeout: null,
    startTime
  });

  // 1) Obter título original via JSON
  let title;
  try {
    const infoProc = spawn('yt-dlp', ['-j', url], {
      env: { ...process.env, PYTHONIOENCODING: 'utf-8', LC_ALL: 'en_US.UTF-8' }
    });
    let infoData = '';
    for await (const chunk of infoProc.stdout) {
      infoData += chunk.toString('utf8');
    }
    await new Promise(resolve => infoProc.on('close', resolve));
    const meta = JSON.parse(infoData);
    title = meta.title;
  } catch (err) {
    console.error('Erro ao obter meta JSON:', err);
    jobs.get(jobId).status = 'error';
    return res.status(500).json({ error: 'Falha ao obter informações do vídeo' });
  }

  // Sanitiza nome de arquivo
  const rawName = `${title}.mp3`;
  const filename = rawName.replace(/[<>:"/\\|?*]/g, '').trim();
  const outputPath = path.join(DOWNLOAD_DIR, filename);

  // 2) Iniciar download
  const yt = spawn('yt-dlp', [
    '-x', '--audio-format', 'mp3',
    '-o', outputPath,
    url
  ], {
    env: { ...process.env, PYTHONIOENCODING: 'utf-8', LC_ALL: 'en_US.UTF-8' }
  });

  yt.stdout.setEncoding('utf8');
  yt.stdout.on('data', data => {
    const text = data.toString();
    const m = text.match(/(\d{1,3}(?:\.\d+)?)%/);
    if (m) jobs.get(jobId).percent = parseFloat(m[1]);
    jobs.get(jobId).status = 'downloading';
  });

  yt.stderr.setEncoding('utf8');
  yt.stderr.on('data', err => console.error('[yt-dlp]', err));

  yt.on('close', code => {
    const job = jobs.get(jobId);
    if (code === 0) {
      job.filename = filename;
      job.downloadUrl = `/download-file/${encodeURIComponent(filename)}`;
      job.status = 'done';
      // Agenda exclusão após TTL
      job.timeout = setTimeout(() => {
        fs.unlink(outputPath, err => {
          if (err) console.error('Erro ao apagar:', err);
        });
        jobs.delete(jobId);
      }, FILE_TTL_MS);
    } else {
      job.status = 'error';
    }
  });

  res.json({ jobId });
});

/**
 * GET /download-file/:filename
 * Força download via Content-Disposition
 */
app.get('/download-file/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(DOWNLOAD_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Arquivo não encontrado');
  }
  res.download(filePath);
});

app.listen(port, () => {
  console.log(`🚀 Backend rodando em http://localhost:${port}`);
});
