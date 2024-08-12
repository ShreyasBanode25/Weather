import React from 'react';
import Card from 'react-bootstrap/Card';
import { Row, Col } from 'react-bootstrap';

function Cards({ data }) {
  return (
    <Row>
      {data.daily.temperature_2m_max.map((temp, index) => (
        <Col key={index} md={3} className="mb-4">
          <Card style={{ width: '18rem' }}>
            <Card.Body>
              <Card.Title>Day {index + 1}</Card.Title>
              <Card.Text>Max Temperature: {temp}°C</Card.Text>
              <Card.Text>Precipitation: {data.daily.precipitation_sum[index]} mm</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Cards;

