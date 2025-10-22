import React from 'react';
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">
          <i className="fas fa-utensils me-2"></i>
          RESTGEST
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/inventory">
              <i className="fas fa-boxes me-1"></i>
              Inventário
            </Nav.Link>
            <Nav.Link href="/students">
              <i className="fas fa-users me-1"></i>
              Alunos
            </Nav.Link>
            <Nav.Link href="/services">
              <i className="fas fa-calendar-alt me-1"></i>
              Serviços
            </Nav.Link>
          </Nav>
          <Nav>
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="dropdown-basic">
                <i className="fas fa-user me-1"></i>
                {user?.username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.ItemText>
                  <small className="text-muted">{user?.email}</small>
                </Dropdown.ItemText>
                <Dropdown.Divider />
                <Dropdown.Item onClick={logout}>
                  <i className="fas fa-sign-out-alt me-1"></i>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
