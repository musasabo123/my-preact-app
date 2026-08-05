import type { ComponentChildren } from "preact";
import UserNavbar from "./UserNavbar";

interface AppLayoutProps {
  children: ComponentChildren;
  user?: any;
  isLoggedIn?: boolean;
}

const AppLayout = ({ children, user, isLoggedIn }: AppLayoutProps) => {
  return (
    <>
      <UserNavbar user={user} isLoggedIn={isLoggedIn} />
      {children}
    </>
  );
};

export default AppLayout;
