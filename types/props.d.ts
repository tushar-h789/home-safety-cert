export type PageHeaderProps = {
    backgroundImage: StaticImageData;
  
    breadCrumbOptions: {
      label: string;
      path?: string;
      isCurrentPage?: boolean;
    }[];
  };
  