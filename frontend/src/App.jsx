import { useState, useEffect } from "react";
import Cookies from "universal-cookie";

function App() {
  const [user, setUser] = useState(null);

  const cookies = new Cookies();
  const token = cookies.get("jwt_auth");

  useEffect(() => {
    async function getMe() {
      const response = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return { response, data };
    }

    getMe().then(({ data }) => {
      if (data.status == "success") {
        setUser(data.user);
      } else {
        window.location.href = "/login";
      }
    });
  }, []);

  return (
    <>
      <div>
        <div className="flex items-center justify-center ">
          {user ? (
            <div className="flex flex-col p-4 bg-gray-100:3 mt-4 w-96 rounded-md shadow-md">
              <h1 className="text-center text-2xl font-bold mb-2">
                Welcome {user.username}!
              </h1>
              <p className="text-center mb-2">Email: {user.email}</p>
            </div>
          ) : (
            <h1 className="mt-4">Loading...</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
