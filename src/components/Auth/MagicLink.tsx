"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/data/utils/validateEmail";
import Loader from "@/data/utils/oldLoader";
import Link from "next/link";

const MagicLink = () => {
  const [email, setEmail] = useState("");
  const [loader, setLoader] = useState(false);
  // Temporary:
  const [loginLink, setLoginLink] = useState<string>("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email address.");
    }

    setLoader(true);

    if (!validateEmail(email)) {
      setLoader(false);
      return toast.error("Please enter a valid email address.");
    } else {
      const res = await fetch("/api/auth/magiclink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const body = await res.json()
        const ll = body.loginLink;
        setLoginLink(ll);
        setLoader(false);
        return toast.success("Success")
      } else {
        setLoader(false);
        return toast.error("An error has occured!")
      }
    }
  };

  return (
<form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
    <div className="mb-[22px]">
      <input
        type="email"
        placeholder="Email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value.toLowerCase())}
        className="w-full rounded-md border border-gray-700 bg-transparent px-5 py-3 text-base text-white outline-none transition placeholder:text-gray-500 focus:border-gray-500 focus-visible:shadow-none dark:focus:border-gray-400"
      />
    </div>
    <div className="mb-9">
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-500 bg-gray-600 px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-gray-500 dark:border-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        Send Magic Link
        <div className="mx-1" />
        {loader && <Loader />}
      </button>
      <small>This would simulate sending the magic link, but it just shows it to you</small><br /><br />
      {loginLink ? <Link href={loginLink}>Click here</Link> : ""}
    </div>
  </div>
</form>
  );
};

export default MagicLink;

