import * as React from "react";

// Define props interface for the component
interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const CalenderIcon: React.FC<ArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512" // Use appropriate viewBox for the arrow's scaling
    className={props.className}
    {...props}
  >
    <path
      d="M279 364c0 22.056 17.944 40 40 40h47c22.056 0 40-17.944 40-40v-47c0-22.056-17.944-40-40-40h-47c-22.056 0-40 17.944-40 40v47zm40-47h47l.025 46.999L366 364h-47v-47z"
      data-original="#000000"
    />
    <circle cx={386} cy={210} r={20} data-original="#000000" />
    <circle cx={299} cy={210} r={20} data-original="#000000" />
    <path
      d="M492 352c11.046 0 20-8.954 20-20V120c0-44.112-35.888-80-80-80h-26V20c0-11.046-8.954-20-20-20s-20 8.954-20 20v20h-91V20c0-11.046-8.954-20-20-20s-20 8.954-20 20v20h-90V20c0-11.046-8.954-20-20-20s-20 8.954-20 20v20H80C35.888 40 0 75.888 0 120v312c0 44.112 35.888 80 80 80h352c44.112 0 80-35.888 80-80 0-11.046-8.954-20-20-20s-20 8.954-20 20c0 22.056-17.944 40-40 40H80c-22.056 0-40-17.944-40-40V120c0-22.056 17.944-40 40-40h25v20c0 11.046 8.954 20 20 20s20-8.954 20-20V80h90v20c0 11.046 8.954 20 20 20s20-8.954 20-20V80h91v20c0 11.046 8.954 20 20 20s20-8.954 20-20V80h26c22.056 0 40 17.944 40 40v212c0 11.046 8.954 20 20 20z"
      data-original="#000000"
    />
  </svg>
);

export default CalenderIcon;
