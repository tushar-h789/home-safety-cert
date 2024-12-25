import Link from "next/link";
import PhoneIcon from "../(site)/_components/icons/phone-icon";
import MessageIcon from "../(site)/_components/icons/message-icon";
import ClockIcon from "../(site)/_components/icons/clock-icon";
import FacebookIcon from "../(site)/_components/icons/facebook-icon";
import InstagramIcon from "../(site)/_components/icons/instagram-icon";
import TwitterIcon from "../(site)/_components/icons/twitter-icon";
import LogoutIcon from "../(site)/_components/icons/logout-icon";

export default function NavBar() {
  return (
    <nav className="bg-primary py-3 hidden lg:block ">
      <div className="container ">
        <div className="flex justify-between text-white">
          {/* Left Section - Contact Info */}
          <div className="flex gap-4 items-center">
            {/* Phone Info */}
            <div className="flex items-center gap-2 relative pr-4 text-md">
              <PhoneIcon className="w-4 text-secondary" />
              <a
                href="tel:02034884929"
                className="text-white hover:text-secondary"
              >
                020 3488 4929
              </a>
              <span className="absolute right-0 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
            </div>

            {/* Email Info */}
            <div className="flex items-center gap-2 relative pr-4 text-md">
              <MessageIcon className="w-4 text-secondary" />
              <a
                href="mailto:info@homesafetycert.co.uk"
                className="hover:text-secondary"
              >
                info@homesafetycert.co.uk
              </a>
              <span className="absolute right-0 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
            </div>

            {/* Business Hours */}
            <div
              className="flex items-center jusceeeeeeee
             gap-2 text-md"
            >
              <ClockIcon className="w-6 text-secondary" />
              <p>Mon - Fri: 08:00 - 18:00</p>
            </div>
          </div>

          {/* Right Section - Social Media and Login */}
          <div className="flex gap-4 items-center">
            {/* Facebook */}
            <div className="flex items-center gap-2 relative pr-4 text-md cursor-pointer hover:text-secondary">
              <span className="absolute right-12 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon className="w-4" aria-label="Facebook" />
              </a>
              <span className="absolute right-0 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
            </div>

            {/* Instagram */}
            <div className="flex items-center gap-2 relative pr-4 text-md cursor-pointer hover:text-secondary">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="w-4" aria-label="Instagram" />
              </a>
              <span className="absolute right-0 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
            </div>

            {/* Twitter */}
            <div className="flex items-center gap-2 relative pr-4 text-md cursor-pointer hover:text-secondary">
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon className="w-4" aria-label="Twitter" />
              </a>
              <span className="absolute right-0 h-[48px] w-[1px] bg-slate-500 top-1/2 transform -translate-y-1/2"></span>
            </div>

            {/* Login */}
            <div className="flex items-center gap-2 text-md cursor-pointer">
              <LogoutIcon className="w-4 text-secondary" />
              <Link href="/login">
                <p className="uppercase">Login</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
