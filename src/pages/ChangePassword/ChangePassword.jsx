import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Card from '../../components/Card/Card'
import { Spinner } from '../../components/Loader/Loader'
import PageMenu from '../../components/PageMenu/PageMenu'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import useRedirectLoggedOutUser from '../../customHook/useRedirectLoggedOutUser'
import { changePassword, logout, RESET } from '../../redux/features/auth/authSlice'
import { sendAutomatedEmail } from '../../redux/features/email/emailSlice'
import "./ChangePassword.scss"

const initialState = {
  oldPassword: "",
  password: "",
  password2: ""
}

const ChangePassword = () => {
  useRedirectLoggedOutUser("/login");

  const [formData, setFormData] = useState(initialState)
  const {oldPassword, password, password2} = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const {isLoading, user} = useSelector((state) => state.auth)

  const updatePassword = async (e) => {
    e.preventDefault()

    if(!oldPassword || !password || !password2){
      return toast.error("All fields required.")
    }

    if(password.length < 6){
      return toast.warn("Password must be up to 6 character.")
    }

    if(!password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
      return toast.warn("Password must be have Spacial Character.")
    }

    if(password !== password2){
      return toast.warn("Password do not match.")
    }

    const userData = {oldPassword, password}

    const emailData = {
      subject: "Password Change - AUTH-A",
      send_to: user.email,
      reply_to: "noreply@azisprtm.com",
      template: "changePassword",
      url: "/forgot"
    }
    
    await dispatch(changePassword(userData))
    await dispatch(sendAutomatedEmail(emailData))
    await dispatch(logout())
    await dispatch(RESET(userData))
    navigate("/login")
  }
  return (
    <>
      <section>
        <div className="container">
          <PageMenu />
          <h2>Change Password</h2>
          <div className="--flex-start change-password">
            <Card cardClass={"card"}>
              <>
                <form onSubmit={updatePassword}>
                  <p>
                    <label>Current Password :</label>
                    <PasswordInput 
                      placeholder='Old Password' 
                      name='oldPassword' 
                      value={oldPassword} 
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>New Password:</label>
                    <PasswordInput 
                      placeholder='Password' 
                      name='password' 
                      value={password} 
                      onChange={handleInputChange}
                    />
                  </p>
                  <p>
                    <label>Confirm New Password:</label>
                    <PasswordInput 
                      placeholder='Confirm Password' 
                      name='password2' 
                      value={password2} 
                      onChange={handleInputChange}
                    />
                  </p>
                  {isLoading ? <Spinner/> : (
                    <button type='submit' className='--btn --btn-danger --btn-block'>
                      Change Password
                    </button>
                  )}  
                </form>
              </>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

export default ChangePassword