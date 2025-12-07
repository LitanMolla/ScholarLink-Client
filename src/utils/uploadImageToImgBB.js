import axios from "axios";


const uploadImageToImgBB = async (file) => {
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY
    const formData = new FormData()
    formData.append("image", file);
    try {
        const { data } = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData)
        return data?.data.url
    } catch (error) {
        return error.code
    }
}

export default uploadImageToImgBB