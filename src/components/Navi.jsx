// NavbarComponent.js
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Navi() {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            &<Navbar.Brand href="#home" >Cross Fit</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    <Link className="nav-link" to="/Homepage">Home</Link>
                    <Link className="nav-link" to="/AddGymBoy">Add Admission</Link>
                    <Link className="nav-link" to="/ViewGymBoys">View All Details</Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Navi;
