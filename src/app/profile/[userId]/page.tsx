import TopicsComponent from "@/components/topics/TopicsComponent";
import Image from "next/image";
import UserFeedComponent from "@/components/user-feed/UserFeedComponent";
import Link from "next/link";
import NavBar from "../../../components/navbar/NavBar";
import { Suspense } from 'react';
import { fetchFromDjango } from "@/lib/api";
import UserActivityComponent from "@/components/user-activity/UserActivityComponent";
import avatar from "../../../../public/images/avatar.svg";

export const dynamic = 'force-dynamic';

type ProfilePageProps = {
    params: Promise<{ userId: string | number }>; 
};

type Topic = {
    id: string | number;
    name: string;
};

type Room = {
    topic?: {name: string};
};

export default async function ProfilePage({ params }: ProfilePageProps) {
    const {userId} = await params;

    // Fetch user data
    const user = await fetchFromDjango(`api/users/${userId}/`);

    // Fetch topics and rooms for the sidebar
    let topics: Topic[] = [];
    let rooms: Room[] = [];
    
    try {
        [topics, rooms] = await Promise.all([
            fetchFromDjango('api/topics/').then(res => Array.isArray(res) ? res : []),
            fetchFromDjango('api/rooms/').then(res => Array.isArray(res) ? res : [])
        ]);
    } catch (error) {
        console.error("Error fetching sidebar data:", error);
    }

    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <div>
                <div><NavBar /></div>
                <main className="profile-page layout layout--3">
                    <div className="container">
                        {/* Topics Start */}
                        <div>
                            <TopicsComponent 
                                topics={topics}
                                rooms={rooms}
                            />
                        </div>
                        {/* Topics End */}

                        {/* Room List Start */}
                        <div className="roomList">
                            <div className="profile">
                                <div className="profile__avatar">
                                    <div className="avatar avatar--large active">
                                        <Image
                                            src={user?.avatar?.startsWith('https://') ? user.avatar : `${process.env.NEXT_PUBLIC_DJANGO_API_URL}${user?.avatar}` || avatar}
                                            alt="User Avatar"
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                </div>
                                <div className="profile__info">
                                    <h3>{user.username}</h3>
                                    <p>@{user.username}</p>

                                    {/* {% if request.user == user %} */}
                                    <Link href="/update-user" className="btn btn--main btn--pill">Edit Profile</Link>
                                    {/* {% endif %} */}

                                </div>
                                <div className="profile__about">
                                    <h3>About</h3>
                                    <p>
                                    {user.bio || "No bio available."}
                                    </p>
                                </div>
                            </div>

                            <div className="roomList__header">
                            <div>
                                <h2>Study Rooms Hosted by {user.username}
                                </h2>
                            </div>
                            </div>
                            <div><UserFeedComponent currentUserId={userId} /></div>

                        </div>
                        {/* Room List End */}

                        {/* < Activities Start */}
                        <div><UserActivityComponent currentUserId={userId} /></div>
                        {/* Activities End */}
                    </div>
                </main>
            </div>
        </Suspense>
    );    
}