import DashboardNavBar from '../components/dashboard/DashboardNavBar';

function DashboardLayout({ children, ...props }) {
  return (
    <div>
      <DashboardNavBar id={props.id} role={props.role} notifications={props.notifications} />
      {children}
    </div>
  );
}

export default DashboardLayout;
