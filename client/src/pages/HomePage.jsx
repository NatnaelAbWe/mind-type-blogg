import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/InPageNavigation";

const HomePage = () => {
  return (
    <AnimationWrapper>
      <section className="cover flex justify-center gap-10">
        {/* leatest bloggs */}
        <div className="w-full ">
          <InPageNavigation
            routes={["home", "trending blogs"]}
            defaultHidden={["trending blogs"]}
          ></InPageNavigation>
        </div>
        {/* filters and trending blogs */}
        <div></div>
      </section>
    </AnimationWrapper>
  );
};

export default HomePage;
