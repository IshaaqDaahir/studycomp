import RoomForm from "../components/room-form/page";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomPage() {
  const topics = await fetchFromDjango('api/topics/');
  
  return <RoomForm topics={topics} />;
}