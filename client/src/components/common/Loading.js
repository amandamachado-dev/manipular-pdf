import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = ({ message = "Carregando..." }) => {
  return (
    <div className="text-center my-5">
      <Spinner animation="border" variant="danger" />
      <p className="mt-3 text-muted">{message}</p>
    </div>
  );
};

export default Loading;
