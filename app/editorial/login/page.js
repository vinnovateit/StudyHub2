"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { IBM_Plex_Mono, Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['600'],
  subsets: ['latin'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/editorial/edit-hub");
      } else {
        setError(data.message || "Invalid credentials");
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 650);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 650);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-blue-100 relative">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className={`w-full max-w-xl p-6 md:p-12 bg-white rounded-xl shadow-lg ${isShaking ? 'animate-shake' : ''}`}>
          <h1 className={`${poppins.className} text-3xl md:text-4xl font-bold text-center text-blue-500 mb-8 md:mb-12`}>
            Welcome Back !!
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className={`${ibmPlexMono.className} text-red-500 text-sm`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className={`${ibmPlexMono.className} w-full pl-12 pr-4 py-3 text-base md:text-lg border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`${ibmPlexMono.className} w-full pl-12 pr-4 py-3 text-base md:text-lg border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:border-blue-500`}
                required
              />
            </div>
            <button
              type="submit"
              className={`${ibmPlexMono.className} w-full py-3 text-base md:text-lg bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors`}
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 w-24 md:w-32 pointer-events-none">
        <img 
          src="/img/side_illustration.svg"
          alt="Decorative dots pattern"
          className="w-full h-auto"
        />
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
}