import * as React from "react";

// Define the props for the SVG component
interface SvgProps extends React.SVGProps<SVGSVGElement> {
  size?: number; // Optional size prop to adjust the size of the icon
  color?: string; // Optional color prop to adjust the fill color of the icon
}

const SvgComponent: React.FC<SvgProps> = ({ size = 512, color = "currentColor", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={size} // Dynamically setting the width based on the size prop
    height={size} 
    className={props.className}
    fill={color} // Using the color prop to set the fill color
    viewBox="0 0 611.728 611.728"
    {...props} // Spreading other props like className, style, etc.
  >
    <path
      fillRule="evenodd"
      d="M125.978 19.313a18.468 18.468 0 0 1 .176-3.869 17.619 17.619 0 0 1 2.739-7.298c2.62-4.092 6.886-7.176 12.4-7.935a17.703 17.703 0 0 1 3.758-.18h322.741c9.936 0 17.99 8.054 17.99 17.99v449.755c0 9.936-8.055 17.99-17.99 17.99H350.856v107.941c0 14.369-16.014 22.939-27.969 14.969L133.989 482.744a17.99 17.99 0 0 1-8.011-14.969zm323.824 430.473V36.011H203.386l139.459 92.973a17.99 17.99 0 0 1 8.011 14.969v305.834h98.946zM314.876 560.092V153.58L161.959 51.635v406.512zM287.89 359.834c0 9.936-8.055 17.99-17.99 17.99-9.936 0-17.99-8.054-17.99-17.99v-35.98c0-9.936 8.054-17.99 17.99-17.99s17.99 8.054 17.99 17.99z"
      clipRule="evenodd"
    />
  </svg>
);

export default SvgComponent;
