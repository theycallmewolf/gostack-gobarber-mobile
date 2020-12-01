import React from 'react';
import { Image } from 'react-native';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Title } from './styles';


const logoImg = require('../../assets/logo.png');

const SignIn: React.FC = () => {
  return (
    <Container>
      <Image source={logoImg} />
      <Title>Insira os seus dados</Title>

      <Input name="email" icon="mail" placeholder="email" />
      <Input name="password" icon="lock" placeholder="palavra-passe" />
      <Button onPress={() => { }}>Entrar</Button>
    </Container>
  )
}

export default SignIn;
