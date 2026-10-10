import UnderConstruction from "../components/UnderConstruction/UnderConstruction";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-low px-margin-mobile text-center">
        <h1 className="font-display-lg text-3xl sm:text-display-lg text-on-background tracking-tight">
            Bienvenido a MOUSIN
        </h1>
        <UnderConstruction className="mt-8 md:mt-10 max-w-xl" />
    </div>
    );
};

export default Home;
