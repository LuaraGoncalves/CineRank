export default function SkeletonCard() {
  return (
    <div className="movie-card" style={{ cursor: 'default', pointerEvents: 'none' }}>
      {/* Imagem (Pôster) Placeholder animada */}
      <div 
        style={{
          width: '100%',
          height: '350px',
          background: 'linear-gradient(90deg, var(--card-bg) 25%, #333 50%, var(--card-bg) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }}
      ></div>
      
      {/* Texto Placeholder */}
      <div className="movie-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div 
          style={{
            height: '20px',
            width: '80%',
            background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px'
          }}
        ></div>
        <div 
          style={{
            height: '16px',
            width: '40%',
            background: 'linear-gradient(90deg, #333 25%, #444 50%, #333 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '4px'
          }}
        ></div>
      </div>
      
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
