"use client";
import { fetchCityList, fetchCurrentWeather } from "@/app/lib/weatherData";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import Suggestion from "./Suggestion";
import { Suspense, useState } from "react";
import Image from "next/image";
import locationIcon from "../img/location.png";

type Props = {};
type CityArray = any[] | null;
export default function SearchBar({}: Props) {
  const searchParams = useSearchParams(); //get current search params
  const pathname = usePathname(); //get current path name
  const { replace } = useRouter();
  const [cityList, setCityList] = useState<CityArray>(null);
  const [location, setLocation] = useState("");
  const params = new URLSearchParams(searchParams);

  const suggestionRequest = useDebouncedCallback(async (location: string) => {
    if (location) {
      const list = await fetchCityList(location);
      setCityList(list);
    } else {
      setCityList(null);
    }
  }, 300);

  const handleInputChange = (location: string) => {
    setLocation(location);
    suggestionRequest(location);
  };

  const onCityClick = (lat: number, lon: number, location: string) => {
    console.log("selected");
    params.set("lat", lat.toString());
    params.set("lon", lon.toString());
    params.set("city", location);

    replace(`${pathname}?${params.toString()}`);
    setLocation(location);
    setCityList(null);
    console.log("selected");
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        params.set("lat", latitude.toString());
        params.set("lon", longitude.toString());
        const currentWeather = await fetchCurrentWeather(
          latitude.toString(),
          longitude.toString()
        );
        params.set("city", currentWeather.name);
        replace(`${pathname}?${params.toString()}`);
      });
    }
  };

  return (
    <div className="z-50">
      <div className="flex items-center mt-8">
        <input
          type="text"
          placeholder="search location.."
          className="px-3 py-2 border rounded-sm bg-transparent border-400 focus:outline-none focus:border-green-300 text-white"
          onChange={(e) => {
            handleInputChange(e.target.value);
          }}
          value={location}
          style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
        ></input>

        <div
          onClick={getCurrentLocation}
          className="cursor-pointer -mr-8 ml-3 text-white"
          style={{ filter: "drop-shadow(0 0 0.2rem white)" }}
        >
          <Image src={locationIcon} alt="location" width={32} height={32} />
        </div>
      </div>
      <Suggestion listData={cityList} onCityClick={onCityClick}></Suggestion>
    </div>
  );
}
