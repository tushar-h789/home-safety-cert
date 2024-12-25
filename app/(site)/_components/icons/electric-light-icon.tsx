import * as React from "react";

interface SvgComponentProps extends React.SVGProps<SVGSVGElement> {}

const EmergencyLightIcon: React.FC<SvgComponentProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 682.667 682.667"
    fill="none"
    stroke="currentColor" // Uses the current text color
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeMiterlimit={10}
    strokeWidth={15}
    {...props}
  >
    <defs>
      <clipPath id="a">
        <path d="M0 512h512V0H0Z" />
      </clipPath>
    </defs>
    <g clipPath="url(#a)" transform="matrix(1.33333 0 0 -1.33333 0 682.667)">
      <path
        d="M0 0h32.635v-45.96c0-13.662-11.075-24.737-24.737-24.737h-85.493c-13.661 0-24.737 11.075-24.737 24.737V0H-30"
        transform="translate(290.852 110.095)"
      />
      <path
        d="M0 0c5.739-18.652 23.104-32.211 43.639-32.211 20.535 0 37.9 13.559 43.639 32.211z"
        transform="translate(212.364 39.398)"
      />
      <path
        d="M0 0c-22.702 0-41.106 18.404-41.106 41.106S-22.702 82.212 0 82.212s41.106-18.404 41.106-41.106S22.702 0 0 0Zm102.26 25.746v30.72l-25.13 3.567a78.898 78.898 0 0 1-9.208 22.229l15.247 20.292-21.721 21.721-20.292-15.247a78.924 78.924 0 0 1-22.23 9.209l-3.566 25.129h-30.72l-3.567-25.129a78.93 78.93 0 0 1-22.229-9.209l-20.292 15.247-21.722-21.721 15.247-20.292a78.957 78.957 0 0 1-9.208-22.229l-25.129-3.567v-30.72l25.129-3.567A78.957 78.957 0 0 1-67.923-.05L-83.17-20.342l21.722-21.721 20.292 15.247a78.93 78.93 0 0 1 22.229-9.209l3.567-25.129h30.72l3.566 25.129a78.924 78.924 0 0 1 22.23 9.209l20.292-15.247 21.721 21.721L67.922-.05a78.93 78.93 0 0 1 9.209 22.229z"
        transform="translate(256.003 222.37)"
      />
      <path d="M0 0v43.988" transform="translate(256 460.825)" />
      <path d="M0 0h43.989" transform="translate(436.499 280.325)" />
      <path d="M0 0h43.989" transform="translate(31.512 280.325)" />
      <path d="m0 0 31.105-31.104" transform="translate(97.263 439.063)" />
      <path d="m0 0 15.202-5.955" transform="translate(72.737 352.124)" />
      <path d="m0 0-6.129 15.646" transform="translate(190.157 448.387)" />
      <path d="m0 0 6.13 15.646" transform="translate(321.843 448.387)" />
      <path d="m0 0-31.104-31.104" transform="translate(414.737 439.063)" />
      <path d="m0 0-15.202-5.955" transform="translate(439.264 352.124)" />
      <path
        d="M0 0c-28.82-27.893-46.859-66.882-46.859-109.778.001-51.887 25.824-97.738 65.317-125.414 12.712-8.91 20.258-23.477 20.258-39v-.004h72.331"
        transform="translate(149.804 384.291)"
      />
      <path
        d="M0 0h32.636c0 15.656 7.763 30.202 20.563 39.219 39.321 27.7 65.01 73.448 65.01 125.201 0 84.096-67.82 152.351-151.75 153.053-30.828.257-59.72-8.816-83.98-24.549"
        transform="translate(290.852 110.095)"
      />
    </g>
  </svg>
);

export default EmergencyLightIcon;
