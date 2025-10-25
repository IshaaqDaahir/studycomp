'use client';

import TopicsComponent from "@/components/topics/TopicsComponent";
import Image from "next/image";
import UserFeedComponent from "@/components/user-feed/UserFeedComponent";
import { useEffect, useState } from 'react';
import { fetchFromDjango } from "@/lib/api";
import UserActivityComponent from "@/components/user-activity/UserActivityComponent";
import avatar from "../../../public/images/avatar.svg";
import EditProfileButton from "@/components/profile/EditProfileButton";

type Topic = {
    id: string | number;
    name: string;
};

type Room = {
    topic?: {name: string};
};

type User = {
    id: number;
    username: string;
    bio: string;
    avatar: string;
};

interface ProfilePageContentProps {
    userId: string | number;
}

export default function ProfilePageContent({ userId }: ProfilePageContentProps) {
    const [user, setUser] = useState<User | null>(null);
    const [topics, setTopics] = useState<Topic[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');
            
            try {
                // Fetch user data first (most important)
                const userData = await fetchFromDjango(`api/users/${userId}/`);
                setUser(userData);

                // Fetch sidebar data (less critical)
                const [topicsRes, roomsRes] = await Promise.all([
                    fetchFromDjango('api/topics/').catch(() => []),
                    fetchFromDjango('api/rooms/').catch(() => [])
                ]);

                setTopics(Array.isArray(topicsRes) ? topicsRes : []);
                setRooms(Array.isArray(roomsRes) ? roomsRes : []);
            } catch (err) {
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return (
            <main className="profile-page layout layout--3">
                <div className="container">
                    <div>
                        <TopicsComponent topics={[]} rooms={[]} loading={true} />
                    </div>
                    <div className="roomList">
                        <div className="profile">
                            <div className="profile__avatar">
                                <div className="avatar avatar--large active">
                                    <Image src={avatar} alt="Loading..." width={100} height={100} />
                                </div>
                            </div>
                            <div className="profile__info">
                                <h3>Loading...</h3>
                                <p>Loading profile...</p>
                            </div>
                            <div className="profile__about">
                                <h3>About</h3>
                                <p>Loading bio...</p>
                            </div>
                        </div>
                        <div className="roomList__header">
                            <div>
                                <h2>Loading Rooms...</h2>
                            </div>
                        </div>
                        <div><p>Loading user rooms...</p></div>
                    </div>
                    <div><p>Loading activities...</p></div>
                </div>
            </main>
        );
    }

    if (error || !user) {
        return (
            <main className="profile-page layout layout--3">
                <div className="container">
                    <div>
                        <TopicsComponent topics={topics} rooms={rooms} />
                    </div>
                    <div className="roomList">
                        <div className="profile">
                            <div className="profile__info">
                                <h3>Profile Not Found</h3>
                                <p>{error || 'User not found'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page layout layout--3">
            <div className="container">
                <div>
                    <TopicsComponent topics={topics} rooms={rooms} />
                </div>
                <div className="roomList">
                    <div className="profile">
                        <div className="profile__avatar">
                            <div className="avatar avatar--large active">
                                <Image
                                    src={user?.avatar || avatar}
                                    alt="User Avatar"
                                    width={100}
                                    height={100}
                                />
                            </div>
                        </div>
                        <div className="profile__info">
                            <h3>{user.username}</h3>
                            <p>@{user.username}</p>
                            <EditProfileButton profileUserId={userId} />
                        </div>
                        <div className="profile__about">
                            <h3>About</h3>
                            <p>{user.bio || "No bio available."}</p>
                        </div>
                    </div>
                    <div className="roomList__header">
                        <div>
                            <h2>Study Rooms Hosted by {user.username}</h2>
                        </div>
                    </div>
                    <div><UserFeedComponent currentUserId={userId} /></div>
                </div>
                <div><UserActivityComponent currentUserId={userId} /></div>
            </div>
        </main>
    );
}