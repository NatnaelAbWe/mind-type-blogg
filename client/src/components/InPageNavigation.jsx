import { useState, useRef } from "react";

const InPageNavigation = ({ routes }) => {
  let [inPageNav, setInPageNav] = useState(0);
  let activeTabLineRef = useRef();

  const ChangePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNav(i);
  };

  return (
    <>
      <div className="relative mb-8 bg-white border-b-2 border-gray-300 flex flex-nowrap overflow-x-auto">
        {routes?.map((route, i) => {
          return (
            <button
              key={i}
              className={
                "flex gap-2 p-4 capitalize " +
                (inPageNav == i ? "text-black" : "text-gray-300")
              }
              onClick={(e) => {
                ChangePageState(e.target, i);
              }}
            >
              {route}
            </button>
          );
        })}
        <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
      </div>
    </>
  );
};

export default InPageNavigation;
