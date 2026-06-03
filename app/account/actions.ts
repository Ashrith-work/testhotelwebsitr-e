"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PhoneState = { ok: boolean; message: string } | null;

// Save a phone number onto the signed-in user's profile.
export async function updatePhone(
  _prev: PhoneState,
  formData: FormData,
): Promise<PhoneState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, message: "You must be signed in." };
  }

  const phone = String(formData.get("phone") || "").trim();
  if (phone.length > 0 && phone.length < 6) {
    return { ok: false, message: "Please enter a valid phone number." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { phone: phone || null },
  });

  revalidatePath("/account");
  return { ok: true, message: "Phone number saved." };
}
