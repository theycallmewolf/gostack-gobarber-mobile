import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import {
  Container,
  Title,
  Description,
  OKButton,
  OKButtonText,
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {

  const { reset } = useNavigation();
  const { params } = useRoute();

  const routeParams = params as RouteParams;

  const handleOKButtonPressed = useCallback(() =>{
    reset({
      routes: [
        { name: 'Dashboard' },
      ],
      index: 0,
    });
  }, [reset]);

  const dateFormatted = useMemo(() => {
    return format(
      routeParams.date,
      "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH:mm",
      { locale: pt },
    );
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361"/>
      <Title>Marcação efetuada</Title>
      <Description>{dateFormatted}</Description>

      <OKButton onPress={handleOKButtonPressed}>
        <OKButtonText>Ok</OKButtonText>
      </OKButton>
    </Container>
  )
}

export default AppointmentCreated;