import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signInSuccess,
  signInFailure,
  resetErrorMessage,
  deleteUser,
} from "../redux/user/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef();
  const [image, setImage] = useState(undefined);
  const [isEmpty, setIsEmpty] = useState(false); // Changed default state to false
  const [imagePer, setImagePer] = useState(0); // Changed default state to 0
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [userUpdate, setUserUpdate] = useState(false);

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setIsEmpty(false); // Ensure isEmpty is set to false on input change
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());
      if (Object.keys(formData).length === 0 && image === undefined) {
        setIsEmpty(true);
        dispatch(updateUserFailure());
        dispatch(signInSuccess(currentUser));
        return;
      }
      const response = await axios.put(
        `http://localhost:3000/user/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        dispatch(updateUserSuccess(response.data.user));
        setUserUpdate(true);
        setFormData({});
      }
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  useEffect(() => {
    if (image) {
      handleUpload(image);
    }
  }, [image]);

  const handleUpload = (image) => {
    if (image) {
      const storage = getStorage();
      const storageRef = ref(storage, new Date().getTime() + image.name);
      const uploadedImage = uploadBytesResumable(storageRef, image);
      uploadedImage.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImagePer(Math.round(progress));
        },
        (error) => {
          setImageError(true); // Set imageError to true if upload fails
        },
        () => {
          getDownloadURL(uploadedImage.snapshot.ref).then((downloadURL) => {
            setFormData((prevData) => ({
              ...prevData,
              profilePicture: downloadURL,
            }));
          });
        }
      );
    }
  };

  const handleDeleteUser = async (e) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/user/delete/${currentUser._id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.status);
        dispatch(deleteUser());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/user/signout`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) dispatch(deleteUser());
      console.log("Sign Out");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="mx-auto max-w-lg ">
      <h1 className="font-semibold text-center text-3xl mt-9 my-4 ">Profile</h1>
      <form onSubmit={submitUpdate} className="flex flex-col gap-2">
        <input
          className="hidden"
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        ></input>
        <img
          className="w-20 h-20 rounded-full self-center mb-3 cursor-pointer"
          src={formData.profilePicture || currentUser.profilePicture}
          onClick={() => fileRef.current.click()}
          alt="Profile" // Added alt attribute for accessibility
        ></img>
        <p className="text-sm self-center">
          {imageError ? (
            <span className="text-red-800">
              Error Uploading Image (Image size must be less than 2mb)
            </span>
          ) : imagePer > 0 && imagePer < 100 ? (
            <span className="text-slate-500">Uploading: {imagePer}%</span>
          ) : imagePer === 100 ? (
            <span className="text-green-600">
              Image Uploaded Successfully!!!
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          className="bg-slate-200 rounded-lg p-2 text-[15px]"
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username || ""}
          onChange={handleUpdate}
        ></input>
        <input
          className="bg-slate-200 rounded-lg p-2 text-[15px]"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleUpdate}
        ></input>
        <input
          className="bg-slate-200 rounded-lg p-2 text-[15px]"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password || ""}
          onChange={handleUpdate}
        ></input>
        <button className="bg-slate-700 p-3 rounded-lg text-white uppercase">
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="mt-3 flex justify-between">
        <span
          onClick={handleDeleteUser}
          className="text-sm text-red-700 font-normal cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-sm text-red-700 font-normal cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="mt-3 ">
        {error ? (
          <span className="mt-3 text-red-500 text-sm">
            Something went wrong
          </span>
        ) : isEmpty ? (
          <span className="mt-3 text-red-500 text-sm">Fill in something</span>
        ) : userUpdate ? (
          <span className="mt-3 text-green-400 text-sm ">
            User Updated Successfully
          </span>
        ) : (
          ""
        )}
      </p>
    </div>
  );
};

export default Profile;
