import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSuccess,
  resetErrorMessage,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../components/Auth";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    if (!navigator.onLine) {
      dispatch(signInFailure({ error: "Network Error" }));
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/user/signin",
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      dispatch(signInSuccess(response.data.user));
      navigate("/");
    } catch (error) {
      const err = error.response.data;
      dispatch(signInFailure(err));
    }
  };
  useEffect(() => {
    dispatch(resetErrorMessage());
  }, []);
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="font-semibold text-2xl text-center my-9">SignIn</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 ">
        <input
          type="email"
          id="email"
          placeholder="Email"
          className="bg-slate-200 rounded-lg p-2 text-[15px]"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          id="password"
          placeholder="Password"
          className="bg-slate-200 rounded-lg p-2 text-[15px]"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className="bg-slate-700 text-[14px] text-white uppercase p-2 rounded-lg hover:bg-slate-800 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <Auth />
      </form>
      <div className="flex gap-2 items-center  my-3">
        <p className="text-[15px] max-2-">Don't have an account?</p>
        <NavLink to="/signup">
          <span className="text-[15px] text-blue-500 cursor-pointer">
            Sign Up
          </span>
        </NavLink>
      </div>
      <p className="text-red-500 text-[16px] ">
        {error ? error.error || "Something went wrong!!!" : ""}
      </p>
    </div>
  );
};

export default SignIn;
