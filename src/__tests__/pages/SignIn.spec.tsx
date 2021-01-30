import React from 'react';
import {render} from '@testing-library/react-native';
import SignIn from '../../pages/SignIn';

jest.mock('@react-navigation/native', ()=>({
  useNavigation: jest.fn()
}
));

describe('Sign in page', () => {
  it('should contains email and password inputs', () => {
    const { getByPlaceholderText } = render(<SignIn />);

    expect(getByPlaceholderText('email')).toBeTruthy();
    expect(getByPlaceholderText('palavra-passe')).toBeTruthy();
  });
});
