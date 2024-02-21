import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { BASE_URL } from '../../helpers/config'
import useValidation from '../custom/useValidation'
import Spinner from '../layouts/Spinner'
import { AuthContext } from '../../context/authContext'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(null)
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const { accessToken, setAccessToken, setCurrentUser} = useContext(AuthContext)


    useEffect(() => {
        if (accessToken) navigate('/')
    }, [accessToken])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors(null)
        setLoading(true)
        const data = { email, password}

        try {
            const response = await axios.post(`${BASE_URL}/user/login`, data)
            if (response.data.error) {
                setLoading(false)
                toast.error(response.data.error)
            }else {
                localStorage.setItem('currentToken', JSON.stringify(response.data.currentToken))
                setAccessToken(response.data.currentToken)
                setCurrentUser(response.data.user)
                setLoading(false)
                setEmail('')
                setPassword('')
                toast.success(response.data.message)
                navigate('/')
            }
        } catch (error) {
            setLoading(false)
            if (error?.response?.status === 422) {
                setErrors(error.response.data.errors)
            }
            console.log(error)
        }
    }

    return (
        <div className="container">
            <div className="row my-5">
                <div className="col-md-6 mx-auto">
                    <div className="card">
                        <div className="card-header bg-white">
                            <h4 className="text-center mt-2">
                                Login
                            </h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputEmail1" className="form-label">Email address*</label>
                                    <input type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                                    { useValidation(errors, 'email')}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="exampleInputPassword1" className="form-label">Password*</label>
                                    <input type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="form-control" id="exampleInputPassword1" />
                                    { useValidation(errors, 'password')}
                                </div>
                                { 
                                    loading ? 
                                        <Spinner />
                                    :
                                    <button type="submit" className="btn btn-primary">Submit</button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
