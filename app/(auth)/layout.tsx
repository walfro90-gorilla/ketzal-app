const AuthLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>
) => {


    return (
        <div className="container flex justify-center items-center min-h-screen">
            {children}
        </div>
    )
}

export default AuthLayout
