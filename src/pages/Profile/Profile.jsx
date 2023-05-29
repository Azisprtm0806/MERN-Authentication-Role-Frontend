import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Card from '../../components/Card/Card'
import Loader from '../../components/Loader/Loader'
import Notification from '../../components/Notification/Notification'
import PageMenu from '../../components/PageMenu/PageMenu'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { getUser, selectUser, updateUser } from '../../redux/features/auth/authSlice'
import "./Profile.scss"


const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const upload_preset = process.env.REACT_APP_UPLOAD_PRESET;

export const shortenText = (text, n) => {
  if(text.length > n){
    const shortenedText = text.substring(0, n).concat("...");
    return shortenedText;
  }
  return text;
}

const Profile = () => {
  useRedirectLoggedOutUser("/login");

  const dispatch = useDispatch();

  const {isLoading, user} = useSelector((state) => state.auth);
  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    photo: user?.photo || "",
    role: user?.role || "",
    isVerified:user?.isVerified || false,
  };
  const [profile, setProfile] = useState(initialState)
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0])
    setImagePreview(URL.createObjectURL(e.target.files[0]))
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setProfile({...profile, [name]: value})
  };

  const saveProfile = async(e) => {
    e.preventDefault()

    let imageUrl;
    try {
      if(profileImage !== null && (
            profileImage.type === "image/jpeg" || 
            profileImage.type === "image/jpg" || 
            profileImage.type === "image/png"
          )
        ){
          // save image to cloudinary
          const image = new FormData()
          image.append("file", profileImage)
          image.append("cloud_name", cloud_name)
          image.append("upload_preset", upload_preset)

          const response = await fetch(
            "https://api.cloudinary.com/v1_1/ddf6mjgr0/image/upload", 
            {method: "POST", body: image}
          );
          const imageData = await response.json()
          console.log(imageData);
          imageUrl = imageData.url.toString()
      }

      // Save data profile to mongoDB
      const userData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageUrl : profile.photo,
      }

      dispatch(updateUser(userData))
    } catch (error) {
      toast.error(error.message)
    }
  };

  useLayoutEffect(() => {
    if(user){
      setProfile({
        ...profile,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified
      })
    }
  }, [user])

  return (
    <>
      {isLoading && <Loader />}
      {!profile.isVerified && <Notification/>}
      <section>
        <div className="container">
          <PageMenu />
          <h2>Profile</h2>
          <div className="--flex-start profile">
            <Card cardClass={"card"}>
              {!isLoading && user && (
                <>
                  <div className="profile-photo">
                    <div>
                      <img src={imagePreview === null ? user?.photo : imagePreview} alt="ProfileImage" referrerpolicy="no-referrer" />
                      <h3>Role: {profile.role}</h3>
                    </div>
                  </div>
                  <form onSubmit={saveProfile}>
                    <p>
                      <label>Change Photo:</label>
                      <input type="file" accept='image/*' name='image' onChange={handleImageChange} />
                    </p>
                    <p>
                      <label>Name :</label>
                      <input type="text" name='name' value={profile.name} onChange={handleInputChange} />
                    </p>
                    <p>
                      <label>Email :</label>
                      <input type="email" name='email' value={profile.email} onChange={handleInputChange} disabled />
                    </p>
                    <p>
                      <label>Phone :</label>
                      <input type="text" name='phone' value={profile.phone} onChange={handleInputChange} />
                    </p>
                    <p>
                      <label>Bio :</label>
                      <textarea name="bio" value={profile.bio} onChange={handleInputChange} cols="30" rows="10" ></textarea>
                    </p>
                    <button className='--btn --btn-primary --btn-block'>
                      Update Profile
                    </button>
                  </form>
                </>
              )}
              
            </Card>
          </div>
        </div>
      </section>
    </>
  )
};

export const UserName = () => {
  const user = useSelector(selectUser);

  const username = user?.name || "..."

  return <p className="--color-white">Hi, {username} |</p>

}

export default Profile