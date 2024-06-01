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
        className="btn btn-primary btn-wide"
      >
        สั่งซื้อ
      </Button>
      <Dialog
        className="relative z-modal"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center w-screen p-4">
          <DialogPanel className="max-w-screen-md p-3 space-y-4 bg-white border shadow-lg lg:p-6 rounded-box">
            <DialogTitle>สั่งซื้อมัทฉะ Delivery</DialogTitle>
            <Description>
              สามารถสั่งซื้อได้ที่ Delivery ทุกแพลตฟอร์ม
            </Description>
            <ul className="grid w-full max-w-full grid-flow-row grid-cols-2 gap-4">
              <li className="">
                <a
                  className="w-full btn btn-primary lg:btn-lg lg:btn-wide"
                  href="https://www.wongnai.com/delivery/businesses/2731010Vj/order"
                >
                  Line Man
                </a>
              </li>
              <li>
                <a
                  className="w-full btn bg-violet-600 text-violet-100 lg:btn-lg lg:btn-wide"
                  href="https://static.robinhood.in.th/app_link.html?URI=robinhoodth://merchantlanding/id/360887"
                >
                  Robinhood
                </a>
              </li>
              <li>
                <a
                  className="w-full text-green-100 bg-green-700 btn lg:btn-lg lg:btn-wide"
                  href="https://grab.onelink.me/2695613898"
                >
                  Grab
                </a>
              </li>
              <li>
                <a
                  className="w-full bg-orange-600 btn text-orange-50 lg:btn-lg lg:btn-wide"
                  href="https://shopee.co.th/universal-link/now-food/shop/10202568"
                >
                  Shopee
                </a>
              </li>
            </ul>
            <div>
              <Button
                className="btn btn-error"
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
