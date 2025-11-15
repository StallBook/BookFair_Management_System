import React from "react";
import bgImg from "../assets/Web.jpg";
import Character from "../assets/lg.png";

const GenresBanner = () => {
  return (
    <div
      className="w-full  bg-cover bg-center rounded-xl flex items-center justify-center p-4"
      style={{
        backgroundImage: `url(${bgImg})`,
      }}
    >
      <div className="bg-black/50 p-6 rounded-xl text-center max-w-2xl">
        <div className="w-full h-full flex items-center justify-center">
              <img
                src={Character}
                alt="doctor character"
              />
            </div>
        
      </div>
    </div>
  );
};

export default GenresBanner;
