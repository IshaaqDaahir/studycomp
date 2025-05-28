'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFromDjango } from "@/lib/api";

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        email: '',
        password1: '',
        password2: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await fetchFromDjango('api/register/', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (response.user) {
                // Store tokens and user data
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                localStorage.setItem('user', JSON.stringify(response.user));
                
                // Redirect to home page
                router.push('/login');
            }
        } catch (error: any) {
            if (error.message && typeof error.message === 'object') {
                setErrors(error.message);
            } else {
                setErrors({ non_field_errors: [error.message || 'Registration failed'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="auth layout">
            <div className="container">
                <div className="register__layout__box">
                    <div className="layout__boxHeader">
                        <div className="layout__boxTitle">
                            <h3>Register</h3>
                        </div>
                    </div>
                    <div className="layout__body">
                        <h2 className="auth__tagline">Find your study companion</h2>

                        {errors.non_field_errors && (
                            <div className="form__error">
                                {errors.non_field_errors.join(', ')}
                            </div>
                        )}

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form__group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="e.g. Dennis Ivy"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.name && <span className="form__error-text">{errors.name.join(', ')}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="e.g. dennis_ivy"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.username && <span className="form__error-text">{errors.username.join(', ')}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="e.g. user@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                {errors.email && <span className="form__error-text">{errors.email.join(', ')}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="bio">Bio</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Tell us about yourself..."
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows={3}
                                />
                                {errors.bio && <span className="form__error-text">{errors.bio.join(', ')}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="password1">Password</label>
                                <input
                                    id="password1"
                                    name="password1"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password1}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                />
                                {errors.password1 && <span className="form__error-text">{errors.password1.join(', ')}</span>}
                            </div>

                            <div className="form__group">
                                <label htmlFor="password2">Confirm Password</label>
                                <input
                                    id="password2"
                                    name="password2"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password2}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                />
                                {errors.password2 && <span className="form__error-text">{errors.password2.join(', ')}</span>}
                            </div>

                            <button 
                                className="btn btn--main" 
                                type="submit"
                                disabled={isSubmitting}
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
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </button>
                        </form>

                        <div className="auth__action">
                            <p>Already signed up?</p>
                            <Link href="/login" className="btn btn--link">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}