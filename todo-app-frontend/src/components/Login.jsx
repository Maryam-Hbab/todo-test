import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios-config";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/pagination";
import "../App.css"; // Ensure the correct path

// Import required modules
import { EffectCube, Pagination } from "swiper/modules";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Side - Login */}
      <div className="w-1/2 flex flex-col items-center justify-center p-12 bg-gray-200">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-12 text-center">
            Login
          </h1>
          <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:bg-gray-50"
              >
                Login
              </button>
            </form>
          </div>
          <Link
            to="/register"
            className="block w-full py-3 px-4 bg-white border border-gray-200 rounded-xl text-center text-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out hover:bg-gray-50 mt-4"
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Right Side - Swiper Cube */}
      <div className="w-1/2 flex items-center justify-center bg-gray-900 relative">
        <Swiper
          effect={"cube"}
          grabCursor={true}
          cubeEffect={{
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          }}
          pagination={true}
          modules={[EffectCube, Pagination]}
          className="swiper"
        >
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-1.jpg" alt="Slide 1" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-2.jpg" alt="Slide 2" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-3.jpg" alt="Slide 3" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-4.jpg" alt="Slide 4" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default Login;
