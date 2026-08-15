const ORIGENS = ['http://127.0.0.1:5500', 'https://SEU-USUARIO.github.io'];

export default {
  async fetch(req, env) {
    const origem = req.headers.get('Origin') || '';
    const cabecalhos = {
      'Access-Control-Allow-Origin': ORIGENS.includes(origem) ? origem : ORIGENS[0],
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Content-Type': 'application/json'
    };

    if (req.method === 'OPTIONS') return new Response(null, { headers: cabecalhos });

    const params = new URL(req.url).searchParams;
    const sala = (params.get('sala') || '').toUpperCase();
    const nome = (params.get('nome') || '').slice(0, 18).trim();

    // Validar aqui evita que alguém use seu Worker para abrir salas arbitrárias.
    if (!/^[A-Z]{4}$/.test(sala)) {
      return new Response(JSON.stringify({ erro: 'Código de sala inválido' }), {
        status: 400, headers: cabecalhos
      });
    }
    if (!nome) {
      return new Response(JSON.stringify({ erro: 'Nome obrigatório' }), {
        status: 400, headers: cabecalhos
      });
    }

    // A identidade precisa ser única: duas pessoas com a mesma identidade
    // derrubam uma à outra da sala.
    const identidade = nome + '-' + crypto.randomUUID().slice(0, 8);

    const agora = Math.floor(Date.now() / 1000);
    const token = await assinar(
      {
        iss: env.LIVEKIT_API_KEY,
        sub: identidade,
        name: nome,
        nbf: agora,
        exp: agora + 60 * 60 * 6,   // token vale 6 horas
        video: {
          room: sala,
          roomJoin: true,
          canPublish: true,         // pode falar
          canSubscribe: true,       // pode ouvir
          canPublishData: false
        }
      },
      env.LIVEKIT_API_SECRET
    );

    return new Response(JSON.stringify({ token, url: env.LIVEKIT_URL }), { headers: cabecalhos });
  }
};

// ————— assinatura JWT HS256 com a Web Crypto —————

function base64url(bytes) {
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function assinar(payload, segredo) {
  const enc = new TextEncoder();
  const cabecalho = base64url(enc.encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const corpo = base64url(enc.encode(JSON.stringify(payload)));
  const base = cabecalho + '.' + corpo;

  const chave = await crypto.subtle.importKey(
    'raw', enc.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const assinatura = await crypto.subtle.sign('HMAC', chave, enc.encode(base));

  return base + '.' + base64url(new Uint8Array(assinatura));
}