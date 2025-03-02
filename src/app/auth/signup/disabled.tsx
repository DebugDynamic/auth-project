import SignUp from "@/components/Auth/SignUp"
import Link from "next/link"
import Image from "next/image"

export default function authPage() {
    return (
        <div className="mx-[30%] mt-5">
            <div className={`p-6 flex justify-center h-screen bg-boxdark-1`}>
                <div className={`block text-center`}>
                    <Link href="/" className="flex justify-center mb-[15%] dark:hidden">
                    <Image
                        width={220}
                        height={50}
                        src={"/images/logo/logo-dark.svg"}
                        alt="Logo"
                        priority
                        />
                    </Link>
                    <Link href="/" className="hidden dark:flex justify-center mb-[15%]">
                        <Image
                        width={220}
                        height={50}
                        src={"/images/logo/logo.svg"}
                        alt="Logo"
                        priority
                        />
                    </Link>
                    <SignUp />
                </div>
            </div>
        </div>
    )
}