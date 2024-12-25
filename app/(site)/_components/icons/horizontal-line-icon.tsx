import * as React from "react";

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const HorizontalIcon: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 60 60"
    fill="currentColor" // Allows the color to be controlled by CSS
    className={props.className} // Pass className for Tailwind or other styling
    {...props} // Spread other props like width, height, etc.
  >
    <path
      d="M41.501 35.925h-34.3a1 1 0 0 1-1-1v-9.85a1 1 0 0 1 1-1h34.3a1 1 0 0 1 1 1v9.85a1 1 0 0 1-1 1zm-33.3-2h32.3v-7.85h-32.3zm19.6-14.752H7.2a1 1 0 0 1-1-1v-9.85a1 1 0 0 1 1-1h20.6a1 1 0 0 1 1 1v9.85a1 1 0 0 1-1 1zm-19.6-2h18.6v-7.85H8.2zm42.4 35.503H7.199a1 1 0 0 1-1-1v-9.85a1 1 0 0 1 1-1h43.402a1 1 0 0 1 1 1v9.85a1 1 0 0 1-1 1zm-42.402-2h41.402v-7.85H8.199zM60 56.818a1 1 0 0 0-1-1H2V3.182a1 1 0 0 0-2 0v53.636a1 1 0 0 0 1 1h58a1 1 0 0 0 1-1z"
    />
  </svg>
);

export default HorizontalIcon;
