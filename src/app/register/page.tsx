import Link from "next/link";

export default function Register() {
    return (
        <main className="auth layout">
            <div className="container">
                <div className="layout__box">
                <div className="layout__boxHeader">
                    <div className="layout__boxTitle">
                    <h3>Register</h3>
                    </div>
                </div>
                <div className="layout__body">
                    <h2 className="auth__tagline">Find your study partner</h2>

                    <form className="form" action="" method="POST">
                        {/* {% csrf_token %} */}

                        {/* {% for field in form %} */}
                            <div className="form__group form__group">
                            <label>Field Label</label>
                            {/* {{field}} */}
                            </div>
                        {/* {% endfor %} */}

                        <button className="btn btn--main" type="submit">
                            <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            >
                            <title>lock</title>
                            <path
                                d="M27 12h-1v-2c0-5.514-4.486-10-10-10s-10 4.486-10 10v2h-1c-0.553 0-1 0.447-1 1v18c0 0.553 0.447 1 1 1h22c0.553 0 1-0.447 1-1v-18c0-0.553-0.447-1-1-1zM8 10c0-4.411 3.589-8 8-8s8 3.589 8 8v2h-16v-2zM26 30h-20v-16h20v16z"
                            ></path>
                            <path
                                d="M15 21.694v4.306h2v-4.306c0.587-0.348 1-0.961 1-1.694 0-1.105-0.895-2-2-2s-2 0.895-2 2c0 0.732 0.413 1.345 1 1.694z"
                            ></path>
                            </svg>

                            Register
                        </button>
                    </form>

                    <div className="auth__action">
                    <p>Already signed up yet?</p>
                    <Link href="/login" className="btn btn--link">Login</Link>
                    </div>
                </div>
                </div>
            </div>
        </main>
    );
}