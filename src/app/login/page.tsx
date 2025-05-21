"use client"

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromDjango } from "@/lib/api";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await fetchFromDjango("api/login/", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // Store tokens and user data
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Force a refresh of the authentication state
      window.dispatchEvent(new Event("storage"));

      // Redirect to home page or previous page
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsLoading(false);
    }
  };

  return (
    <main className="auth layout">
      <div className="container">
        <div className="layout__box">
          <div className="layout__boxHeader">
            <div className="layout__boxTitle">
              <h3>Login</h3>
            </div>
          </div>
          <div className="layout__body">
            <h2 className="auth__tagline">Find your study companion</h2>

            {error && <div className="form__error">{error}</div>}

            <form className="form" onSubmit={handleSubmit}>
              <div className="form__group form__group">
                <label>Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form__group">
                <label>Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>

              <button
                className="btn btn--main"
                type="submit"
                disabled={isLoading}
              >
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <title>lock</title>
                  <path
                    d="M27 12h-1v-2c0-5.514-4.486-10-10-10s-10 4.486-10 10v2h-1c-0.553 0-1 0.447-1 1v18c0 0.553 0.447 1 1 1h22c0.553 0 1-0.447 1-1v-18c0-0.553-0.447-1-1-1zM8 10c0-4.411 3.589-8 8-8s8 3.589 8 8v2h-16v-2zM26 30h-20v-16h20v16z"
                  ></path>
                  <path
                    d="M15 21.694v4.306h2v-4.306c0.587-0.348 1-0.961 1-1.694 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.732 0.413 1.345 1 1.694z"
                  ></path>
                </svg>
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="auth__action">
              <p>Haven't signed up yet?</p>
              <Link href="/register" className="btn btn--link">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}