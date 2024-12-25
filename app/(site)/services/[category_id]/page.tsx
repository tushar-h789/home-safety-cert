import CommonBanner from "@/app/_components/common-banner";
import ServiceContent from "../_components/serviceContent";
import { serviceData } from "@/shared/data";

function capitalizeWords(text: string) {
  return text
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default async function CategoryDetailsPage({ params }: { params: { category_id: string } }) {
  const { category_id } = params;

  const matchingService = serviceData.find(data => 
    data.path.split('/').pop()?.toLowerCase() === category_id.toLowerCase()
  );
  

  if (!matchingService) {
    return (
      <div>
        <CommonBanner heading="Category Not Found" firstPageName="Home" secondPageName="Category Not Found" />
        <p>Sorry, the requested category could not be found.</p>
      </div>
    );
  }

  const formattedCategoryLabel = (matchingService.label);
  
  return (
    <div>
      {/* Dynamically set the heading and breadcrumb */}
      <CommonBanner heading={formattedCategoryLabel} firstPageName="Home" secondPageName={formattedCategoryLabel} />

      {/* details part */}
      <ServiceContent />
    </div>
  );
}
