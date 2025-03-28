"use client";
import Link from "next/link";
import { useContext } from "react";
import { Authcontext } from "../context/AuthContext";
import useAuth from "../../../hooks/useAuth";

export default function NavBar() {
  const { data, loading } = useContext(Authcontext);
  const { logout } = useAuth(); // Use hook tab r
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };
  return (
    <nav className="bg-white p-2 flex justify-between">
      <Link href="/" className="font-bold text-gray-700 text-2xl">
        {" "}
        Dine IN{" "}
      </Link>
      <div>
        {loading ? null : (
          <div className="flex">
            {data ? (
              <>
              <button
                className="bg-blue-400 text-white border p-1 px-4 rounded mr-3"
                onClick={logout}
              >
                Logout
              </button>
              <span className="bg-gray-200 text-gray-700 rounded-full p-2">
                  {getInitials(data.firstName, data.lastName)}
              </span>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="font-bold text-gray-700 text-2xl"
                >
                  {" "}
                  SignUp{" "}
                </Link>
                <Link
                  href="/login"
                  className="font-bold text-gray-700 text-2xl"
                >
                  {" "}
                  Login{" "}
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
