import gasImgOne from "@/public/images/gas-safety-img.jpeg";
import gasImgTwo from "@/public/images/gas-safety-img2.jpg";
import Image from "next/image";

export default function ServiceMainContent() {
  return (
    <div>
        <main className="w-full">
        <div>
          <h2 className="text-3xl font-semibold text-heading mb-4">
            Residential And Commercial Cleaning
          </h2>
          <p className="mb-6 text-para leading-7">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Lorem
            ipsum dolor sit amet, consectetur Lorem ipsum dolor sit adipiscing
            elit. Ut elit tellus, luctus nec massa quis pugu ullamcorper mattis,
            pulvinar dapibus.
          </p>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Image
              src={gasImgOne}
              alt="Office Cleaning"
              className="w-full h-[300px] rounded-lg"
            />
            <Image
              src={gasImgTwo}
              alt="Office Cleaning"
              className="w-full h-[300px] rounded-lg"
            />
          </div>

          <p className="mb-6 text-para leading-7">
            Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies
            nisi. Nam eget dui. Etiam rhoncus. Cum sociis natoque penatibus et
            magnis dis parturient montes, nascetur ridiculus mus. Donec quam
            felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
            consequat massa quis enim.
          </p>

          <h2 className="text-2xl font-bold mb-4 text-heading">
            Residential Cleaning Services
          </h2>
          <p className="text-para leading-7">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
          </p>
        </div>

        <div className="mt-10">
            <Image src={gasImgOne} alt="gas image" width={500} height={400} className="w-full h-[400px] object-cover"/>
            <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-heading">
            Residential Cleaning Services
          </h2>
          <p className="text-para leading-7">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and Lorem ipsum dolor sit amet, consectetur adipisicing elit. Itaque, iste nobis illum pariatur distinctio alias at! Porro esse dignissimos sunt? Labore, quas voluptatum. Atque impedit odit nam assumenda ipsam architecto.
          </p>
            </div>
        </div>
      </main>
    </div>
  )
}
