import React ,{useEffect,useState }from 'react'
import { Form,Input,message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner';

const Login = () => {
    const [loading,setLoading]=useState(false);
    const navigate=useNavigate()
   //form submit 
        const submitHandle= async (values)=>{
      try {
        setLoading(true);
        const {data}=await axios.post('/api/v1/users/login',values)
        setLoading(false)
        message.success("login succesfull")
        localStorage.setItem('user',JSON.stringify({...data.user,password:''}))
     
        navigate('/')
      } catch (error) {
        setLoading(false)
        message.error('something went wrong')
      }
    };
   //prevent protected user
   useEffect(()=>{
    if(localStorage.getItem('user')){
        navigate('/')
    }
},[navigate]);

  return (
    <>
       <div className='register-page d-flex align-items-center justify-content-center'>
       {loading && <Spinner />}
        <Form layout='vertical' onFinish={submitHandle}>
        <h1>Money Tracker - Login Form</h1>
            <Form.Item label="Name" name="name">
                <Input type='text'/>
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input type='email'/>
            </Form.Item>
            <Form.Item label="Password" name="password">
                <Input type='password'/>
            </Form.Item>
            <div className='d-flex'>
            <Link to='/register'>Not registerd ? click here to register</Link>
            <button className='btn btn-primary'>Login</button>
            </div>
        </Form>
      </div>
    </>
  )
}

export default Login
