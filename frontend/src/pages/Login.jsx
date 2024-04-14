import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

function App() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [status, setStatus] = useState(null);

  const cookies = new Cookies();

  async function sendRequest() {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    return { response, data };
  }

  function setCookie(token) {
    cookies.set("jwt_auth", token, {
      expires: new Date(Date.now() + 604800000),
    });
  }

  useEffect(() => {
    if (status?.ok) {
      setCookie(status?.token);
      setTimeout(() => {
        window.location.href = "/";
      }, 4000);
    }
  });

  return (
    <>
      <div>
        <div className="flex items-center justify-center ">
          <div className="flex flex-col p-4 bg-gray-100:3 mt-4 w-96 rounded-md shadow-md">
            <h1 className="text-center text-2xl font-bold mb-2">Login</h1>
            {status?.ok ? (
              <p className="text-green-600 text-center mb-2">{status?.data}</p>
            ) : (
              <p className="text-red-600 text-center mb-2">{status?.error}</p>
            )}
            <input
              type="email"
              placeholder="Email"
              className="mb-2 bg-gray-100 p-2 text-black placeholder-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none rounded-md shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="mb-2 bg-gray-100 p-2 text-black placeholder-black focus:border-black focus:ring-1 focus:ring-black focus:outline-none rounded-md shadow-sm"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={async () => {
                try {
                  let res = await sendRequest();

                  console.log(res);
                  if (res.data.status === "success") {
                    setStatus({
                      ok: true,
                      data: res.data.message,
                      token: res.data.token,
                    });
                  } else {
                    setStatus({ error: res.data.message });
                  }
                } catch (error) {
                  console.error("Failed to send request:", error);
                }
              }}
              className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>

            <div className="text-center mt-2">
              Don't have an account?{" "}
              <a href="/register" className="text-blue-500 underline">
                Register
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
