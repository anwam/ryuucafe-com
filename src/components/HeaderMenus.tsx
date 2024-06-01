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
          className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
        >
          {Menus.map((menu) => (
            <li key={menu.name}>
              <Button
                className="btn btn-link btn-primary btn-sm"
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
    <div className="navbar-end flex items-center justify-end">
      <ul className="menu menu-horizontal hidden gap-x-1 px-1 lg:flex">
        {Menus.map((menu) => (
          <li key={menu.name}>
            <Button
              className="btn btn-link hover:btn hover:btn-primary"
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
