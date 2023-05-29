import React, {useEffect, useState} from 'react'
import Card from '../../components/Card/Card'
import styles from "./auth.module.scss"
import PasswordInput from '../../components/PasswordInput/PasswordInput'
import { TiUserAddOutline } from 'react-icons/ti'
import { Link, useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'
import { BsCheck2All } from 'react-icons/bs'
import { toast } from 'react-toastify'
import { validateEmail } from '../../redux/features/auth/authService'
import { useDispatch, useSelector } from 'react-redux'
import { register, RESET, sendVerificationEmail } from '../../redux/features/auth/authSlice'
import Loader from "../../components/Loader/Loader"


const initialState = {
  name: "",
  email: "",
  password: "",
  password2: "",
}

const Register = () => {
  const [formData, setFormData] = useState(initialState);
  const {name, email, password, password2} = formData;

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {isLoading, isLoggedIn, isSuccess,} = useSelector((state) => state.auth)

  const [upperCase, setUpperCase] = useState(false)
  const [num, setNum] = useState(false)
  const [specialChar, setSpecialChar] = useState(false)
  const [passLength, setPassLength] = useState(false)


  const timesIcon = <FaTimes color='red' size={15} />
  const checkIcon = <BsCheck2All color='green' size={15} />

  const switchIcon = (condition) => {
    if(condition) {
      return checkIcon
    }
    return timesIcon
  }
  

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({...formData, [name]: value})
  };
  

  useEffect(() => {
    // Check Lower and Uppercase
    if(password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
      setUpperCase(true)
    } else {
      setUpperCase(false)
    }

    // Check For Numbers
    if(password.match(/([0-9])/)){
      setNum(true)
    } else {
      setNum(false)
    }

    // Check For Special Character
    if(password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
      setSpecialChar(true)
    } else {
      setSpecialChar(false)
    }

    // Check Password Length
    if(password.length > 5){
      setPassLength(true)
    } else {
      setPassLength(false)
    }
  }, [password])

  const registerUser = async (e) => {
    e.preventDefault();

    if(!name || !email || !password){
      return toast.error("All fields required.")
    }

    if(password.length < 6){
      return toast.warn("Password must be up to 6 character.")
    }

    if(!validateEmail(email)){
      return toast.warn("Please enter a valid email.")
    }

    if(!password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
      return toast.warn("Password must be have Spacial Character.")
    }

    if(password !== password2){
      return toast.warn("Password do not match.")
    }

    const userData = {
      name, email, password
    }
    
    await dispatch(register(userData))
    await dispatch(sendVerificationEmail())
  };

  useEffect(() => {
    if(isSuccess && isLoggedIn){
      navigate("/profile")
    }

    dispatch(RESET())
  }, [isLoggedIn, isSuccess, dispatch, navigate])

  return (
    <div className={`container ${styles.auth}`}>
      {isLoading &&  <Loader />}
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
             <TiUserAddOutline size={35} color="#999" />
          </div>
          <h2>Register</h2>

          <form onSubmit={registerUser}>
            <input type="text" placeholder='Name' required name='name' value={name} onChange={handleInputChange} />
            <input type="email" placeholder='Email' required name='email' value={email} onChange={handleInputChange} />
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
              onPaste={(e) => {
                e.preventDefault()
                toast.warn("Cannot paste into input field.")
                return false
              }}
            />

            {/* Password Strength */}
            <Card cardClass={styles.group}>
              <ul className='form-list'>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(upperCase)}
                    &nbsp; Lowercase & Uppercase
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(num)}
                    &nbsp; Number (0-9)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(specialChar)}
                    &nbsp; Special Character (!@#$%^&*)
                  </span>
                </li>
                <li>
                  <span className={styles.indicator}>
                    {switchIcon(passLength)}
                    &nbsp; At least 6 Character
                  </span>
                </li>
              </ul>
            </Card>
            <button type='submit' className='--btn --btn-primary --btn-block'>Register</button>
          </form>
          

          <span className={styles.register}>
            <Link to="/">Home</Link>
            <p> &nbsp; Already have on account? &nbsp; </p>
            <Link to="/login">Login</Link>
          </span>

        </div>
      </Card>
    </div>
  )
}

export default Register