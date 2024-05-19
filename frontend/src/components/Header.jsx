import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  // useEffect(() => {
  //   console.log(currentUser.profilePicture);
  // }, []);
  return (
    <div>
      <div className="bg-slate-200 ">
        <div className="flex justify-between max-w-6xl items-center p-3 mx-auto">
          <NavLink to="/">
            <h1 className="font-bold text-xl">Auth</h1>
          </NavLink>
          <ul className="flex gap-6 text-[17px] items-center">
            <NavLink to="/">
              <li>Home</li>
            </NavLink>
            <NavLink to="/about">
              <li>About</li>
            </NavLink>
            <NavLink to="/profile">
              {currentUser ? (
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={currentUser.profilePicture}
                ></img>
              ) : (
                <li>Sign In</li>
              )}
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
