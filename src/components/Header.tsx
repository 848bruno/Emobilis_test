const Header = () => {
  return (
    <div className="w-full h-32 md:h-40 bg-cyan-700">
      <div
        className="block md:hidden w-full h-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(images/bg-header-mobile.svg)`,
        }}
      ></div>
      <div className="hidden md:block w-full h-full bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage: `url(images/bg-header-desktop.svg)`,
        }}
      ></div>
    </div>
  );
};
export default Header;