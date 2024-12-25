import * as React from "react";

// Define props interface for the component
interface ArrowIconProps extends React.SVGProps<SVGSVGElement> {}

const WebIcon: React.FC<ArrowIconProps> = (props) => (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={512}
    height={512}
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      d="M16 1a15 15 0 1 0 15 15A15.017 15.017 0 0 0 16 1Zm0 28c-2.065 0-4.227-2.662-5.3-7h10.6c-1.073 4.338-3.235 7-5.3 7Zm-5.706-9a27.358 27.358 0 0 1 0-8h11.412A26.651 26.651 0 0 1 22 16a26.651 26.651 0 0 1-.294 4ZM3 16a12.94 12.94 0 0 1 .636-4h4.65a28.115 28.115 0 0 0 0 8h-4.65A12.94 12.94 0 0 1 3 16ZM16 3c2.065 0 4.227 2.662 5.3 7H10.7c1.073-4.338 3.235-7 5.3-7Zm7.714 9h4.65a12.9 12.9 0 0 1 0 8h-4.65A28.351 28.351 0 0 0 24 16a28.351 28.351 0 0 0-.286-4Zm3.807-2h-4.167a16.766 16.766 0 0 0-2.567-6.075A13.063 13.063 0 0 1 27.521 10ZM11.213 3.925A16.766 16.766 0 0 0 8.646 10H4.479a13.063 13.063 0 0 1 6.734-6.075ZM4.479 22h4.167a16.766 16.766 0 0 0 2.567 6.075A13.063 13.063 0 0 1 4.479 22Zm16.308 6.075A16.766 16.766 0 0 0 23.354 22h4.167a13.063 13.063 0 0 1-6.734 6.075Z"
      data-name="Layer 3"
      data-original="#000000"
    />
  </svg>
);

export default WebIcon;