import { useState, useRef, useEffect } from "react";

export let activeTabLineRef;
export let activeTab;

const InPageNavigation = ({
  routes,
  defaultActiveIndex = 0,
  defaultHidden,
  children,
}) => {
  let [inPageNav, setInPageNav] = useState(defaultActiveIndex);
  activeTabLineRef = useRef();
  activeTab = useRef();

  const ChangePageState = (btn, i) => {
    let { offsetWidth, offsetLeft } = btn;
    activeTabLineRef.current.style.width = offsetWidth + "px";
    activeTabLineRef.current.style.left = offsetLeft + "px";

    setInPageNav(i);
  };

  useEffect(() => {
    ChangePageState(activeTab.current, defaultActiveIndex);
  }, []);

  return (
    <>
      <div className="relative mb-8 bg-white border-b-2 border-gray-300 flex flex-nowrap overflow-x-auto">
        {routes?.map((route, i) => {
          return (
            <button
              ref={i == defaultActiveIndex ? activeTab : null}
              key={i}
              className={
                "flex gap-2 p-4 capitalize " +
                (inPageNav == i
                  ? "text-black"
                  : "text-gray-300 " +
                    (defaultHidden.includes(route) ? "md:hidden" : ""))
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
      {Array.isArray(children) ? children[inPageNav] : children}
    </>
  );
};

export default InPageNavigation;
