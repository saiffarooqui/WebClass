import WithSubnavigation from '../components/Landing/Nevbar';

function LandingLayout({ children }) {
  return (
    <div>
      <WithSubnavigation />
      {children}
    </div>
  );
}

export default LandingLayout;
