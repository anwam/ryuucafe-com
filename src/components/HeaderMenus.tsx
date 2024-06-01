import { scrollToNode } from "src/utils/scrollToNode";
import { Button } from "@headlessui/react";
import OrderButton from "./product/OrderButton";

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
      className="w-5 h-5"
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
          className="menu-sm menu dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {Menus.map((menu) => (
            <li key={menu.name}>
              <Button
                className="btn btn-primary btn-link btn-sm"
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
    <div className="flex items-center justify-end navbar-end">
      <ul className="hidden px-1 lg:flex menu menu-horizontal">
        {Menus.map((menu) => (
          <li key={menu.name}>
            <Button
              className="btn btn-link"
              onClick={(_e) => scrollToNode(menu.link)}
            >
              {menu.name}
            </Button>
          </li>
        ))}
      </ul>
      <OrderButton />
    </div>
  );
}

export default HeaderMenus;
