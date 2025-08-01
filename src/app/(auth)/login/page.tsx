'use client';
import { useState } from 'react';
import {
  loginWithEmail,
  signUpWithEmail,
  signInWithGoogle,
} from '@/lib/authClient';
import { finalizeLogin } from '@/lib/finalizeLogin';
import { auth } from '@/lib/firebaseClient';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  const router = useRouter();

  const resetMessages = () => {
    setError(null);
    setInfo(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      if (mode === 'login') {
        const user = await loginWithEmail(email, password);
        await finalizeLogin(user, true);
        router.push('/');
      } else {
        await signUpWithEmail(email, password);
        setInfo(
          'Verification email sent. Please check your inbox and click the link, then press the button below.'
        );
        setAwaitingVerification(true);
      }
    } catch (e: any) {
      setError(e.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    resetMessages();
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      await finalizeLogin(user, false); // skip email verification for Google
      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const checkVerificationAndFinalize = async () => {
    resetMessages();
    setLoading(true);
    try {
      await auth.currentUser?.reload();
      await finalizeLogin(undefined, true);
      router.push('/');
    } catch (e: any) {
      setError(e.message || 'Verification check failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">{mode === 'login' ? 'Login' : 'Sign up'}</h1>
      <div className="flex gap-2 mb-4">
        <button
          className={`flex-1 py-2 rounded ${mode === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => { setMode('login'); resetMessages(); setAwaitingVerification(false); }}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 rounded ${mode === 'signup' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          onClick={() => { setMode('signup'); resetMessages(); setAwaitingVerification(false); }}
        >
          Sign up
        </button>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          {mode === 'login' ? 'Log in' : 'Create account'}
        </button>
      </form>

      <div className="my-4 flex items-center gap-2">
        <div className="flex-grow h-px bg-gray-300" />
        <div className="text-sm text-gray-500">or</div>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full py-2 border rounded flex justify-center items-center gap-2"
      >
        Continue with Google
      </button>

      {info && <div className="mt-4 p-2 bg-yellow-100 border rounded text-sm">{info}</div>}
      {error && <div className="mt-4 p-2 bg-red-100 border rounded text-sm text-red-700">{error}</div>}

      {awaitingVerification && (
        <div className="mt-4 flex flex-col gap-2">
          <button
            onClick={checkVerificationAndFinalize}
            disabled={loading}
            className="py-2 bg-blue-500 text-white rounded"
          >
            I have verified my email
          </button>
          <div className="text-xs text-gray-600">
            If you didn\'t receive it, check spam or resend from Firebase console (you can implement a resend button separately).
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-center">
        {mode === 'login' ? (
          <span>
            Don\'t have an account?{' '}
            <button className="text-blue-600 underline" onClick={() => setMode('signup')}>Sign up</button>
          </span>
        ) : (
          <span>
            Already have one?{' '}
            <button className="text-blue-600 underline" onClick={() => setMode('login')}>Log in</button>
          </span>
        )}
      </div>
    </div>
  );
}