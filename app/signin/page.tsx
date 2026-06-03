import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { site } from "@/data/site";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to Neelakurunji to book your stay or view past bookings.",
  robots: { index: false, follow: false },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string };
}) {
  // Already signed in → skip the page.
  const session = await auth();
  const callbackUrl = searchParams.callbackUrl || "/account";
  if (session?.user) redirect(callbackUrl);

  return (
    <section className="container-x flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-sm bg-white p-8 text-center shadow-sm ring-1 ring-charcoal/5 sm:p-10">
        <Link href="/" className="inline-flex flex-col items-center gap-2">
          <Image
            src="/logo.png"
            alt={`${site.shortName} logo`}
            width={160}
            height={54}
            priority
            className="h-14 w-auto"
          />
          <span className="font-serif text-lg text-maroon">{site.shortName}</span>
        </Link>

        <h1 className="mt-8 font-serif text-2xl text-charcoal">Welcome</h1>
        <span className="mx-auto mt-3 block h-[3px] w-16 rounded bg-gold" />
        <p className="mt-4 text-sm leading-relaxed text-charcoal-light">
          Sign in to book your stay or view past bookings.
        </p>

        <div className="mt-8">
          <GoogleSignInButton callbackUrl={callbackUrl} />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-charcoal-light">
          By continuing, you agree to our{" "}
          <Link href="/" className="font-semibold text-maroon hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/" className="font-semibold text-maroon hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
