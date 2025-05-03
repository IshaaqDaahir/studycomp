import Link from "next/link"

export default function RoomForm() {
    return(
        <main className="create-room layout">
            <div className="container">
                <div className="layout__box">
                    <div className="layout__boxHeader">
                    <div className="layout__boxTitle">
                        <Link href="/">
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                                <title>arrow-left</title>
                                <path
                                d="M13.723 2.286l-13.723 13.714 13.719 13.714 1.616-1.611-10.96-10.96h27.625v-2.286h-27.625l10.965-10.965-1.616-1.607z">
                                </path>
                            </svg>
                        </Link>
                        <h3>Create/Update Study Room</h3>
                    </div>
                    </div>
                    <div className="layout__body">
                    <form className="form" action="" method="POST">
                        {/* {% csrf_token %} */}

                        <div className="form__group">
                            <label>Enter a Topic</label>
                            <input type="text" value="{{room.topic.name}}" name="topic" required list="topic-list" />
                            <datalist id="topic-list">
                            <select id="room_topic">
                                {/* {% for topic in topics %} */}
                                    <option value="TopicName">Topic Name</option>
                                {/* {% endfor %} */}
                            </select>
                            </datalist>
                        </div>

                        <div className="form__group">
                            <label>Room Name</label>
                            Name
                        </div>

                        <div className="form__group">
                            <label>Room Description</label>
                            Form Description
                        </div>

                        <div className="form__action">
                        <Link className="btn btn--dark cancel-btn" href="/">Cancel</Link>
                            <button className="btn btn--main" type="submit">Submit</button>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </main>
    )
}