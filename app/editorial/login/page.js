"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader } from "lucide-react";
import { IBM_Plex_Mono, Poppins } from "next/font/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const poppins = Poppins({
  weight: ["600"],
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

export default function LoginPage() {
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const googleButtonRef = useRef(null);
  const router = useRouter();

  const triggerError = useCallback((message) => {
    setError(message);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 650);
  }, []);

  const handleGoogleCredential = useCallback(
    async (googleResponse) => {
      const credential = googleResponse?.credential;

      if (!credential) {
        triggerError("Google sign-in failed. Please try again.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential }),
        });

        const data = await res.json();

        if (res.ok && data?.token) {
          localStorage.setItem("token", data.token);
          router.push("/editorial/edit-hub");
          return;
        }

        triggerError(data.message || "Unable to sign in with Google.");
      } catch (err) {
        triggerError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [router, triggerError]
  );

  const initializeGoogleSignIn = useCallback(() => {
    if (!isGoogleScriptLoaded || !googleButtonRef.current) {
      return;
    }

    if (!window.google?.accounts?.id) {
      triggerError("Google sign-in is unavailable right now.");
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      triggerError("Google OAuth is not configured.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredential,
    });

    googleButtonRef.current.innerHTML = "";

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "rectangular",
      width: 360,
    });
  }, [handleGoogleCredential, isGoogleScriptLoaded, triggerError]);

  useEffect(() => {
    initializeGoogleSignIn();

    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [initializeGoogleSignIn]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white via-[#C3ECFF] to-[#9FE5FF] relative">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsGoogleScriptLoaded(true)}
      />

      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div
          className={`w-full max-w-xl p-6 md:p-12 bg-white rounded-xl shadow-lg ${
            isShaking ? "animate-shake" : ""
          }`}
        >
          <h1
            className={`${poppins.className} text-3xl md:text-4xl font-bold text-center text-blue-500 mb-8 md:mb-12`}
          >
            Welcome Back !!
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className={`${ibmPlexMono.className} text-red-500 text-sm`}>
                {error}
              </p>
            </div>
          )}

          <div className="space-y-5">
            <div ref={googleButtonRef} className="flex justify-center min-h-[44px]" />

            {loading && (
              <p
                className={`${ibmPlexMono.className} text-blue-600 text-sm flex items-center justify-center gap-2`}
              >
                <Loader className="animate-spin h-4 w-4" />
                Signing in with Google...
              </p>
            )}
          </div>
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
          0%, 100% {
            transform: translateX(0);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-4px);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
}
