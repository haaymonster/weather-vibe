"use client";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { playListAll, playOption } from "../app/lib/playList";
import getTitleByVideoIndex from "../app/utils/getTitleByIndex";
import Image from "next/image";
import book from "../img/book.png";
import EN from "../img/영어.png";
import KO from "../img/한글.png";
import KOREA from "../img/한국.png";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import car from "../img/car.gif";
import sakura from "../img/sakura.gif";
import night from "../img/night.gif";
import toy from "../img/toy.gif";
import city from "../img/city.gif";

// const images = [
//   "https://i.gifer.com/6vIk.gif",
//   "https://i.gifer.com/xK.gif",
//   "https://i.gifer.com/YQgT.gif",
//   "https://i.gifer.com/PPy.gif",
//   "https://i.gifer.com/GVue.gif",
//   "https://i.gifer.com/2swA.gif",
//   "https://i.gifer.com/Mf08.gif",
//   "https://i.gifer.com/Xgd3.gif",
//   "https://i.gifer.com/6OmH.gif",
// ];

const images = [car, sakura, night, city, toy];

const MySwal = withReactContent(Swal);

export default function YtPlayer() {
  const [videoTitle, setVideoTitle] = useState("");
  const [currentPlayList, setCurrentPlayList] = useState(
    playListAll.defaultList
  );
  const [ytPlayer, setYtPlayer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [issPlayListChanged, setIsPlayListChanged] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(images[0]);
  const [previousImageIndex, setPreviousImageIndex] = useState(0);
  const [consecutiveSameImageCount, setConsecutiveSameImageCount] = useState(0);
  const [isBookClicked, setIsBookClicked] = useState(false);
  const [isKoreanImageClicked, setIsKoreanImageClicked] = useState(false);
  const [currentIcon, setCurrentIcon] = useState("💗");
  const [showIconOption, setShowIconOption] = useState(false);
  useEffect(() => {
    showNotification();
  }, []);

  const showNotification = () => {
    Swal.fire({
      text: "Hey If you are new to Elementalsky, why not give the heart a click? 😊",
      timer: 3000,
      timerProgressBar: true,
      toast: true,

      showConfirmButton: false,
      background: "#C5BFB1",
    });
  };

  const getRandomImage = () => {
    let randomIndex = Math.floor(Math.random() * images.length);
    while (
      randomIndex === previousImageIndex &&
      consecutiveSameImageCount >= 1
    ) {
      randomIndex = Math.floor(Math.random() * images.length);
    }
    return randomIndex;
  };

  const handleRandomImage = () => {
    let randomIndex = getRandomImage();
    if (randomIndex === previousImageIndex) {
      setConsecutiveSameImageCount((count) => count + 1);
    } else {
      setConsecutiveSameImageCount(0);
    }
    setBackgroundImage(images[randomIndex]);
    setPreviousImageIndex(randomIndex);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        handleRandomImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  let playList = playListAll.defaultList.map((item) => item.videoId);
  let player: any;

  useEffect(() => {
    loadYT();
  }, []);

  const pickPlayList = (value: any, icon: any) => {
    ytPlayer?.cuePlaylist(playListAll[value].map((item: any) => item.videoId));
    setCurrentPlayList(playListAll[value]);

    setVideoTitle("");
    setIsPlaying(false);
    setCurrentIcon(icon);
    setShowIconOption(false);
  };

  const changeVolume = (volume: any) => {
    if (player) {
      player.setVolume(volume);
      updateVolumeBar();
    }
  };

  const updateVolumeBar = () => {
    const volumeBar = document.getElementById("volume-bar");
    if (volumeBar) {
      volumeBar.style.width = `${player.getVolume()}%`;
    }
  };

  const loadYT = () => {
    var tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
      player = new YT.Player("ytplayer", {
        height: "0",
        width: "0",
        playerVars: {
          controls: 0,
          enablejsapi: 1,
          autoplay: 1,
          loop: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
      setYtPlayer(player);
    };
  };

  function onPlayerReady(event: any) {
    document.addEventListener("keydown", function (event) {
      if (event.code == "ArrowRight") {
        player?.nextVideo();
      }
      if (event.code == "ArrowLeft") {
        player?.previousVideo();
      }

      if (event.code === "ArrowUp") {
        changeVolume(player?.getVolume() + 10);
      }
      if (event.code === "ArrowDown") {
        changeVolume(player?.getVolume() - 10);
      }
    });
    event.target.playVideo();
    player?.cuePlaylist(playList);
  }

  function onPlayerStateChange(event: any) {
    if (event.data === YT.PlayerState.PLAYING) {
      setCurrentIndex(player.getPlaylistIndex());
      setIsPlayListChanged((prev) => !prev);
    }
  }

  useEffect(() => {
    changeTitle();
  }, [issPlayListChanged]);

  const changeTitle = () => {
    const title = getTitleByVideoIndex(currentPlayList, currentIndex);
    setVideoTitle(title);
  };

  const toggleBookClick = () => {
    setIsBookClicked((prev) => !prev);
  };

  const toggleKoreanImage = () => {
    setIsBookClicked(true);
    setIsKoreanImageClicked((prev) => !prev);
  };

  const closeENImage = () => {
    setIsBookClicked(false);
  };

  return (
    <>
      <div className="pointer-events-none ">
        <div id="ytplayer"></div>
      </div>
      <Image
        alt="zzz"
        src={backgroundImage}
        fill
        sizes="100vw"
        className="absolute top-0 right-0 select-none "
        objectFit="cover"
      ></Image>
      {/* bottom */}
      <div className="fixed z-50 bottom-0 left-0  right-0 ">
        <div className="flex flex-col lg:flex-row items-center px-10 justify-between ">
          <div className="flex items-center w-[150px] justify-between">
            <Image
              src="https://staging.cohostcdn.org/attachment/8acfdaa0-1dbe-49e6-8ba5-4a59c429fd17/PROGMAN.exe%20CD.png"
              alt="cd"
              width={50}
              height={50}
              className={clsx("", { "animate-spin": isPlaying === true })}
            ></Image>
            <div
              onClick={() => setShowIconOption((prev) => !prev)}
              className="relative cursor-pointer hover:-translate-y-1 transition duration-300 ease-in-out"
            >
              {currentIcon}
              <ul
                className={clsx(
                  " rounded p-3 z-60 absolute bottom-10 -left-11 bg-white bg-opacity-50 flex w-70 flex-wrap",
                  {
                    hidden: showIconOption === false,
                  }
                )}
              >
                {playOption.map((pl, index) => (
                  <li
                    key={index}
                    className="cursor-pointer hover:bg-blue-200 rounded p-1 w-20 flex items-center justify-center"
                    onClick={() => pickPlayList(pl.name, pl.icon)}
                  >
                    {pl.icon}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="ml-1 hover:-translate-y-1 transition duration-300 ease-in-out"
              onClick={() => {
                ytPlayer?.playVideo();
                setIsPlaying(true);
              }}
              style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                />
              </svg>
            </button>

            <button
              className="hover:-translate-y-1 transition duration-300 ease-in-out"
              onClick={() => {
                ytPlayer?.pauseVideo();
                setIsPlaying(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
                style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                />
              </svg>
            </button>
          </div>
          {/* song title */}
          <p style={{ filter: "drop-shadow(0 0 0.2rem white)" }}>
            {videoTitle}
          </p>

          <Image
            src={book}
            alt="book"
            width={90}
            height={90}
            className="cursor-pointer"
            onClick={toggleBookClick}
          />
        </div>
      </div>

      {/* <div
        className="absolute z-60 bottom-0 right-0 flex flex-col items-center"
        style={{ zIndex: 10 }}
      >
        <div className=" bg-400 h-2 w-full mr-10 rounded-full mb-2">
          <div
            id="volume-bar"
            className="bg-pink-500 h-full w-full rounded-full"
          ></div>
        </div>
        <p
          className="text-sm text-black-600 mr-10 mb-2"
          style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
        >
          Control volume with ⬆️ ⬇️
        </p>
      </div> */}
      {isBookClicked && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {isKoreanImageClicked ? (
              <Image alt="KO Image" src={KO} width={700} height={500} />
            ) : (
              <Image alt="EN Image" src={EN} width={700} height={500} />
            )}
            <button
              onClick={closeENImage}
              className="absolute top-0 right-0 bg-transparent text-white p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {isBookClicked && (
              <button
                onClick={toggleKoreanImage}
                className="absolute top-0 bg-transparent text-white p-2"
                style={{
                  top: "97%",
                  right: "-55px",
                  transform: "translateY(-50%)",
                }}
              >
                <Image src={KOREA} width={50} height={50} alt="" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
