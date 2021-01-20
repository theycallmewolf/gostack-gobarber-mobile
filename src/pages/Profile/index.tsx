import React, { useRef, useCallback } from 'react';
import {
  Image,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ImageEditor from "@react-native-community/image-editor";

import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from './styles';
import { useAuth } from '../../hooks/AuthContext';



interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

interface FormDataContent {
  uri: string;
  type: string;
  name: string;
}

const Profile: React.FC = () => {
  const { user, updateUser, signOut } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const emailInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const handleUpdate = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('Email obrigatório')
            .email('Adicione um email válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf(
              [Yup.ref('password'), undefined],
              'Palavra-passe tem de ser a mesma',
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('profile', formData);
        updateUser(response.data);

        Alert.alert(
          'perfil alterado com sucesso',
        )

        navigation.goBack();

      } catch (err) {
        // console.log(err);
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'erro no perfil',
          'ocorreu um erro atualizar o seu perfil. tente novamente'
        )
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(()=>{
    navigation.goBack();
  }, [navigation]);

  const handleUpdateAvatar = useCallback(() => {
    launchImageLibrary( {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
    }, (response) => {
      if(response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert('Erro na atualização da sua imagem de perfil');
        return;
      }

      // console.log(response.uri)

      ImageEditor.cropImage(response.uri, {
        offset: {
          x: 0,
          y: 0,
        },
        size: {
          width: response.width,
          height: response.height,
        },
        displaySize: {
          width: 600,
          height: 600,
        },
        resizeMode: 'cover',
      }).then(fileURI => {

        const data = new FormData();

        const file = {
          uri: fileURI,
          type: 'image/jpeg',
          name: `${user.id}.jpg`,
        };

        data.append('avatar', file);

        try{
          api.patch('users/avatar', data, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }).then(apiResponse => {
            updateUser(apiResponse.data);
          });
        } catch(err) {
          console.log(err)
        }
      });
    });
  }, [updateUser, user.id]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          contentContainerStyle={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={handleUpdateAvatar}>
              <UserAvatar source={{ uri : user.avatar_url }} />
            </UserAvatarButton>
            <View>
              <Title>O meu perfil</Title>
            </View>

            <Form initialData={user} ref={formRef} onSubmit={handleUpdate}>
              <Input
                name="name"
                icon="user"
                placeholder="nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus()
                }}
              />
              <Input
                name="email"
                icon="mail"
                placeholder="email"
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus()
                }}
              />
              <Input
                name="old_password"
                icon="lock"
                placeholder="palavra-passe atual"
                ref={oldPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                containerStyle={{ marginTop: 16 }}
                returnKeyType="next"
                onSubmitEditing={() => {
                  passwordInputRef.current?.focus()
                }}
              />
              <Input
                name="password"
                icon="lock"
                placeholder="nova palavra-passe"
                ref={passwordInputRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="next"
                onSubmitEditing={() => {
                  confirmPasswordInputRef.current?.focus()
                }}
              />
              <Input
                name="password_confirmation"
                icon="lock"
                placeholder="confirmar palavra-passe"
                ref={confirmPasswordInputRef}
                secureTextEntry
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
              <Button onPress={() => formRef.current?.submitForm()}>
                Confirmar alterações
              </Button>
              <Button onPress={signOut}>
                log out
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  )
}

export default Profile;
