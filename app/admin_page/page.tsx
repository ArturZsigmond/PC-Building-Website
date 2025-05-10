"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login_page?admin=true");
      return;
    }

    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));

    if (decoded.role !== "ADMIN") {
      alert("Unauthorized");
      router.push("/login_page");
      return;
    }

    fetch("http://localhost:4000/api/monitored", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load monitored users");
        const data = await res.json();
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch monitored users.");
      });
  }, []);

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl mb-6 text-purple-400">Monitored Users</h1>
      {error && <p className="text-red-500">{error}</p>}
      {users.length === 0 ? (
        <p className="text-gray-400">No suspicious activity detected.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li key={user.id} className="bg-gray-800 p-4 rounded">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Reason:</strong> {user.reason}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
