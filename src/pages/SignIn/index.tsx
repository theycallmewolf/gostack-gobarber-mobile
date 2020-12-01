import React from 'react';
import { Image } from 'react-native';

import { Container, Title } from './styles';

const logoImg = require('../../assets/logo.png');

const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={logoImg} />
      <Title>Insira os seus dados</Title>
    </Container>
  )
}

export default SignIn;
