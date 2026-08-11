import { ImageResponse } from 'next/og';

export const alt = 'Reelvio - descubra filmes, séries, trailers e notícias';
export const size = {
  width: 1200,
  height: 630
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        color: '#f8fafc',
        background:
          'linear-gradient(135deg, #08111f 0%, #111827 42%, #3b1117 100%)',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          fontSize: 34,
          fontWeight: 700,
          letterSpacing: 0
        }}
      >
        <div
          style={{
            width: 58,
            height: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 14,
            background: '#ef4444',
            color: '#fff',
            fontSize: 30,
            fontWeight: 900
          }}
        >
          R
        </div>
        Reelvio
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <h1
          style={{
            maxWidth: 900,
            margin: 0,
            fontSize: 82,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: 0
          }}
        >
          Filmes, séries, trailers e notícias em um só lugar
        </h1>
        <p
          style={{
            maxWidth: 760,
            margin: 0,
            color: '#cbd5e1',
            fontSize: 32,
            lineHeight: 1.35
          }}
        >
          Descubra conteúdos, salve favoritos e teste seus conhecimentos com um
          quiz interativo.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 16,
          color: '#e5e7eb',
          fontSize: 26,
          fontWeight: 700
        }}
      >
        <span>TMDB</span>
        <span>•</span>
        <span>Next.js</span>
        <span>•</span>
        <span>Portfólio</span>
      </div>
    </div>,
    size
  );
}
