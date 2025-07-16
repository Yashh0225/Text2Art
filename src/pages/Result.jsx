import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { motion } from 'motion/react'
const Result = () => {

  const[image,setImage] =useState(assets.sample_img_1)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")

 const onSubmitHandler = async (e) => {
  e.preventDefault();  // prevent page reload
  if (!input.trim()) return;

  setLoading(true);
  setIsImageLoaded(false);

  try {
    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": import.meta.env.VITE_CLIPDROP_API_KEY

      },
      body: JSON.stringify({
        prompt: input,
      })
    });

    if (!response.ok) {
      throw new Error("Failed to generate image");
    }

    const blob = await response.blob();
    const imageURL = URL.createObjectURL(blob);
    setImage(imageURL);
    setIsImageLoaded(true);
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again.");
  }

  setLoading(false);
};



  return (
    <motion.form
    initial={{ opacity: 0.2, y: 100 }}
    transition={{ duration: 1 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onSubmit={onSubmitHandler} className='flex flex-col items-center justify-center min-h-[90vh]'>
    <div>
        <div className='relative'>
        <img src={assets.sample_img_1} alt="" className='max-w-sm rounded'/>
        <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 
        ${loading?'w-full transition-all duration-[10s]' : 'w-0'} `}/>
        </div>
        <p className={!loading ? "hidden" : ""} >Loading....</p>

    </div>
    
    {!isImageLoaded && 
    <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full '>

        <input onChange={e=>setInput(e.target.value)} value={input}
        type="text" placeholder='Describe what you want to generate'
        className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color' />

        <button type="submit" 
        className='bg-zinc-900 text-white rounded-full px-10 sm:px-16 py-3'>
          Generate</button>
    </div>
}


    {isImageLoaded &&
      <div className='flex flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full gap-2'>
      <p onClick={()=>{setIsImageLoaded(false)}}
      className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>
        Generate Another</p>

      <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
    </div>}

    </motion.form>
  )
}

export default Result
