import React, { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/AuthContext';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
} from './styles';
import api from '../../services/api';

interface RouteParams {
  providerID: string;
}

export interface Provider {
  id: string;
  name: string;
  avatar_url: string;
};

const CreateAppointment: React.FC = () => {

  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const { providerID } = route.params as RouteParams;

  const [ showDatePicker, setShowDatePicker ] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ providers, setProviders ] = useState<Provider[]>([]);
  const [ selectedProvider, setSelectedProvider ] = useState(providerID);

  useEffect(() => {
    api.get('providers/').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectedProvider = useCallback((provID: string) => {
    setSelectedProvider(provID);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state);
  }, []);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if(Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if(date) {
      setSelectedDate(date);
    }
  }, []);

  return (
    <Container>
      <Header>
      <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Barbeiros</HeaderTitle>
        <UserAvatar source={{uri: user.avatar_url}} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({item : provider}) => (
            <ProviderContainer
              onPress={() => { handleSelectedProvider(provider.id)}}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatar_url }}/>
              <ProviderName
                selected={provider.id === selectedProvider}
              >{provider.name}</ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha uma data</Title>
        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>Selecionar data</OpenDatePickerButtonText>
        </OpenDatePickerButton>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            display="spinner"
            value={selectedDate}
            textColor="#f4ede8"
            onChange={handleDateChange}
          />
        )}
      </Calendar>
    </Container>
  )
}

export default CreateAppointment;