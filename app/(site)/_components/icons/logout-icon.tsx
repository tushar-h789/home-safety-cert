import * as React from "react";

// Define props interface for the component
interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const LogoutIcon: React.FC<ArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512" // Use appropriate viewBox for the arrow's scaling
    className={props.className}
    {...props}
  >
    <g data-name="ARROW 48">
      <path
        d="M307.69 347.47a24 24 0 0 0-24 24v58.47a33.93 33.93 0 0 1-33.89 33.9H82.06a33.93 33.93 0 0 1-33.89-33.9V82.06a33.93 33.93 0 0 1 33.89-33.9H249.8a33.93 33.93 0 0 1 33.89 33.9v50.54a24 24 0 0 0 48 0V82.06A82 82 0 0 0 249.8.16H82.06A82 82 0 0 0 .17 82.06v347.88a82 82 0 0 0 81.89 81.9H249.8a82 82 0 0 0 81.89-81.9v-58.47a24 24 0 0 0-24-24z"
        data-original="#000000"
      />
      <path
        d="m504.77 238.53-85.41-85.35a24 24 0 0 0-33.6-.33c-9.7 9.33-9.47 25.13.05 34.65l44.47 44.5h-208a24 24 0 0 0-24 24 24 24 0 0 0 24 24h208l-44.9 44.9a24 24 0 0 0 33.94 33.95l85.45-85.41a24.66 24.66 0 0 0 0-34.91z"
        data-original="#000000"
      />
    </g>
  </svg>
);

export default LogoutIcon;