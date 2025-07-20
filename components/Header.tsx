"use client";
import { useState } from "react";
import { DedicatedNodesIcon, RpcServiceIcon } from "./Icons";

export function Header() {
  const navLinks = ["Documentation", "Developers", "Exlorers"];
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTapped, setIsTapped] = useState(false);

  const handleTouch = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 150);
  };

  return (
    <>
      <header className="px-4 py-3 max-w-[1284px] mx-auto flex items-center justify-between">
        {/* Logo */}
        <h3 className="font-poppins text-[22px] tracking-[2px] text-brand">
          DEXFLORA
        </h3>

        {/* Navigation */}
        <ul className="text-[14px] font-medium flex items-center space-x-2 max-md:hidden">
          {navLinks.map((label) => (
            <li
              key={label}
              className="flex items-center gap-2 cursor-pointer transition-all ease-in-out hover:bg-light px-[12px] py-2 rounded-md"
            >
              <span>{label}</span>
              <img src="/assets/icons/chevron-down.svg" alt="Chevron Down" />
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 text-[16px] font-medium max-md:hidden">
          <button className="px-4 py-2 bg-[#ebf3ff] text-[#0b57d0] transition-all ease-in-out hover:bg-[#D6E6FF] rounded-xl cursor-pointer">
            Contact
          </button>
          <button className="px-4 bg-brand hover:bg-[#2062E5] text-white py-2 rounded-xl flex items-center gap-2 transition-all ease-in-out cursor-pointer">
            <span>Dashboard</span>
            <img src="/assets/icons/cursor-click.svg" alt="Cursor Click" />
          </button>
        </div>

        {/* Mobile Hamburger Menu */}

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="w-13 h-13 bg-brand active:bg-[#2062E5] text-white rounded-2xl flex items-center justify-center transition-transform duration-150 ease-in-out cursor-pointer active:scale-90 md:hidden"
        >
          <img
            src="/assets/icons/hamburger.svg"
            alt="Hamburger"
            className={`${isOpen ? "hidden" : "block"} `}
          />
          <img
            src="/assets/icons/x-close-white.svg"
            alt="Close"
            className={`${isOpen ? "block" : "hidden"} `}
          />
        </button>
      </header>

      {isOpen && (
        <div className="absolute top-[75px] left-0 w-full px-4 sm:px-10 ">
          <div className="grid sm:grid-cols-2 items-center gap-3 sm:gap-2 text-[16px] font-medium mt-4">
            <button className=" p-4 bg-[#ebf3ff] text-[#0b57d0] text-center transition-all ease-in-out active:bg-[#D6E6FF] rounded-xl cursor-pointer">
              Contact
            </button>
            <button className="justify-center p-4 bg-brand active:bg-[#2062E5] text-white rounded-xl flex items-center gap-2 transition-all ease-in-out cursor-pointer">
              <span>Dashboard</span>
              <img src="/assets/icons/cursor-click.svg" alt="Cursor Click" />
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-[18px] font-bold">Developers</h3>

            <div className="mt-12 cursor-pointer rounded-2xl p-2 flex items-center gap-4 group active:bg-light transition-all duration-150 ease-in-out">
              <div className="w-13 h-13 bg-[#ebf3ff]  group-active:bg-[#2062E5] rounded-2xl flex items-center justify-center transition-all duration-150 ease-in-out cursor-pointer active:scale-90 text-[#2772F5] group-active:text-white">
                <DedicatedNodesIcon />
              </div>

              <div className="font-medium">
                <div className="flex items-center gap-2">
                  <p className="text-[16px]">Low Level Interactions</p>

                  <span className="text-[10px] bg-[#FFF4E6] text-[#FF9500] px-2 rounded-xl">
                    Beta
                  </span>
                </div>
                <p className="text-[12px]  text-[#8e8e93]">
                  Private-based nodes
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
