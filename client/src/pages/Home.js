import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ToolCard from '../components/tools/ToolCard';
import { FileText, Scissors, Minimize, RotateCw, Image } from 'lucide-react';

const Home = () => {
  const tools = [
    {
      icon: FileText,
      title: "Juntar PDF",
      description: "Mesclar e juntar PDFs e colocá-los em qualquer ordem que desejar.",
      href: "/juntar"
    },
    {
      icon: Scissors,
      title: "Dividir PDF",
      description: "Separar uma página, ou converter cada página do documento em arquivo PDF independente.",
      href: "/dividir"
    },
    {
      icon: Minimize,
      title: "Comprimir PDF",
      description: "Reduzir o tamanho do seu arquivo PDF, mantendo a melhor qualidade possível.",
      href: "/comprimir"
    },
    {
      icon: RotateCw,
      title: "Rotacionar PDF",
      description: "Rotacionar suas páginas PDF. Rotacionar múltiplas páginas ou apenas algumas páginas.",
      href: "/rotacionar"
    },
    {
      icon: Image,
      title: "JPG para PDF",
      description: "Converter suas imagens JPG para PDF com ajuste perfeito e melhor qualidade.",
      href: "/jpg-para-pdf"
    }
  ];

  return (
    <div>
      <div className="bg-light py-5">
        <Container>
          <div className="text-center">
            <h1 className="display-4 mb-4">Ferramentas online para os amantes de PDF</h1>
            <p className="lead text-muted">
              Ferramenta online e completamente gratuita para juntar PDF, dividir PDF, comprimir PDF,<br />
              converter documentos para PDF e JPG para PDF. Não requer instalação.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-5">
        <Row>
          {tools.map((tool, index) => (
            <Col md={6} lg={4} className="mb-4" key={index}>
              <a href={tool.href} className="text-decoration-none">
                <ToolCard {...tool} />
              </a>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
