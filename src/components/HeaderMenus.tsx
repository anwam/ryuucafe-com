import { scrollToNode } from "src/utils/scrollToNode";
import { Button } from "./ui/button";

const Menus = [
  {
    name: "Menu",
    link: "#menu",
  },
  {
    name: "Contact",
    link: "#contact",
  },
];

function HambugerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 6h16M4 12h8m-8 6h16"
      />
    </svg>
  );
}

function HeaderMenus({
  vairiant = "desktop",
}: {
  vairiant?: "mobile" | "desktop";
}) {
  if (vairiant === "mobile") {
    return (
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <HambugerIcon />
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {Menus.map((menu) => (
            <li key={menu.name}>
              <Button
                variant="link"
                size="lg"
                onClick={(_e) => scrollToNode(menu.link)}
              >
                {menu.name}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="navbar-end hidden lg:flex">
      <ul className="menu menu-horizontal px-1">
        {Menus.map((menu) => (
          <li key={menu.name}>
            <Button variant="link" onClick={(_e) => scrollToNode(menu.link)}>
              {menu.name}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HeaderMenus;
