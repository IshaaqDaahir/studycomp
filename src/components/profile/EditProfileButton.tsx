'use client';

import Link from "next/link";
import { useAuth } from "@/context/auth";
import AuthWrapper from "../AuthWrapper";

interface EditProfileButtonProps {
  profileUserId: string | number;
}

export default function EditProfileButton({ profileUserId }: EditProfileButtonProps) {
  const { user } = useAuth();

  // Only show edit button if current user owns the profile
  if (!user || user.id.toString() !== profileUserId.toString()) {
    return null;
  }

  return (
    <AuthWrapper>
      <Link href="/update-user" className="btn btn--main btn--pill">Edit Profile</Link>
    </AuthWrapper>
  );
}