import * as React from "react";

// Define props interface for the component
interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const OpenIcon: React.FC<ArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512" // Use appropriate viewBox for the arrow's scaling
    className={props.className}
    {...props}
  >
   <path
      d="M414.4 171c-4.8-4.8-11.6-8-18.8-8h-40L248.8 52.2c-1.2-8.8-4.8-16.4-10.8-22C231.2 23 221.6 19 211.2 19c-10.4 0-20 4.4-26.8 11.2-6 6-9.6 13.6-10.8 22L66.8 163.4h-40c-7.2 0-14 2.8-18.8 8-4.8 4.8-8 11.6-8 18.8v186.4c0 7.2 3.2 14 8 18.8s11.6 8 18.8 8h368.8c7.2 0 14-3.2 18.8-8s8-11.6 8-18.8V190.2c0-7.6-3.2-14-8-19.2zM200 45.4c2.8-2.8 6.8-4.8 11.2-4.8 4.4 0 8.4 2 11.2 4.8 2.8 2.8 4.8 6.8 4.8 11.2 0 4.4-2 8.4-4.8 11.2l-.4.4c-2.8 2.8-6.8 4.4-10.8 4.4-4.4 0-8.4-1.6-11.2-4.8-2.8-2.8-4.8-6.8-4.8-11.2 0-4.4 1.6-8.4 4.8-11.2zm-20.8 32c1.6 2.4 3.2 4.4 4.8 6 7.2 7.2 16.8 11.6 27.2 11.6 10 0 19.2-4 26-10.4l.8-.8c2-2 3.6-4 4.8-6l82.4 86H96.8l82.4-86.4zm220 302.8c-.8.8-2 1.2-3.6 1.2H26.8c-1.2 0-2.4-.4-3.6-1.6-.8-.8-1.6-2-1.6-3.6v-186c0-1.2.4-2.4 1.2-3.6.8-.8 2-1.2 3.6-1.2h368.8c1.2 0 2.4.4 3.6 1.2.8.8 1.2 2 1.2 3.6v186.4h.4c0 1.2-.4 2.4-1.2 3.6z"
      data-original="#000000"
    />
    <path
      d="M203.2 241.4c-3.6-2.4-7.2-4-11.6-4.8-4-1.2-8.8-1.6-13.6-1.6-6 0-10.8.4-14 .4-3.6 0-5.6 0-6 .4-5.6.4-9.2 3.2-10.8 8-.4.8-.4 2-.8 3.2v28c0 24.4-.4 40-.4 46.8 0 6.4 4 10 11.6 10 3.6 0 6.8-.8 8.8-2.4 2-1.6 3.2-4.4 3.2-7.6v-20.4h3.2c4.4 0 8.4 0 11.6-.4 3.2 0 5.6-.4 7.2-.8 3.6-.8 6.8-2 10-4 2.8-2 5.6-4.4 7.6-7.6 2.4-2.8 4-6 5.2-9.6 1.2-3.2 1.6-6.8 2-10.4.4-6-.4-11.2-2.8-16-2.4-4.4-5.6-8.4-10.4-11.2zm-9.6 30c-.4 1.2-1.2 2.4-1.6 3.6-1.6 2.4-3.2 3.6-5.6 4.4-1.2.4-2.8.4-4.8.8H170v-24.4h8.4c4.4 0 7.6.4 10 1.6 2 .8 3.6 2 4.4 3.6.8 1.6 1.6 3.6 1.6 6 0 1.6-.4 3.2-.8 4.4zm-86-33.6c-5.6-2.4-11.6-3.2-18-3.2-12 0-23.2 4.4-32.4 14-4.8 4.8-8.4 10.4-10.8 16.4-2.4 6-3.6 12.8-3.6 20.4 0 14 4.8 25.2 14 34 4.8 4.4 9.6 7.6 15.2 9.6s11.2 3.2 17.2 3.2c6.8 0 12.8-1.2 18.4-3.6 5.6-2.4 10.8-6 15.2-10.8 4.4-4.8 8-10.4 10.4-16 2.4-6 3.6-12.4 3.6-19.2 0-13.6-4.8-25.2-14-34-4.8-5.2-9.6-8.4-15.2-10.8zM112 293c-1.2 3.2-2.8 6.4-5.2 9.2-4.4 5.6-10 8-16.4 8-3.6 0-6.8-.4-9.6-1.6-2.8-1.2-5.2-2.8-7.6-5.6-2.4-2.4-4-5.2-5.2-8.4-1.2-3.2-1.6-6.8-1.6-10.8s.4-8 1.6-11.2c1.2-3.2 2.8-6.4 4.8-8.8 4.4-5.2 9.6-7.6 16-7.6 3.6 0 6.4.8 9.6 1.6 2.8 1.2 5.6 3.2 8 5.6 2.4 2.4 4.4 5.2 5.6 8.4.8 3.2 1.6 6.8 1.6 10.8 0 3.6-.4 7.2-1.6 10.4zm167.2 16.8h-8.4c-3.2 0-6.8 0-11.2.4h-12.4v-16.4h24c3.2 0 5.6-.8 7.6-2.4 1.6-1.6 2.8-4 2.8-7.2 0-4-.8-6.8-3.2-8.4-1.2-.8-2.4-1.2-4-1.6-1.6-.4-3.2-.4-4.8-.4-5.6 0-12 .4-19.6.4h-2l.4-10.8v-7.2h23.2c5.2 0 8 0 9.2-.4h.4c2.4-.8 4-2 4.8-4 .8-1.6 1.6-4 1.2-6.8 0-1.2-.4-2.8-.8-3.6-.4-1.2-1.2-2.4-2-3.2-.8-.8-2-1.6-3.2-2-1.2-.4-2.4-.8-4-.8h-38.8c-3.6 0-6.4.8-8.4 2.4-1.2.8-2 2-2.8 3.2s-.8 2.8-1.2 4.4v73.2c0 2 .4 3.6 1.2 5.2.8 1.6 2 2.8 3.2 3.6s2.8 1.2 5.2 1.6c2 .4 4.4.4 7.2.4h36.8c3.2 0 6-1.2 7.6-2.8 1.6-2 2.8-4.4 2.8-8 0-3.2-.8-5.6-2.4-7.6-2.8 0-5.2-1.2-8.4-1.2zm100-17.6v-45.6c0-7.6-3.6-11.6-11.2-11.6-2 0-3.6.4-5.2.8s-2.8 1.2-4 2.4c-1.2 1.2-1.6 2.4-2.4 4-.4 1.6-.8 3.2-.8 5.6l.4 25.6V289l-2.8-4.4-29.6-41.6c-.8-1.2-2-2.4-2.8-3.2s-2-2-2.8-2.4c-.8-.8-2-1.2-3.2-1.6-1.2-.4-2.4-.4-3.6-.4-3.2 0-6.4.8-8.8 2.4-1.6.8-2.4 2-3.2 3.2-.8 1.2-1.2 2.8-1.2 4.4v75.2c0 3.2 1.2 6 3.6 7.6 2 1.6 4.8 2.4 8.4 2.4 3.6 0 6.4-1.2 8-3.2 2-2 2.8-4.8 2.8-8.4v-45.2l33.6 48 2.4 3.6c.8 1.2 1.6 2 2.4 2.4.8.8 2 1.2 3.2 1.6 1.2.4 2.4.4 3.6.4 3.6 0 6.4-.8 9.2-2.8 1.2-.8 2.4-2 3.2-3.6.8-1.2 1.2-2.8 1.2-4.4v-18l-.4-5.2v-3.6z"
      data-original="#000000"
    />
  </svg>
);

export default OpenIcon;