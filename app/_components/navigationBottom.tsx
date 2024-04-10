import Image from "next/image"
import FacebookImage from '../../public/facebook.png'
import InstaImage from '../../public/insta.png'
import LinkedinImage from '../../public/linkedin.png'
import TwitterImage from '../../public/twitter.png'
export default function navigationBottom() {
  return (
    <section className="bg-slate-900 flex justify-center content-center">
        <div className="grid grid-cols-1  p-4 [&>*:nth-child(odd)]:mt-4 [&>*:nth-child(even)]:mt-2 lg:grid-cols-2 w-5/6">
          <div className="font-bold text-lg">Social</div>
          <div  className="flex flex-wrap sm:gap-1 *:h-8 *:w-8 gap-3 lg:row-start-2 lg:col-start-1">
              <Image src={FacebookImage} alt="Instagram_icon"  className="" height={0} width={0} />
              <Image src={InstaImage} alt="feacebook_icon" className="" height={0} width={0} />
              <Image src={LinkedinImage} alt="linkedin_icon" className="" height={0} width={0} />
              <Image src={TwitterImage} alt="twitter_icon" className="" height={0} width={0} />
              </div>
          <div className="font-bold text-lg">Rohit pandey</div>
          <div className="">
            I am a Web App Developer, and I like to creates user-freindly web application using Javascript to create Illusive, Scalable websites.
          </div>
          <hr className="lg:col-span-2"/>
          <div className="text-center lg:col-span-2">Created by Rohit pandey</div>
        </div>
    </section>
  )
}