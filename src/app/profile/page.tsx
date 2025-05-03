import TopicsComponent from "@/app/topics-component/page";
import Image from "next/image";
import FeedComponent from "@/app/feed-component/page";
import ActivityComponent from "@/app/activity-component/page";
import avatar from "../../../public/images/avatar.svg";

export default function Profile() {
    return (
        <main className="profile-page layout layout--3">
            <div className="container">
            {/* Topics Start */}
            <div><TopicsComponent /></div>
            {/* Topics End */}

            {/* Room List Start */}
            <div className="roomList">
                <div className="profile">
                <div className="profile__avatar">
                    <div className="avatar avatar--large active">
                    <Image src={avatar} alt="User Avatar" />
                    </div>
                </div>
                <div className="profile__info">
                    <h3>UserName</h3>
                    <p>@UserName</p>

                    {/* {% if request.user == user %} */}
                    <a href="#" className="btn btn--main btn--pill">Edit Profile</a>
                    {/* {% endif %} */}

                </div>
                <div className="profile__about">
                    <h3>About</h3>
                    <p>
                    User BioData
                    </p>
                </div>
                </div>

                <div className="roomList__header">
                <div>
                    <h2>Study Rooms Hosted by UserName
                    </h2>
                </div>
                </div>
                <div><FeedComponent /></div>

            </div>
            {/* Room List End */}

            {/* < Activities Start */}
            <div><ActivityComponent /></div>
            {/* Activities End */}
            </div>
        </main>
    );    
}