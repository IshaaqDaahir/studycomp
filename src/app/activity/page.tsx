import Image from "next/image";
import avatar from "../../../public/images/avatar.svg";
import Link from "next/link";

export default function Activity() {
    return (
        <main className="layout">
            <div className="container">
                <div className="layout__box">
                    <div className="layout__boxHeader">
                    <div className="layout__boxTitle">
                        <Link href="/">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>arrow-left</title>
                                <path
                                d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z"
                                ></path>
                            </svg>
                        </Link>
                        <h3>Recent Activities</h3>
                    </div>
                    </div>

                    <div className="activities-page layout__body">

                    {/* {% for message in room_messages %} */}
                        <div className="activities__box">
                        <div className="activities__boxHeader roomListRoom__header">
                            <Link href="/profile" className="roomListRoom__author">
                                <div className="avatar avatar--small">
                                    <Image src={avatar} alt="Message User Avatar" />
                                </div>
                                <p>
                                    @UserName
                                    <span>Message created|time ago</span>
                                </p>
                            </Link>

                        {/* {% if request.user == message.user %} */}
                            <div className="roomListRoom__actions">
                            <Link href="/delete">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>remove</title>
                                <path
                                    d="M27.314 6.019l-1.333-1.333-9.98 9.981-9.981-9.981-1.333 1.333 9.981 9.981-9.981 9.98 1.333 1.333 9.981-9.98 9.98 9.98 1.333-1.333-9.98-9.98 9.98-9.981z"
                                ></path>
                                </svg>
                            </Link>
                            </div>
                        {/* {% endif %} */}
                        </div>
                        <div className="activities__boxContent">
                            <p>replied to post “<Link href="/room">Room Name</Link>”</p>
                            <div className="activities__boxRoomContent">
                                Message Body
                            </div>
                            </div>
                        </div>
                    {/* {% endfor %} */}
                    </div>
                </div>
            </div>
        </main>
    );
}