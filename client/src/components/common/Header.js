import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Heart } from 'lucide-react';

const Header = () => {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom" style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <Container>
        <Navbar.Brand href="/" className="d-flex align-items-center">
          <Heart size={24} className="me-2" style={{ color: '#e74c3c', fill: '#e74c3c' }} />
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#2c3e50' }}>
            MANIPULAR PDF
          </span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/juntar" className="fw-semibold mx-2" style={{ color: '#2c3e50' }}>JUNTAR PDF</Nav.Link>
            <Nav.Link href="/dividir" className="fw-semibold mx-2" style={{ color: '#2c3e50' }}>DIVIDIR PDF</Nav.Link>
            <Nav.Link href="/comprimir" className="fw-semibold mx-2" style={{ color: '#2c3e50' }}>COMPRIMIR PDF</Nav.Link>
            <Nav.Link href="/rotacionar" className="fw-semibold mx-2" style={{ color: '#2c3e50' }}>ROTACIONAR PDF</Nav.Link>
            <Nav.Link href="/converter" className="fw-semibold mx-2" style={{ color: '#2c3e50' }}>CONVERTER</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
