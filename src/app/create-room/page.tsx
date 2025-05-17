import RoomForm from "../components/page";
import { fetchFromDjango } from "@/lib/api";

export default async function CreateRoomPage() {
  const topics = await fetchFromDjango('api/topics/');
  
  return <RoomForm topics={topics} />;
}