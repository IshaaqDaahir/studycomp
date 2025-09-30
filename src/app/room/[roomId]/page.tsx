import NavBar from "../../../components/navbar/NavBar";
import RoomPageContent from "@/components/room/RoomPageContent";

// Types Declaration
    type RoomComponentProps = {
        params: Promise<{ roomId: number | string }>;
    };

export default async function RoomPage({ params }: RoomComponentProps) {
    const { roomId } = await params;

    return (
        <div>
            <NavBar />
            <RoomPageContent roomId={roomId} />
        </div>
    )
}