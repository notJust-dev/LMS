import { AuthView } from '@clerk/expo/native';

export default function Login() {
  return <AuthView mode="signInOrUp" />
}