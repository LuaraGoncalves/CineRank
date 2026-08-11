export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col footer-brand">
          <h3>Reelvio</h3>
          <p>© 2025 Todos os direitos reservados.</p>
        </div>

        <div className="footer-col footer-social">
          <span>Contato</span>
          <div className="footer-links">
            <a
              href="mailto:luara.goncalvesrocha@outlook.com"
              className="footer-icon"
              aria-label="Enviar E-mail"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M22 6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6ZM20 6L12 11L4 6H20ZM20 18H4V8L12 13L20 8V18Z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/luaradev"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-icon"
              aria-label="Acessar LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-col footer-credits">
          <p>
            Desenvolvido por <strong>Luara Gonçalves</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
