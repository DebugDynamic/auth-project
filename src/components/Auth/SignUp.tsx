"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { validateEmail } from "@/data/utils/validateEmail";
import Loader from "@/data/utils/oldLoader";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email address.");
    }

    setLoader(true);

    if (!validateEmail(email) || !firstName) {
      setLoader(false);
      return toast.error("Please enter a valid email address and name");
    } else {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email }),
      });
      if (res.ok) {
        setLoader(false);
        return toast.success("Email sent!")
      } else {
        setLoader(false);
        return toast.error("An error has occured!")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className={`text-4xl font-bold mb-4 dark:text-white`}>
        Sign Up for Barking
      </h1>
      <div className="mb-[22px] flex space-x-4">
        <div className="w-1/2">
          <input
            type="text"
            placeholder="First name"
            name="firstname"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          />
        </div>
        
        <div className="w-1/2">
          <input
            type="text"
            placeholder="Last name"
            name="lastname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          />
        </div>
      </div>
      <div className="mb-[22px] flex space-x-4">
        <input
              type="text"
              placeholder="Email Address"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
          />
      </div>

      <div className="mb-9">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
        >
          Sign Up<div className="mx-1" />{loader && <Loader />}
        </button>
      </div>
    </form>
  );
};

export default SignUp;

