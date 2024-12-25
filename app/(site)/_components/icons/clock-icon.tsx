import * as React from "react";

// Define props interface for the component
interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const ClockIcon: React.FC<ArrowIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 512 512" // Use appropriate viewBox for the arrow's scaling
    className={props.className}
    {...props}
  >
     <path
      d="M173.721 347.442c95.919 0 173.721-77.802 173.721-173.721S269.64 0 173.721 0 0 77.802 0 173.721s77.802 173.721 173.721 173.721zm-12.409-272.99c0-6.825 5.584-12.409 12.409-12.409s12.409 5.584 12.409 12.409v93.313l57.39 45.912c5.336 4.281 6.204 12.098 1.923 17.434a12.342 12.342 0 0 1-9.679 4.653c-2.73 0-5.46-.869-7.755-2.73L165.966 183.4c-2.916-2.358-4.653-5.894-4.653-9.679V74.452z"
      data-original="#000000"
    />
  </svg>
);

export default ClockIcon;
