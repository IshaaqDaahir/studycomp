"use client"

import { fetchFromDjango } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { use } from 'react'
import { useAuth } from "@/context/auth";

// Types Declaration
    type Message = {
        id: string | number;
        name: string;
        user: {id: number, avatar: string, username: string};
        created: string;
        room: {name: string, id: number};
        body: string;
    };

    type DeleteMessageComponentProps = {
        params: Promise<{ msgId: string | number }>; 
    };

export default function DeleteMessagePage({ params }: DeleteMessageComponentProps) {
    const {msgId} = use(params);
    const [message, setMessage] = useState<Message | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();
    
    // Fetch message on component mount
    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const data = await fetchFromDjango(`api/messages/${msgId}/`);
                setMessage(data);
            } catch (err) {
                setError('Failed to load message');
                console.error(err);
            }
        };
        fetchMessage();
    }, [msgId]);

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsDeleting(true);
        setError(null);

        try {
            await fetchFromDjango(`api/messages/${msgId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Redirect to the home page after successful deletion
            router.push("/");
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'status' in err && err.status === 403) {
                setError('You can only delete your own messages');
            } else {
                setError(err instanceof Error ? err.message : 'Failed to delete message');
            }
            setIsDeleting(false);
        }
    };

    if (!message) {
        return <div className="delete-item layout">Loading...</div>;
    }

    // Check if user owns the message
    if (user && message.user.id !== user.id) {
        return (
            <main className="delete-item layout">
                <div className="container">
                    <div className="layout__box">
                        <div className="layout__boxHeader">
                            <div className="layout__boxTitle">
                                <Link href="/">
                                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                        <title>arrow-left</title>
                                        <path d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"></path>
                                    </svg>
                                </Link>
                                <h3>Back</h3>
                            </div>
                        </div>
                        <div className="layout__body">
                            <p className="error-message">You can only delete your own messages.</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="delete-item layout">
            <div className="container">
                <div className="layout__box">
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
                            <h3>Back</h3>
                        </div>
                    </div>
                    <div className="layout__body">
                        <form className="form" onSubmit={handleDelete}>

                            {!error && 
                            <div>
                                <div className="form__group">
                                    <p>Are you sure you want to delete &ldquo;{message.body}&rdquo;?</p>
                                </div>

                                <div className="form__group">
                                    <button className="btn btn--main" type="submit" disabled={isDeleting}>
                                        {isDeleting ? 'Deleting...' : 'Confirm'}
                                    </button>
                                </div>
                            </div>}

                            {error && <p className="error-message">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}