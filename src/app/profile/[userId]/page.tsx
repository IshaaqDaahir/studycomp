import TopicsComponent from "@/components/topics/TopicsComponent";
import Image from "next/image";
import UserFeedComponent from "@/components/user-feed/UserFeedComponent";
import Link from "next/link";
import NavBar from "../../../components/navbar/NavBar";
import { Suspense } from 'react';
import { fetchFromDjango } from "@/lib/api";
import UserActivityComponent from "@/components/user-activity/UserActivityComponent";

type ProfilePageProps = {
        params: Promise<{ userId: string | number }>; 
    };

export default async function ProfilePage({ params }: ProfilePageProps) {
    const {userId} = await params;

    const user = await fetchFromDjango(`api/users/${userId}/`);

    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <div>
                <div><NavBar /></div>
                <main className="profile-page layout layout--3">
                    <div className="container">
                    {/* Topics Start */}
                    <div><TopicsComponent searchParams={Promise.resolve({})}/></div>
                    {/* Topics End */}

                    {/* Room List Start */}
                    <div className="roomList">
                        <div className="profile">
                            <div className="profile__avatar">
                                <div className="avatar avatar--large active">
                                    <Image
                                        src={`http://localhost:8000${user.avatar}`}
                                        alt="Avatar"
                                        width={100}
                                        height={100}
                                        unoptimized={true} // Required for localhost in development
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