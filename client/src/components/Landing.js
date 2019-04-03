import React from 'react'
import {Container, Header, Button, Grid} from 'semantic-ui-react'
import { Link } from "react-router-dom";
import { AuthConsumer, } from '../providers/AuthProvider';

const Landing = () => {
  document.body.style = 'background: #6D55A3;'
  return (
    <AuthConsumer>
      { auth => (
        <Container>
        <Header
          as='h1'
          content='Welcome to Query'
          inverted
          textAlign= 'center'
          style={{
            fontSize: '100px',
            fontWeight: 'normal',
            marginBottom: 0,
            marginTop: '15px',
          }}
        />
        { auth.authenticated ? 
        <Header inverted as="h3" textAlign="center">You are signed in as {auth.user.email}</Header>
        : 
        <Grid>
          <Grid.Column textAlign="center">
            <Button.Group size="massive">
              <Button as={Link} inverted color="white" to="/login">Log in</Button>
              <Button.Or />
              <Button as={Link} inverted color="white" to="/register">Register</Button>
            </Button.Group>
          </Grid.Column>
        </Grid>
        }
        </Container>
      )}
    </AuthConsumer>
  )
}

export default Landing;

