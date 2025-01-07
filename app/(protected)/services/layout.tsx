
// IMPORTING AUTH
// import { auth } from "@/auth"


const ProtectedLayout = async ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>
) => {

    // AUTHENTICATION
    // const session = await auth()

    // if (session?.user?.role !== "superadmin") {
    //     return <div>
    //         You are not the superadmin authenticated
    //     </div>

    // }


    return (
        <div className="container flex justify-center items-center min-h-screen">

            {children}
        </div>
    )
}

export default ProtectedLayout
