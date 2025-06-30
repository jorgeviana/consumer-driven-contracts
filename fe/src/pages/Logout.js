'use client'

import { useUser } from '../context/UserContext';

export default function Login() {
  const { setUser } = useUser();

  const handleSubmit = async (e) => {
    setUser(null);
  };

  return (
    <button className="px-4 py-2 rounded border cursor-pointer" onClick={handleSubmit}>
      Logout
    </button>
  );
}
