import React, {useEffect, useState} from 'react'
import Card from '../../components/Card/Card'
import styles from "./auth.module.scss"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { MdPassword } from 'react-icons/md'
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../components/Loader/Loader'
import { RESET, resetPassword } from '../../redux/features/auth/authSlice'
import { toast } from 'react-toastify'


const initialState = {
  password: "",
  password2: "",
}

const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const {password, password2} = formData;
  const {resetToken} = useParams();

  const {isLoading, isSuccess, message} = useSelector((state) => state.auth)

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const reset = async (e) => {
    e.preventDefault();

    if(!password || !password2){
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

    const userData = {password}

    await dispatch(resetPassword({userData, resetToken}));
  }

  useEffect(() => {
    if(isSuccess && message.includes("Password Reset Successfull, pleas login.")){
      navigate("/login")
    }

    dispatch(RESET())
  }, [dispatch, navigate, isSuccess, message])

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading &&  <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" /> 
          </div>
          <h2>Reset Password</h2>

          <form onSubmit={reset}>
              <PasswordInput 
                placeholder='Password' 
                name='password' 
                value={password} 
                onChange={handleInputChange}
              />
              <PasswordInput 
                placeholder='Confirm Password' 
                name='password2' 
                value={password2} 
                onChange={handleInputChange}
              />            
            <button type='submit' className='--btn --btn-primary --btn-block'>Save</button>

            <div className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/login">- Login</Link>
              </p>
            </div>
          </form>
          
        </div>
      </Card>
    </div>
  )
}

export default ResetPassword