import NavBar from "../../../components/navbar/NavBar";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

export const dynamic = 'force-dynamic';

type ProfilePageProps = {
    params: Promise<{ userId: string | number }>; 
};



export default async function ProfilePage({ params }: ProfilePageProps) {
    const {userId} = await params;

    return (
        <div>
            <NavBar />
            <ProfilePageContent userId={userId} />
        </div>
    );    
}