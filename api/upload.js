const { handleUpload } = require('@vercel/blob/client');

const ALLOWED_ORIGINS = new Set(['https://ken980217.github.io']);

function setCors(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.has(origin)) { res.setHeader('Access-Control-Allow-Origin', origin); } else { res.setHeader('Access-Control-Allow-Origin', 'https://ken980217.github.io'); }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
    setCors(req, res);
    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
    if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
    try {
          const jsonResponse = await handleUpload({
                  body: req.body,
                  request: req,
                  onBeforeGenerateToken: async (pathname) => {
                            return { allowedContentTypes: ['image/*', 'video/*'], addRandomSuffix: true, maximumSizeInBytes: 300 * 1024 * 1024 };
                  },
                  onUploadCompleted: async () => {},
          });
          res.status(200).json(jsonResponse);
    } catch (error) {
          res.status(400).json({ error: error.message || String(error) });
    }
};
