"use client"

import Link from "next/link";
import NavBar from "../navbar/page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchFromDjango } from "@/lib/api";
import { useAuth } from "@/context/auth";

export default function UpdateUser() {
    const router = useRouter();
    const { user: currentUser, updateUser } = useAuth(); // Get updateUser from context
    const [formData, setFormData] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
        username: currentUser?.username || "",
        bio: currentUser?.bio || "",
        avatar: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('You need to log in first');
                return;
            }

            // Filter out empty fields
            const payload = Object.fromEntries(
                Object.entries(formData).filter(([_, v]) => v !== '')
            );

            const response = await fetchFromDjango('api/users/update/', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            // Update user in context and local storage
            updateUser(response);

            router.push(`/profile/${response.id}/`);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div><NavBar /></div>
            <main className="update-account layout">
                <div className="container">
                    <div className="update_account__layout__box">
                        <div className="layout__boxHeader">
                            <div className="layout__boxTitle">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        viewBox="0 0 32 32">
                                        <title>arrow-left</title>
                                        <path
                                            d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z">
                                        </path>
                                    </svg>
                                </Link>
                                <h3>Edit your profile</h3>
                            </div>
                        </div>
                        <div className="layout__body">
                            <form className="form" onSubmit={handleSubmit}>
                                <div className="form__group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form__group">
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Enter a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form__group">
                                    <label>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form__group">
                                    <label>Bio</label>
                                    <textarea
                                        name="bio"
                                        placeholder="Tell us about yourself"
                                        value={formData.bio}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form__group">
                                    <label>Profile Image</label>
                                    <input
                                        type="text"
                                        name="avatar"
                                        placeholder="Paste image URL"
                                        value={formData.avatar}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form__action">
                                    <Link className="btn btn--dark" href="/">Cancel</Link>
                                    <button 
                                        className="btn btn--main" 
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                                
                                {error && <div className="error-message">{error}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}