// LoginPage.js
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
       const us="mikhanikh";
       const ps="NIKHILNIKH.@06";
       if(username == us && password == ps){
        navigate('/Homepage');
       }
        else {
        alert("wrong user");
       }
        // Handle the login logic here (e.g., make an API call)
       
    };

    return (
        <Container className="mt-5"  >
            <Row >
                <Col md={{ span: 6, offset: 3 }}>
                    <Card style={{ backgroundColor: 'lightblue' }}>
                        <Card.Body>
                            <Card.Title className="text-center mb-4">Cross Fit</Card.Title> {/* This is the title of the card */}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Enter username"
                                    />
                                </Form.Group>
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Password"
                                    />
                                </Form.Group>
                                <br />
                                <div className="d-flex justify-content-center">
                                <Button variant="success" type="submit" block >
                                    Enter
                                </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginPage;
