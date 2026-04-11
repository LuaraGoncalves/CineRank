export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-color)', fontWeight: 'bold' }}>Carregando conteúdo...</p>
    </div>
  );
}
