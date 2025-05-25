import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-light mt-5 py-4">
      <Container>
        <div className="text-center text-muted">
          <p>&copy; 2025 Manipular PDF. Todos os direitos reservados.</p>
          <p>Ferramenta gratuita para manipulação de arquivos PDF</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
