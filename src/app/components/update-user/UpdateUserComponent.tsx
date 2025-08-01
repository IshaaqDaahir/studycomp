"use client"

import Link from "next/link";
import NavBar from "@/app/navbar/page";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchFromDjango } from "@/lib/api";
import { useAuth } from "@/context/auth";
import Image from "next/image";

export default function UpdateUserComponent() {
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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('You need to log in first!');
                return;
            }

            const payload = new FormData();
            payload.append('name', formData.name);
            payload.append('email', formData.email);
            payload.append('username', formData.username);
            payload.append('bio', formData.bio);
            if (avatarFile) {
                payload.append('avatar', avatarFile);
            }

            const response = await fetchFromDjango('api/users/update/', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: payload
            });

            // Update user in context and local storage
            updateUser(response);
            router.push(`/profile/${response.id}/`);
        } catch (err: unknown) {
            if (err && typeof err === "object" && "message" in err) {
                setError((err as { message: string }).message);
            } else {
                setError("Failed to update profile");
            }
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
                                    {currentUser?.avatar && (
                                        <Image 
                                            src={`http://localhost:8000${currentUser.avatar}`}
                                            alt="Existing Image" 
                                            style={{ width: '100px', display: 'block', marginBottom: '10px' }}
                                            width={100}
                                            height={100}
                                        />
                                    )}
                                    <input
                                        type="file"
                                        name="avatar"
                                        accept="image/*"
                                        onChange={handleFileChange}
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