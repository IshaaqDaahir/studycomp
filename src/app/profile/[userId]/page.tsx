import TopicsComponent from "@/app/topics/page";
import Image from "next/image";
import UserFeedComponent from "@/app/user-feed/page";
import ActivityComponent from "@/app/activity/page";
import Link from "next/link";
import NavBar from "../../navbar/page";
import { Suspense } from 'react';
import { fetchFromDjango } from "@/lib/api";
import UserActivityComponent from "@/app/user-activity/page";

type ProfileComponentProps = {
        params: { userId: string | number }; 
    };

export default async function Profile({ params }: ProfileComponentProps) {
    const {userId} = params;

    const user = await fetchFromDjango(`api/users/${userId}/`);

    return (
        <Suspense fallback={<div>Loading profile...</div>}>
            <div>
                <div><NavBar /></div>
                <main className="profile-page layout layout--3">
                    <div className="container">
                    {/* Topics Start */}
                    <div><TopicsComponent searchParams={{}}/></div>
                    {/* Topics End */}

                    {/* Room List Start */}
                    <div className="roomList">
                        <div className="profile">
                            <div className="profile__avatar">
                                <div className="avatar avatar--large active">
                                    <Image src={user.avatar} alt="User Avatar" width={32} height={32} />
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