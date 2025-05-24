import { fetchFromDjango } from "@/lib/api";
import Link from "next/link";

// Types Declaration
    type Message = {
        id: string | number;
        name: string;
        user: {id: number, avatar: string, username: string};
        created: string;
        room: {name: string, id: number};
        body: string;
    };

    type ProfileComponentProps = {
        params: { msgId: string | number }; 
    };

export default async function Delete({ params }: ProfileComponentProps) {
    const {msgId} = await params;
    
    const message = await fetchFromDjango(`api/messages/${msgId}/`);

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
                        <form className="form" action="">

                            <div className="form__group">
                                <p>Are you sure you want to delete "{message.body}" ?</p>
                            </div>

                            <div className="for__group">
                                <input className="btn btn--main" type="submit" value="Confirm" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}