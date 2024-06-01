import { useState } from "react";
import {
  Button,
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function OrderButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="btn btn-link hover:btn hover:btn-primary"
      >
        สั่งซื้อ
      </Button>
      <Dialog
        className="relative z-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-screen-md space-y-4 rounded-box border bg-base-100 p-3 shadow-lg lg:p-6">
            <Description>
              สามารถสั่งซื้อได้ที่ Delivery App ทุกแพลตฟอร์ม
            </Description>
            <ul className="grid w-full max-w-full grid-flow-row grid-cols-2 gap-4">
              <li className="">
                <a
                  className="btn btn-primary w-full lg:btn-md lg:btn-wide"
                  href="https://www.wongnai.com/delivery/businesses/2731010Vj/order"
                >
                  Line Man
                </a>
              </li>
              <li>
                <a
                  className="btn w-full bg-violet-600 text-violet-100 lg:btn-md lg:btn-wide hover:bg-violet-700"
                  href="https://static.robinhood.in.th/app_link.html?URI=robinhoodth://merchantlanding/id/360887"
                >
                  Robinhood
                </a>
              </li>
              <li>
                <a
                  className="btn w-full bg-green-700 text-green-100 lg:btn-md lg:btn-wide hover:bg-green-800"
                  href="https://grab.onelink.me/2695613898"
                >
                  Grab
                </a>
              </li>
              <li>
                <a
                  className="btn w-full bg-orange-600 text-orange-50 lg:btn-md lg:btn-wide hover:bg-orange-700"
                  href="https://shopee.co.th/universal-link/now-food/shop/10202568"
                >
                  Shopee
                </a>
              </li>
            </ul>
            <div>
              <Button
                className="btn btn-outline btn-error"
                onClick={() => setIsOpen(false)}
              >
                ยกเลิก
              </Button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
