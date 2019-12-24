import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native';

// import { Container } from './styles';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    navigation.navigate('Home')
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      enabled={Platform.OS === 'ios'}
    >
      <TextInput
        placeholder="Digite seu email"
        autoCapitalize="none"
        autoCorrect={false}
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={handleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
